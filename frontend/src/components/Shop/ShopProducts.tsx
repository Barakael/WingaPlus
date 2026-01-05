import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Package, AlertTriangle, Search, RefreshCw, Eye, TrendingUp, TrendingDown, MoreVertical, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import { showSuccessToast, showErrorToast } from '../../lib/toast';
import ViewProductModal from './ViewProductModal.tsx';
import EditProductModal from './EditProductModal.tsx';
import { AddProductModal } from './components';
import CategorySelectionModal from './components/CategorySelectionModal';

interface Product {
  id: number;
  name: string;
  category_id?: number;
  category_name?: string;
  shop_id: number;
  stock_quantity: number;
  min_stock_level: number;
  price: number;
  cost_price?: number;
  description?: string;
  barcode?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

interface Category {
  id: number;
  name: string;
  description?: string;
}

const ShopProducts: React.FC = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out' | 'in-stock'>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [categorySelectionModalOpen, setCategorySelectionModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      
      const response = await fetch(`${BASE_URL}/api/products?shop_id=${user.shop_id || user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }

      const data = await response.json();
      const productsData = data?.data?.data || data?.data || [];
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (err) {
      console.error('Error fetching products:', err);
      showErrorToast('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    if (!user) return;
    try {
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
    }
  }, [user]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // Apply filters
  useEffect(() => {
    let filtered = products;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (categoryFilter) {
      filtered = filtered.filter(product => String(product.category_id) === categoryFilter);
    }

    // Stock filter
    if (stockFilter === 'low') {
      filtered = filtered.filter(product => 
        product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level
      );
    } else if (stockFilter === 'out') {
      filtered = filtered.filter(product => product.stock_quantity === 0);
    } else if (stockFilter === 'in-stock') {
      filtered = filtered.filter(product => product.stock_quantity > product.min_stock_level);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [products, searchTerm, categoryFilter, stockFilter]);

  // Calculate stats
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.stock_quantity > 0 && p.stock_quantity <= p.min_stock_level).length;
  const outOfStockProducts = products.filter(p => p.stock_quantity === 0).length;
  const inStockProducts = products.filter(p => p.stock_quantity > p.min_stock_level).length;
  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock_quantity), 0);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Handle actions
  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setViewModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditModalOpen(true);
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!window.confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      showSuccessToast('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showErrorToast('Failed to delete product');
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getCategoryName = (categoryId?: number): string => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-[#1973AE] animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Product Management
          </h1>
          <div className="h-1 w-36 bg-sky-600 rounded-full" />
        <div className='grid grid-cols-2 md:grid-cols-2 gap-4'>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Manage your product inventory and stock levels
          </p>
       
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-[150px] sm:w-auto">
          <button
            onClick={() => setCategorySelectionModalOpen(true)}
            className="w-full sm:w-auto bg-sky-400 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:bg-sky-600 transition-all duration-200 flex items-center justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Add Product
          </button>
          </div>
        </div>
        </div>
      </div>
          {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Products</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{totalProducts}</p>
            </div>
            <Package className="h-6 w-6 sm:h-8 sm:w-8 text-[#1973AE]" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">In Stock</p>
              <p className="text-lg sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{inStockProducts}</p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Low Stock</p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{lowStockProducts}</p>
            </div>
            <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Out of Stock</p>
              <p className="text-lg sm:text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{outOfStockProducts}</p>
            </div>
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-red-600" />
          </div>
        </div>

       
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        {/* Mobile Layout - Search + 3-dot menu */}
        <div className="lg:hidden">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          {filterMenuOpen && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setFilterMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Level
                </label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="all">All Stock Levels</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout - All filters in a row */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products, barcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Stock Filter */}
          <div>
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value as any)}
              className="w-full px-4 py-3 text-base border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Stock Levels</option>
              <option value="in-stock">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

  

      {/* Products List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Products ({filteredProducts.length})
          </h2>
          <button
            onClick={fetchProducts}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Mobile View - Cards */}
        <div className="block sm:hidden space-y-3">
          {paginatedProducts.map((product) => {
            const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level;
            const isOutOfStock = product.stock_quantity === 0;

            return (
              <div key={product.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {getCategoryName(product.category_id)}
                    </p>
                  </div>
                  {isOutOfStock && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                      Out
                    </span>
                  )}
                  {isLowStock && (
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-xs rounded-full">
                      Low
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                    <span className={`ml-1 font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                      {product.stock_quantity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Price:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      TSh {formatCurrency(product.price)}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewProduct(product)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditProduct(product)}
                    className="flex-1 bg-[#1973AE] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#0d5a8a] transition-colors flex items-center justify-center"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product)}
                    className="flex-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Min Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Price
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
              {paginatedProducts.map((product) => {
                const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level;
                const isOutOfStock = product.stock_quantity === 0;

                return (
                  <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                      {product.barcode && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {product.barcode}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getCategoryName(product.category_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                        {product.stock_quantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {product.min_stock_level}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      TSh {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isOutOfStock ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                          Low Stock
                        </span>
                      ) : (
                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewProduct(product)}
                          className="text-gray-600 dark:text-gray-400 hover:text-[#1973AE] dark:hover:text-[#5da3d5]"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="text-gray-600 dark:text-gray-400 hover:text-[#1973AE] dark:hover:text-[#5da3d5]"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No products found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
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

      {/* Modals */}
      {viewModalOpen && selectedProduct && (
        <ViewProductModal
          product={selectedProduct}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedProduct(null);
          }}
          categories={categories}
        />
      )}

      {editModalOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={() => {
            fetchProducts();
            setEditModalOpen(false);
            setSelectedProduct(null);
          }}
          categories={categories}
        />
      )}

      {categorySelectionModalOpen && (
        <CategorySelectionModal
          isOpen={categorySelectionModalOpen}
          onClose={() => setCategorySelectionModalOpen(false)}
          onSelectCategory={(category) => {
            setSelectedCategory(category);
            setCategorySelectionModalOpen(false);
            setAddModalOpen(true);
          }}
          categories={categories}
        />
      )}

      {addModalOpen && selectedCategory && (
        <AddProductModal
          isOpen={addModalOpen}
          onClose={() => {
            setAddModalOpen(false);
            setSelectedCategory(null);
          }}
          onSuccess={() => {
            fetchProducts();
            setAddModalOpen(false);
            setSelectedCategory(null);
          }}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default ShopProducts;
