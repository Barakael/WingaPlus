import React, { useState, useEffect } from 'react';
import { X, Tag, Plus, Edit, Trash2, Save } from 'lucide-react';
import { BASE_URL } from '../../api/api';
import { showSuccessToast, showErrorToast } from '../../../lib/toast';
import { useAuth } from '../../../contexts/AuthContext';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CategoryManagementProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoriesUpdated?: () => void;
  initialCategories?: Category[];
}

type Mode = 'list' | 'add' | 'edit';

const CategoryManagement: React.FC<CategoryManagementProps> = ({
  isOpen,
  onClose,
  onCategoriesUpdated,
  initialCategories = [],
}) => {
  const { user } = useAuth();
  const [mode, setMode] = useState<Mode>('list');
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Backend will automatically determine shop_id from authenticated user
      const response = await fetch(`${BASE_URL}/api/categories`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const categoriesData = data?.data?.data || data?.data || [];
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
      showErrorToast('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      showErrorToast('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
          // shop_id will be determined by the backend from the authenticated user
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to create category');
      }

      showSuccessToast('Category created successfully!');
      setFormData({ name: '', description: '' });
      setMode('list');
      await fetchCategories();
      onCategoriesUpdated?.();
    } catch (err: any) {
      console.error('Error creating category:', err);
      showErrorToast(err?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingCategory || !formData.name.trim()) {
      showErrorToast('Category name is required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to update category');
      }

      showSuccessToast('Category updated successfully!');
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      setMode('list');
      await fetchCategories();
      onCategoriesUpdated?.();
    } catch (err: any) {
      console.error('Error updating category:', err);
      showErrorToast(err?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category: Category) => {
    if (!window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/categories/${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete category');
      }

      showSuccessToast('Category deleted successfully!');
      await fetchCategories();
      onCategoriesUpdated?.();
    } catch (err) {
      console.error('Error deleting category:', err);
      showErrorToast('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '' });
    setMode('edit');
  };

  const startAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setMode('add');
  };

  const cancelForm = () => {
    setFormData({ name: '', description: '' });
    setEditingCategory(null);
    setMode('list');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Tag className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {mode === 'list' ? 'Manage Categories' : mode === 'add' ? 'Add Category' : 'Edit Category'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  {mode === 'list' ? `${categories.length} categories` : 'Category details'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* List Mode */}
          {mode === 'list' && (
            <div className="space-y-3">
              {/* Add Button */}
              <button
                onClick={startAdd}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm flex items-center justify-center"
                disabled={loading}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </button>

              {/* Categories List */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Loading...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="text-center py-8">
                  <Tag className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 dark:text-gray-400">No categories yet</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Create your first category to get started</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <button
                            onClick={() => startEdit(category)}
                            className="text-gray-600 dark:text-gray-400 hover:text-purple-500 dark:hover:text-purple-400 p-1"
                            title="Edit"
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(category)}
                            className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 p-1"
                            title="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={onClose}
                className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
                disabled={loading}
              >
                Close
              </button>
            </div>
          )}

          {/* Add/Edit Form Mode */}
          {(mode === 'add' || mode === 'edit') && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                mode === 'add' ? handleCreate() : handleUpdate();
              }}
              className="space-y-3"
            >
              {/* Name Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Phones, Accessories, Electronics"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              {/* Description Field */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  placeholder="Brief description of this category"
                  disabled={loading}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-1">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !formData.name.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {mode === 'add' ? 'Create Category' : 'Update Category'}
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManagement;
