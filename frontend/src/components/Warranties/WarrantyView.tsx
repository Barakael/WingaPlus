import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock, Eye, RefreshCw } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import ViewWarrantyModal from './ViewWarrantyModal';

interface WarrantyViewProps {
  onFileWarranty: () => void;
  openSaleForm?: (prefill?: any, onComplete?: () => void) => void;
}

const WarrantyView: React.FC<WarrantyViewProps> = ({ onFileWarranty, openSaleForm }) => {
  const { user } = useAuth();
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loadingWarranties, setLoadingWarranties] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState<any>(null);

  // Fetch sales that have warranties
  const fetchWarranties = async () => {
    try {
      const salesmanId = user?.id;
      const url = salesmanId 
        ? `${BASE_URL}/sales?salesman_id=${salesmanId}`
        : `${BASE_URL}/sales`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Our API wraps responses as { success, data: { data: [...], total: ... }, message }
        const sales = data?.data?.data ?? [];
        // Filter only sales that have warranties
        const warrantySales = (sales || []).filter((s: any) => s.has_warranty === true || s.has_warranty === 1);
        // Map to the warranty shape expected by the UI
        const mapped = warrantySales.map((s: any) => ({
          id: s.id,
          phone_name: s.product_name || (s.warranty_details?.phone_name ?? ''),
          customer_name: s.customer_name || (s.warranty_details?.customer_name ?? ''),
          customer_phone: s.customer_phone || (s.warranty_details?.customer_phone ?? ''),
          color: s.warranty_details?.color ?? '',
          storage: s.warranty_details?.storage ?? '',
          store_name: s.warranty_details?.store_name ?? '',
          reference_store: s.reference_store || (s.warranty_details?.reference_store ?? ''),
          email: s.warranty_details?.customer_email ?? '',
          expiry_date: s.warranty_end ?? null,
          warranty_months: s.warranty_months ?? (s.warranty_details?.warranty_months ?? null),
          status: s.warranty_status ?? 'unknown',
          created_at: s.created_at,
        }));

        console.log('Mapped warranties:', mapped);
        setWarranties(mapped);
      }
    } catch (error) {
      console.error('Error fetching warranties:', error);
    } finally {
      setLoadingWarranties(false);
    }
  };

  // Fetch warranties on component mount
  React.useEffect(() => {
    fetchWarranties();
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(warranties.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedWarranties = warranties.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Action handlers
  const handleViewWarranty = (warranty: any) => {
    setSelectedWarranty(warranty);
    setViewModalOpen(true);
  };

  // Modal handlers
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedWarranty(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Expires today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getDaysRemainingColor = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (diffDays <= 30) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Warranty Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            View and track product warranties
          </p>
        </div>
        <button
          onClick={onFileWarranty}
          className="md:text-base text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
        >
         
          File New Warranty
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
          <h2 className="md:text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Warranty Records
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchWarranties}
              disabled={loadingWarranties}
              className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loadingWarranties ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Warranty Table */}
        <div className="overflow-x-auto">
          {loadingWarranties ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">Loading warranties...</div>
          ) : warranties.length > 0 ? (
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white min-w-[80px] sm:min-w-[100px]">Status</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white min-w-[120px] sm:min-w-[150px]">Product</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white min-w-[100px] sm:min-w-[120px]">Customer</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell min-w-[100px]">Phone</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white hidden md:table-cell min-w-[80px]">Color</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white hidden lg:table-cell min-w-[80px]">Storage</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white hidden xl:table-cell min-w-[100px]">Expiry Date</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white min-w-[120px] sm:min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedWarranties.map((warranty) => (
                  <tr 
                    key={warranty.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    onClick={() => handleViewWarranty(warranty)}
                  >
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-2">
                       
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(warranty.status || 'active')}`}>
                          {warranty.status ? warranty.status.replace('_', ' ') : 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white">
                      <div className="font-medium text-sm">{warranty.phone_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {warranty.warranty_months ? `${warranty.warranty_months} months` : 'N/A'}
                      </div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white">
                      <div className="font-medium text-sm">{warranty.customer_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{warranty.store_name}</div>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white hidden sm:table-cell">
                      {warranty.customer_phone}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white hidden md:table-cell">
                      {warranty.color || 'N/A'}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white hidden lg:table-cell">
                      {warranty.storage || 'N/A'}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white hidden xl:table-cell">
                      <div className="text-sm">
                        {warranty.expiry_date ? new Date(warranty.expiry_date).toLocaleDateString() : 'N/A'}
                      </div>
                      {warranty.expiry_date && (
                        <div className={`text-xs font-medium ${getDaysRemainingColor(warranty.expiry_date)}`}>
                          {getDaysRemaining(warranty.expiry_date)}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewWarranty(warranty);
                          }}
                          className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                          title="View Warranty Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No warranties filed yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Start by filing your first warranty claim
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {warranties.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, warranties.length)} of {warranties.length} warranties
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ViewWarrantyModal
        warranty={selectedWarranty}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
    </div>
  );
};

export default WarrantyView;