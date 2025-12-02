import React from 'react';
import { Wrench, X, Calendar } from 'lucide-react';

interface ViewServiceModalProps {
  service: any;
  isOpen: boolean;
  onClose: () => void;
}

const ViewServiceModal: React.FC<ViewServiceModalProps> = ({ service, isOpen, onClose }) => {
  if (!isOpen || !service) return null;

  const issuePrice = parseFloat(service.issue_price) || 0;
  const servicePrice = parseFloat(service.service_price) || 0;
  const finalPrice = parseFloat(service.final_price) || 0;
  const ganji = parseFloat(service.ganji) || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header - Compact with gradient */}
        <div className="relative bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Service Details</h2>
              {service.service_date && (
                <div className="flex items-center text-xs text-blue-100 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(service.service_date).toLocaleDateString('en-GB')}
                </div>
              )}
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

          {/* Device Information */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start">
              <Wrench className="h-4 w-4 text-[#1973AE] dark:text-[#5da3d5] mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400">Device</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">{service.device_name || 'N/A'}</p>
                {service.issue && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{service.issue}</p>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Store - Two columns */}
          <div className="grid grid-cols-2 gap-3">
            {service.customer_name && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{service.customer_name}</p>
              </div>
            )}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Fundi</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{service.store_name || service.reference_store || 'N/A'}</p>
            </div>
          </div>

          {/* Financial Grid - 4 columns */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-2 text-center">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Issue Price</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{issuePrice.toLocaleString()}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Ufundi</p>
              <p className="text-sm font-bold text-[#1973AE] dark:text-[#5da3d5]">{servicePrice.toLocaleString()}</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">Final Price</p>
              <p className="text-sm font-bold text-orange-600 dark:text-orange-400">{finalPrice.toLocaleString()}</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-2 text-center">
              <p className="text-xs text-green-600 dark:text-green-400 mb-1">Ganji</p>
              <p className={`text-sm font-bold ${ganji >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {ganji.toLocaleString()}
              </p>
            </div>
          </div>
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

export default ViewServiceModal;
