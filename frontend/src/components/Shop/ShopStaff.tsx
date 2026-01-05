import React, { useState, useEffect, useCallback } from 'react';
import { Users, Plus, RefreshCw, Eye, Edit, Trash2, Search, TrendingUp, ShoppingCart, Award, UserCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

interface StaffMember {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'salesman' | 'storekeeper';
  shop_id: number;
  active: boolean;
  created_at: string;
  total_sales?: number;
  total_profit?: number;
  sales_count?: number;
}

const ShopStaff: React.FC = () => {
  const { user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'salesman' | 'storekeeper'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [filteredStaff, setFilteredStaff] = useState<StaffMember[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);

  // Fetch staff
  const fetchStaff = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/users?shop_id=${user.shop_id || user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const staffData = data?.data?.data || data?.data || [];
        // Filter out shop owners and super admins
        const filteredStaffData = staffData.filter(
          (member: StaffMember) => member.role === 'salesman' || member.role === 'storekeeper'
        );
        setStaff(filteredStaffData);
        setFilteredStaff(filteredStaffData);

        // Fetch sales stats for each salesman
        filteredStaffData.filter((s: StaffMember) => s.role === 'salesman').forEach((salesman: StaffMember) => {
          fetchSalesStats(salesman.id);
        });
      }
    } catch (err) {
      console.error('Error fetching staff:', err);
      showErrorToast('Failed to load staff');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch sales stats for a salesman
  const fetchSalesStats = async (salesmanId: number) => {
    try {
      const response = await fetch(`${BASE_URL}/api/sales?salesman_id=${salesmanId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sales = data?.data?.data || data?.data || [];
        
        const totalProfit = sales.reduce((sum: number, sale: any) => {
          const profit = sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0);
          return sum + profit;
        }, 0);

        const totalSales = sales.reduce((sum: number, sale: any) => {
          return sum + (Number(sale.total_amount) - (Number(sale.offers) || 0));
        }, 0);

        // Update staff member with stats
        setStaff(prevStaff => 
          prevStaff.map(member => 
            member.id === salesmanId
              ? { ...member, total_sales: totalSales, total_profit: totalProfit, sales_count: sales.length }
              : member
          )
        );
      }
    } catch (err) {
      console.error(`Error fetching sales stats for salesman ${salesmanId}:`, err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // Apply filters
  useEffect(() => {
    let filtered = staff;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Status filter
    if (statusFilter === 'active') {
      filtered = filtered.filter(member => member.active);
    } else if (statusFilter === 'inactive') {
      filtered = filtered.filter(member => !member.active);
    }

    setFilteredStaff(filtered);
    setCurrentPage(1);
  }, [staff, searchTerm, roleFilter, statusFilter]);

  // Calculate stats
  const totalStaff = staff.length;
  const activeSalesmen = staff.filter(s => s.role === 'salesman' && s.active).length;
  const activeStorekeepers = staff.filter(s => s.role === 'storekeeper' && s.active).length;
  const inactiveStaff = staff.filter(s => !s.active).length;

  // Pagination
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedStaff = filteredStaff.slice(startIndex, endIndex);

  // Handle actions
  const handleViewStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    setViewModalOpen(true);
  };

  const handleEditStaff = (member: StaffMember) => {
    setSelectedStaff(member);
    setEditModalOpen(true);
  };

  const handleDeleteStaff = async (member: StaffMember) => {
    if (!window.confirm(`Are you sure you want to delete "${member.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/users/${member.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete staff member');
      }

      showSuccessToast('Staff member deleted successfully!');
      fetchStaff();
    } catch (err) {
      console.error('Error deleting staff:', err);
      showErrorToast('Failed to delete staff member');
    }
  };

  const toggleStaffStatus = async (member: StaffMember) => {
    try {
      const response = await fetch(`${BASE_URL}/api/users/${member.id}/toggle-status`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update staff status');
      }

      showSuccessToast(`Staff member ${member.active ? 'deactivated' : 'activated'} successfully!`);
      fetchStaff();
    } catch (err) {
      console.error('Error updating staff status:', err);
      showErrorToast('Failed to update staff status');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'salesman':
        return <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">Salesman</span>;
      case 'storekeeper':
        return <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">Storekeeper</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-xs rounded-full">{role}</span>;
    }
  };

  if (loading && staff.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-[#1973AE] animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading staff...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Staff Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your team members and track performance
          </p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="w-full sm:w-auto bg-sky-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-sky-600 transition-all duration-200 flex items-center justify-center"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          Add Staff
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Staff</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalStaff}</p>
            </div>
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#1973AE]" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Storekeepers</p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{activeStorekeepers}</p>
            </div>
            <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          </div>
        </div>
      </div>

   

      {/* Staff List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Staff Members ({filteredStaff.length})
          </h2>
          <button
            onClick={fetchStaff}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Mobile View - Cards */}
        <div className="block sm:hidden space-y-3">
          {paginatedStaff.map((member) => (
            <div key={member.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                    {member.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{member.email}</p>
                </div>
                <div className="flex flex-col items-end space-y-1">
                  {getRoleBadge(member.role)}
                  {member.active ? (
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                      Active
                    </span>
                  ) : (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                      Inactive
                    </span>
                  )}
                </div>
              </div>

              {member.role === 'salesman' && (
                <div className="grid grid-cols-3 gap-2 text-xs mb-3 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Sales:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{member.sales_count || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Revenue:</span>
                    <span className="ml-1 font-medium text-green-600">{formatCurrency(member.total_sales || 0)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Profit:</span>
                    <span className="ml-1 font-medium text-[#1973AE]">{formatCurrency(member.total_profit || 0)}</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button
                  onClick={() => handleViewStaff(member)}
                  className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </button>
                <button
                  onClick={() => toggleStaffStatus(member)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center ${
                    member.active
                      ? 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-200 hover:bg-orange-200 dark:hover:bg-orange-800'
                      : 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                  }`}
                >
                  {member.active ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => handleEditStaff(member)}
                  className="flex-1 bg-[#1973AE] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#0d5a8a] transition-colors flex items-center justify-center"
                >
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedStaff.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {member.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getRoleBadge(member.role)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {member.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.role === 'salesman' ? (
                      <div className="text-xs space-y-1">
                        <div className="flex items-center">
                          <ShoppingCart className="h-3 w-3 mr-1 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{member.sales_count || 0} sales</span>
                        </div>
                        <div className="flex items-center">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
                          <span className="text-green-600 font-medium">TSh {formatCurrency(member.total_profit || 0)}</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member.active ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleViewStaff(member)}
                        className="text-gray-600 dark:text-gray-400 hover:text-[#1973AE] dark:hover:text-[#5da3d5]"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditStaff(member)}
                        className="text-gray-600 dark:text-gray-400 hover:text-[#1973AE] dark:hover:text-[#5da3d5]"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => toggleStaffStatus(member)}
                        className={member.active ? 'text-orange-600 hover:text-orange-900' : 'text-green-600 hover:text-green-900'}
                        title={member.active ? 'Deactivate' : 'Activate'}
                      >
                        <UserCheck className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(member)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStaff.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No staff members found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredStaff.length)} of {filteredStaff.length} staff
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* TODO: Add modals for view, add, and edit staff */}
      {/* These would be similar to the product modals created earlier */}
    </div>
  );
};

export default ShopStaff;
