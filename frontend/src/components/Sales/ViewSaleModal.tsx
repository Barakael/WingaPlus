import React from 'react';
import { X, Calendar, Package, Smartphone } from 'lucide-react';
import { Sale } from '../../types';

interface ViewSaleModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewSaleModal: React.FC<ViewSaleModalProps> = ({ sale, isOpen, onClose }) => {
  if (!isOpen || !sale) return null;

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const costPrice = Number(sale.cost_price) || 0;
  const sellingPrice = Number(sale.unit_price) || 0;
  const quantity = Number(sale.quantity) || 1;
  const offers = Number(sale.offers) || 0;
  const profit = sale.ganji !== null && sale.ganji !== undefined ? Number(sale.ganji) : ((sellingPrice - costPrice) * quantity) - offers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header - Compact with gradient */}
        <div className="relative bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Sale Details</h2>
              <div className="flex items-center text-xs text-blue-100 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                {new Date(sale.sale_date || '').toLocaleDateString('en-GB')}
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content - Compact */}
        <div className="p-4 space-y-3">
          {/* Product Name */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start">
              <Package className="h-4 w-4 text-[#1973AE] dark:text-[#5da3d5] mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400">Product</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">{sale.product_name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Customer & Store - Two columns */}
          <div className="grid grid-cols-2 gap-3">
            {sale.customer_name && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sale.customer_name}</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Store</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{sale.reference_store || 'N/A'}</p>
            </div>
          </div>

          {/* Financial Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Zoezi</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(costPrice)}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Bei</p>
              <p className="text-sm font-bold text-[#1973AE] dark:text-[#5da3d5]">{formatCurrency(sellingPrice)}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Offers</p>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{formatCurrency(offers)}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Ganji</p>
              <p className="text-sm font-bold text-green-600 dark:text-green-400">{formatCurrency(profit)}</p>
            </div>
          </div>

          {/* Product Specs - Compact if exists */}
          {(sale.phone_name || sale.color || sale.storage || sale.imei || sale.ram) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-2">
                <Smartphone className="h-3 w-3 text-blue-600 dark:text-blue-400 mr-1" />
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Specifications</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {sale.phone_name && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Model:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{sale.phone_name}</span>
                  </div>
                )}
                {sale.color && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Color:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{sale.color}</span>
                  </div>
                )}
                {sale.storage && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{sale.storage}</span>
                  </div>
                )}
                {sale.ram && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">RAM:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{sale.ram}</span>
                  </div>
                )}
                {sale.imei && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">IMEI:</span>
                    <span className="ml-1 font-mono text-xs font-medium text-gray-900 dark:text-white">{sale.imei}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warranty badge if exists */}
          {sale.warranty_months && sale.warranty_months > 0 && (
            <div className="flex items-center justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                🛡️ {sale.warranty_months} Month{sale.warranty_months > 1 ? 's' : ''} Warranty
              </span>
            </div>
          )}
        </div>

        {/* Footer - Compact */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewSaleModal;
