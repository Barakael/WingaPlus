import React from 'react';
import { X, Eye, User, Package, Shield, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface Warranty {
  id: number;
  phone_name: string;
  customer_name: string;
  customer_phone: string;
  color?: string;
  storage?: string;
  store_name?: string;
  expiry_date?: string;
  warranty_months?: number;
  status?: string;
  created_at: string;
}

interface ViewWarrantyModalProps {
  warranty: Warranty | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewWarrantyModal: React.FC<ViewWarrantyModalProps> = ({ warranty, isOpen, onClose }) => {
  if (!isOpen || !warranty) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl h-[95vh] sm:h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Eye className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400 mr-2 sm:mr-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Warranty Details
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
          {/* Warranty ID and Status */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
            {/* <div className="flex items-center mb-2 sm:mb-0">
              <Shield className="h-4 w-4 mr-2 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Warranty ID:</span>
              <span className="ml-2 font-mono text-gray-900 dark:text-white">#{warranty.id}</span>
            </div> */}
            <div className="flex items-center">
              {/* {getStatusIcon(warranty.status || 'active')} */}
              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(warranty.status || 'active')}`}>
                {warranty.status ? warranty.status.replace('_', ' ') : 'Active'}
              </span>
            </div>
          </div>

          {/* Product and Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Package className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                Product Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Product:</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.phone_name}</span>
                </div>
                {warranty.color && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Color:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.color}</span>
                  </div>
                )}
                {warranty.storage && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Storage:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.storage}</span>
                  </div>
                )}
                {warranty.warranty_months && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Warranty Period:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.warranty_months} months</span>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                Customer Information
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Name:</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.customer_name}</span>
                </div>
               <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Email:</span>
                  <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.email}</span>
                </div>

                {warranty.store_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Store:</span>
                    <span className="text-sm text-gray-900 dark:text-white font-medium">{warranty.store_name}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Warranty Status and Timeline */}
          {warranty.expiry_date && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                Warranty Timeline
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Filed Date</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {new Date(warranty.created_at).toLocaleDateString('en-GB')}
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expiry Date</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {new Date(warranty.expiry_date).toLocaleDateString('en-GB')}
                  </div>
                </div>

                <div className="text-center sm:col-span-1 col-span-2">
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</div>
                  <div className={`text-sm font-bold ${getDaysRemainingColor(warranty.expiry_date)}`}>
                    {getDaysRemaining(warranty.expiry_date)}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-4 sm:px-6 pt-4 sm:pt-6 pb-0 border-t border-gray-200 dark:border-gray-700">
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

export default ViewWarrantyModal;