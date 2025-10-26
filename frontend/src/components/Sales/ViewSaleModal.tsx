import React from 'react';
import { X, Eye, Calendar, User, Phone, Package, DollarSign } from 'lucide-react';
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
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const costPrice = Number(sale.cost_price) || 0;
  const sellingPrice = Number(sale.unit_price) || 0;
  const quantity = Number(sale.quantity) || 1;
  const offers = Number(sale.offers) || 0;
  const totalAmount = Number(sale.total_amount) || 0;
  // Use backend ganji if available, otherwise calculate with offers deduction
  const profit = sale.ganji !== null && sale.ganji !== undefined ? Number(sale.ganji) : ((sellingPrice - costPrice) * quantity) - offers;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] sm:h-[70vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-[#800000] dark:text-[#A00000] mr-2 sm:mr-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Sale Details
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
        <div className="p-3 sm:p-6">
          {/* Sale ID and Date */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-1 pb-1 border-b border-gray-200 dark:border-gray-700">
            {/* <div className="mb-2 sm:mb-0">
              <span className="text-sm text-gray-600 dark:text-gray-400">Sale ID:</span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">#{sale.id}</span>
            </div> */}
            <div className="flex items-center text-sm text-gray-900 dark:text-white">
              <Calendar className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              {new Date(sale.sale_date || '').toLocaleDateString('en-GB', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Product and Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
           

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Reference Store
              </label>
              <p className="text-sm text-gray-900 dark:text-white">{sale.reference_store || 'N/A'}</p>
            </div>

            {sale.warranty_months && sale.warranty_months > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Warranty
                </label>
                <p className="text-sm text-gray-900 dark:text-white">
                  {sale.warranty_months} month{sale.warranty_months > 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

          {/* Financial Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg ">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white  flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600 dark:text-green-400" />
              Financial Details
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-3 mt-2 p-2 sm:p-4">
              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Zoezi</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white">
                  TSh {formatCurrency(costPrice)}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Selling Price</div>
                <div className="text-sm font-bold text-[#800000] dark:text-[#A00000]">
                  TSh {formatCurrency(sellingPrice)}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Offers</div>
                <div className="text-sm font-bold text-orange-600 dark:text-orange-400">
                  TSh {formatCurrency(offers)}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-gray-600 dark:text-gray-400">Net Profit</div>
                <div className="text-sm font-bold text-green-600 dark:text-green-400">
                  TSh {formatCurrency(profit)}
                </div>
              </div>
            </div>

           
          </div>


          {/* Product Specifications - Only show if data exists */}
          {(sale.color || sale.storage || sale.imei || sale.phone_name) && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                Product Specifications
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sale.phone_name && (
                  <div className="flex justify-between items-center ">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Model:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{sale.phone_name}</span>
                  </div>
                )}

                {sale.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Color:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{sale.color}</span>
                  </div>
                )}

                {sale.storage && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Storage:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{sale.storage}</span>
                  </div>
                )}

                {sale.imei && (
                  <div className="col-span-1 sm:col-span-1 flex justify-between items-center border-t border-gray-200 dark:border-gray-600 ">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">IMEI:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-mono font-medium">{sale.imei}</span>
                  </div>
                )}
              </div>
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

export default ViewSaleModal;
