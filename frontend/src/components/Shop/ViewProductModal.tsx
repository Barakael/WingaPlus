import React from 'react';
import { X, Package, DollarSign, Barcode, Tag, Calendar } from 'lucide-react';

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

interface ViewProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
}

const ViewProductModal: React.FC<ViewProductModalProps> = ({ product, isOpen, onClose, categories }) => {
  if (!isOpen) return null;

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

  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.min_stock_level;
  const isOutOfStock = product.stock_quantity === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-[#1973AE] dark:text-[#5da3d5] mr-2 sm:mr-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Product Details
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6">
          {/* Product Image */}
          {product.image_url && (
            <div className="flex justify-center">
              <img
                src={product.image_url}
                alt={product.name}
                className="h-48 w-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Product Name and Status */}
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h3>
            <div className="flex items-center space-x-2">
              {isOutOfStock ? (
                <span className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm rounded-full font-medium">
                  Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-sm rounded-full font-medium">
                  Low Stock
                </span>
              ) : (
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full font-medium">
                  In Stock
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <p className="text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                {product.description}
              </p>
            </div>
          )}

          {/* Product Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
              </div>
              <p className="text-base font-semibold text-gray-900 dark:text-white">
                {getCategoryName(product.category_id)}
              </p>
            </div>

            {product.barcode && (
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Barcode className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-2" />
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Barcode
                  </label>
                </div>
                <p className="text-base font-mono font-semibold text-gray-900 dark:text-white">
                  {product.barcode}
                </p>
              </div>
            )}
          </div>

          {/* Stock Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
              Stock Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Current Stock
                </label>
                <p className={`text-xl font-bold ${isOutOfStock ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                  {product.stock_quantity}
                </p>
              </div>
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Minimum Level
                </label>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {product.min_stock_level}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              Pricing Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {product.cost_price !== undefined && (
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Cost Price
                  </label>
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    TSh {formatCurrency(product.cost_price)}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Selling Price
                </label>
                <p className="text-base font-bold text-[#1973AE] dark:text-[#5da3d5]">
                  TSh {formatCurrency(product.price)}
                </p>
              </div>
              {product.cost_price !== undefined && (
                <div>
                  <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Profit Margin
                  </label>
                  <p className="text-base font-bold text-green-600 dark:text-green-400">
                    TSh {formatCurrency(product.price - product.cost_price)}
                  </p>
                </div>
              )}
            </div>
            <div className="mt-3">
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Total Inventory Value
              </label>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                TSh {formatCurrency(product.price * product.stock_quantity)}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          {product.created_at && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-4">
              <div className="flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                <span>Created: {new Date(product.created_at).toLocaleDateString()}</span>
              </div>
              {product.updated_at && (
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>Updated: {new Date(product.updated_at).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductModal;
