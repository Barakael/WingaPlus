import React, { useEffect, useState } from 'react';
import { Store, Plus, Search, X } from 'lucide-react';
import { getShops, createShop, updateShop, deleteShop } from '../../services/superAdmin';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

interface Shop {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  description: string;
  owner_id?: number;
  owner?: {
    id: number;
    name: string;
  };
}

const ShopsManagement: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    address: '',
    phone: '',
    email: '',
    status: 'active',
    description: '',
  });

  useEffect(() => {
    fetchShops();
  }, [searchTerm, statusFilter]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;
      
      const data = await getShops(params);
      setShops(data.data || []);
    } catch (error: any) {
      showErrorToast('Failed to load shops');
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingShop) {
        await updateShop(editingShop.id, formData);
        showSuccessToast('✏️ Shop updated successfully!');
      } else {
        await createShop(formData);
        showSuccessToast('✅ Shop created successfully!');
      }
      
      setShowModal(false);
      resetForm();
      fetchShops();
    } catch (error: any) {
      showErrorToast(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    
    try {
      await deleteShop(id);
      showSuccessToast('🗑️ Shop deleted successfully!');
      fetchShops();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to delete shop');
    }
  };

  const handleEdit = (shop: Shop) => {
    setEditingShop(shop);
    setFormData({
      name: shop.name,
      location: shop.location || '',
      address: shop.address || '',
      phone: shop.phone || '',
      email: shop.email || '',
      status: shop.status,
      description: shop.description || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingShop(null);
    setFormData({
      name: '',
      location: '',
      address: '',
      phone: '',
      email: '',
      status: 'active',
      description: '',
    });
  };

  // Mobile detection not directly needed; using CSS breakpoints

  const StatusToggle: React.FC<{ value: string; onChange: (next: string) => void }> = ({ value, onChange }) => {
    const active = value === 'active';
    return (
      <button
        type="button"
        onClick={() => onChange(active ? 'inactive' : 'active')}
        className={`relative inline-flex h-6 w-12 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1973AE] ${active ? 'bg-white border border-green-500 shadow-inner' : 'bg-gray-300 border border-gray-500'}`}
        aria-label={active ? 'Set inactive' : 'Set active'}
      >
        <span
          className={`inline-block h-5 w-5 rounded-full transform transition-transform ${active ? 'translate-x-6 bg-green-500' : 'translate-x-1 bg-gray-700'}`}
        />
      </button>
    );
  };

  const ActionsMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
    const [open, setOpen] = useState(false);
    return (
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Actions"
        >
          <span className="text-xl leading-none text-gray-600 dark:text-gray-300">•••</span>
        </button>
        {open && (
          <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10 text-xs">
            <button onClick={() => { setOpen(false); onEdit(); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
            <button onClick={() => { setOpen(false); onDelete(); }} className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">Delete</button>
          </div>
        )}
      </div>
    );
  };

  const handleStatusChange = async (shop: Shop, nextStatus: string) => {
    try {
      await updateShop(shop.id, { status: nextStatus });
      showSuccessToast(`Status updated to ${nextStatus}`);
      fetchShops();
    } catch (e: any) {
      showErrorToast(e.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shops Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all shops in the system
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-[#1973AE] text-white px-4 py-2 rounded-lg flex items-center hover:bg-[#0d5a8a] transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Shop
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search shops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Shops List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#1973AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading shops...</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-12">
            <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No shops found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Owner</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {shops.map(shop => (
                    <tr key={shop.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white flex items-center"><Store className="h-4 w-4 text-[#1973AE] mr-1" /> {shop.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{shop.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900 dark:text-white">{shop.address}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900 dark:text-white">{shop.phone}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{shop.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-900 dark:text-white">{shop.owner?.name || 'No owner'}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusToggle value={shop.status} onChange={(ns) => handleStatusChange(shop, ns)} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs"><ActionsMenu onEdit={() => handleEdit(shop)} onDelete={() => handleDelete(shop.id, shop.name)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {shops.map(shop => (
                <div key={shop.id} className="p-4 flex flex-col space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white flex items-center"><Store className="h-4 w-4 text-[#1973AE] mr-1" /> {shop.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{shop.location}</div>
                    </div>
                    <ActionsMenu onEdit={() => handleEdit(shop)} onDelete={() => handleDelete(shop.id, shop.name)} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Owner:</span>
                    <span className="text-gray-900 dark:text-white">{shop.owner?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Phone:</span>
                    <span className="text-gray-900 dark:text-white">{shop.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-700 dark:text-gray-300">Status:</span>
                    <StatusToggle value={shop.status} onChange={(ns) => handleStatusChange(shop, ns)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {editingShop ? 'Edit Shop' : 'Add New Shop'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Shop Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a]"
                  >
                    {editingShop ? 'Update Shop' : 'Create Shop'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopsManagement;
