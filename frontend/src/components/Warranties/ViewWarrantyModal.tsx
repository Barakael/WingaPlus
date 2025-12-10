import React from 'react';
import { X, Package, Calendar } from 'lucide-react';

interface Warranty {
  id: number;
  phone_name?: string;
  laptop_name?: string;
  customer_name: string;
  customer_phone: string;
  color?: string;
  storage?: string;
  store_name?: string;
  reference_store?: string;
  email?: string;
  expiry_date?: string;
  warranty_months?: number;
  status?: string;
  created_at: string;
  imei_number?: string;
  serial_number?: string;
  category?: string;
}

interface ViewWarrantyModalProps {
  warranty: Warranty | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewWarrantyModal: React.FC<ViewWarrantyModalProps> = ({ warranty, isOpen, onClose }) => {
  if (!isOpen || !warranty) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Expires today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getDaysRemainingColor = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (diffDays <= 30) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header - Compact with gradient */}
        <div className="relative bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Warranty Details</h2>
              {warranty.expiry_date && (
                <div className="flex items-center text-xs text-blue-100 mt-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  Expires: {new Date(warranty.expiry_date).toLocaleDateString('en-GB')}
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
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">

          {/* Product Name */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start">
              <Package className="h-4 w-4 text-[#1973AE] dark:text-[#5da3d5] mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400">Product</p>
                <p className="font-semibold text-gray-900 dark:text-white truncate">{warranty.phone_name || warranty.laptop_name || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Customer & Store - Two columns */}
          <div className="grid grid-cols-2 gap-3">
            {warranty.customer_name && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Customer</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{warranty.customer_name}</p>
                {warranty.email && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{warranty.email}</p>
                )}
              </div>
            )}
            {warranty.reference_store && (
              <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Store</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{warranty.reference_store}</p>
              </div>
            )}
          </div>

          {/* Product Specs - Compact if exists */}
          {(warranty.color || warranty.storage || warranty.imei_number || warranty.serial_number) && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center mb-2">
                <Package className="h-3 w-3 text-blue-600 dark:text-blue-400 mr-1" />
                <p className="text-xs font-semibold text-blue-900 dark:text-blue-100">Specifications</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {warranty.color && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Color:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{warranty.color}</span>
                  </div>
                )}
                {warranty.storage && (
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{warranty.storage}</span>
                  </div>
                )}
                {warranty.imei_number && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">IMEI:</span>
                    <span className="ml-1 font-mono text-xs font-medium text-gray-900 dark:text-white">{warranty.imei_number}</span>
                  </div>
                )}
                {warranty.serial_number && (
                  <div className="col-span-2">
                    <span className="text-gray-600 dark:text-gray-400">Serial Number:</span>
                    <span className="ml-1 font-mono text-xs font-medium text-gray-900 dark:text-white">{warranty.serial_number}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warranty Timeline */}
          {warranty.expiry_date && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Filed</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {new Date(warranty.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expires</p>
                  <p className="text-xs font-bold text-gray-900 dark:text-white">
                    {new Date(warranty.expiry_date).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                  <p className={`text-xs font-bold ${getDaysRemainingColor(warranty.expiry_date)}`}>
                    {getDaysRemaining(warranty.expiry_date)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Status badge */}
          <div className="flex items-center justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(warranty.status || 'active')}`}>
              {warranty.status ? warranty.status.replace('_', ' ').toUpperCase() : 'ACTIVE'}
            </span>
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

export default ViewWarrantyModal;
