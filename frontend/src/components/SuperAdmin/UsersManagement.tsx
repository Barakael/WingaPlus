import React, { useEffect, useState } from 'react';
import { Users, Search, X } from 'lucide-react';
import { getUsers, updateUser, deleteUser } from '../../services/superAdmin';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  shop_id?: number;
  shop?: {
    id: number;
    name: string;
    location?: string;
  };
}

const UsersManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'salesman',
    shop_id: '',
  });

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (roleFilter) params.role = roleFilter;
      
      const data = await getUsers(params);
      setUsers(data.data || []);
    } catch (error: any) {
      showErrorToast('Failed to load users');
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserStatusChange = async (user: User, nextStatus: string) => {
    try {
      await updateUser(user.id, { status: nextStatus });
      showSuccessToast(`Status updated to ${nextStatus}`);
      fetchUsers();
    } catch (e: any) {
      showErrorToast(e.message || 'Failed to update status');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingUser) return;
    
    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
      };
      
      if (formData.shop_id) {
        updateData.shop_id = parseInt(formData.shop_id);
      }
      
      await updateUser(editingUser.id, updateData);
      showSuccessToast('✏️ User updated successfully!');
      
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      showErrorToast(error.message || 'Operation failed');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`Are you sure you want to delete user "${name}"?`)) return;
    
    try {
      await deleteUser(id);
      showSuccessToast('🗑️ User deleted successfully!');
      fetchUsers();
    } catch (error: any) {
      showErrorToast(error.message || 'Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      shop_id: user.shop_id?.toString() || '',
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'salesman',
      shop_id: '',
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'shop_owner':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'salesman':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'storekeeper':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Users Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage all users in the system
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="shop_owner">Shop Owner</option>
            <option value="salesman">Salesman</option>
            <option value="storekeeper">Storekeeper</option>
          </select>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#1973AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Shop</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-semibold text-gray-900 dark:text-white">{u.name}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400 truncate max-w-[160px]">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs text-gray-900 dark:text-white">{u.shop?.name || '—'}</div>
                        <div className="text-[10px] text-gray-500 dark:text-gray-400">{u.shop?.location || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded-full ${getRoleBadgeColor(u.role)}`}>{u.role.replace('_', ' ')}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusToggle value={u.status === 'inactive' ? 'inactive' : 'active'} onChange={(ns) => handleUserStatusChange(u, ns)} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs">
                        <ActionsMenu onEdit={() => handleEdit(u)} onDelete={() => handleDelete(u.id, u.name)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="sm:hidden divide-y divide-gray-200 dark:divide-gray-700">
              {users.map(u => (
                <div key={u.id} className="p-4 flex flex-col space-y-2 text-xs">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{u.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-400">{u.email}</div>
                    </div>
                    <ActionsMenu onEdit={() => handleEdit(u)} onDelete={() => handleDelete(u.id, u.name)} />
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Shop:</span>
                    <span className="text-gray-900 dark:text-white">{u.shop?.name || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Location:</span>
                    <span className="text-gray-900 dark:text-white">{u.shop?.location || '—'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-gray-700 dark:text-gray-300">Status:</span>
                    <StatusToggle value={u.status === 'inactive' ? 'inactive' : 'active'} onChange={(ns) => handleUserStatusChange(u, ns)} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Edit User
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
                    Name *
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
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="salesman">Salesman</option>
                    <option value="shop_owner">Shop Owner</option>
                    <option value="storekeeper">Storekeeper</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
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
                    Update User
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

// Local UI helpers: Status toggle and actions menu
const StatusToggle: React.FC<{ value: string; onChange: (next: string) => void }> = ({ value, onChange }) => {
  const active = value === 'active';
  return (
    <button
      type="button"
      onClick={() => onChange(active ? 'inactive' : 'active')}
      className={`relative inline-flex h-6 w-12 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#1973AE] ${active ? 'bg-white border border-green-500 shadow-inner' : 'bg-gray-300 border border-gray-500'}`}
      aria-label={active ? 'Set inactive' : 'Set active'}
    >
      <span className={`inline-block h-5 w-5 rounded-full transform transition-transform ${active ? 'translate-x-6 bg-green-500' : 'translate-x-1 bg-gray-700'}`} />
    </button>
  );
};

const ActionsMenu: React.FC<{ onEdit: () => void; onDelete: () => void }> = ({ onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button type="button" onClick={() => setOpen(o => !o)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700" aria-label="Actions">
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

// (no exports)

export default UsersManagement;
