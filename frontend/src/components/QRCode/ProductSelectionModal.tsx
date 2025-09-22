import React, { useState } from 'react';
import { X, ShoppingCart, Package } from 'lucide-react';
import { categories, products, shops } from '../../database';

interface ProductSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrCode: string;
  onProductSelect: (product: any) => void;
}

const ProductSelectionModal: React.FC<ProductSelectionModalProps> = ({
  isOpen,
  onClose,
  qrCode,
  onProductSelect
}) => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  if (!isOpen) return null;

  // Find category and products based on QR code
  const category = categories.find((cat: any) => cat.qr_code === qrCode);
  const availableProducts = products.filter((product: any) => product.category_id === category?.id);
  const shop = shops.find((s: any) => s.id === category?.shop_id);

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
  };

  const handleConfirmSelection = () => {
    if (selectedProduct) {
      onProductSelect(selectedProduct);
      onClose();
    }
  };

  if (!category || !shop) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600">Invalid QR Code</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The QR code "{qrCode}" is not valid or not found in the system.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Select Product
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {category.name} - {shop.name}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Shop Info */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Shop Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Name:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{shop.name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Address:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{shop.address}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Category:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{category.name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">QR Code:</span>
                <span className="ml-2 text-gray-900 dark:text-white">{qrCode}</span>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Available Products ({availableProducts.length})
            </h3>

            {availableProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableProducts.map((product: any) => {
                  const isSelected = selectedProduct?.id === product.id;
                  const isLowStock = product.stock_quantity <= product.min_stock_level;

                  return (
                    <div
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                        {isLowStock && (
                          <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                            Low Stock
                          </span>
                        )}
                      </div>

                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {product.name}
                      </h4>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Price:</span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            TSh {product.price}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Stock:</span>
                          <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
                            {product.stock_quantity}
                          </span>
                        </div>
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center text-blue-600 dark:text-blue-400">
                          <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">Selected</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No products available in this category
                </p>
              </div>
            )}
          </div>

          {/* Selected Product Summary */}
          {selectedProduct && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Selected Product</h4>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">
                    {selectedProduct.name}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stock: {selectedProduct.stock_quantity} | Min: {selectedProduct.min_stock_level}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    TSh {selectedProduct.price}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!selectedProduct}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              Select Product
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSelectionModal;
