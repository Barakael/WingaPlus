import React, { useState } from 'react';
import { ShoppingCart, User, Phone, Shield } from 'lucide-react';
import { categories, shops } from '../../database';

interface SaleFormProps {
  qrCode: string;
  selectedProduct: any;
  onClose: () => void;
  onSale: (saleData: any) => void;
}

const SaleForm: React.FC<SaleFormProps> = ({ qrCode, selectedProduct, onClose, onSale }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(selectedProduct?.price || 0);
  const [warrantyMonths, setWarrantyMonths] = useState(12);

  // Find category and products based on QR code
  const category = categories.find((cat: any) => cat.qr_code === qrCode);
  const shop = shops.find((s: any) => s.id === category?.shop_id);

  const totalAmount = quantity * unitPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData = {
      product_id: selectedProduct.id,
      salesman_id: 'current_user_id', // This should come from auth context
      customer_name: customerName,
      customer_phone: customerPhone,
      quantity,
      unit_price: unitPrice,
      total_amount: totalAmount,
      warranty_months: warrantyMonths,
      sale_date: new Date().toISOString(),
    };

    onSale(saleData);
  };

  if (!category || !shop) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
          <h2 className="text-xl font-bold text-red-600 mb-4">Invalid QR Code</h2>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                <ShoppingCart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  New Sale
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
              <span className="sr-only">Close</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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

          {/* Sale Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selected Product Display */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Selected Product</h4>
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white">{selectedProduct.name}</h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Stock: {selectedProduct.stock_quantity} | Category: {category?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    TSh {selectedProduct.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter customer name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            {/* Sale Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedProduct?.stock_quantity || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit Price (TSh)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(parseFloat(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Shield className="inline h-4 w-4 mr-1" />
                  Warranty (months)
                </label>
                <select
                  value={warrantyMonths}
                  onChange={(e) => setWarrantyMonths(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value={0}>No Warranty</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                  <option value={24}>24 Months</option>
                </select>
              </div>
            </div>

            {/* Total */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  TSh {totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedProduct || !customerName}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Complete Sale
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SaleForm;