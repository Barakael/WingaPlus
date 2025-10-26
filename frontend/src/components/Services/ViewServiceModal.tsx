import React from 'react';
import { Wrench, X, User, DollarSign } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#800000] to-[#600000] rounded-lg flex items-center justify-center mr-3">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Service Details
                </h2>
                
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Service Information */}
          <div className="space-y-4">
            {/* Device Information */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                Device Information
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Device Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{service.device_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Issue:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{service.issue}</span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <User className="h-4 w-4 mr-2" />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{service.customer_name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Fundi:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">{service.store_name || service.reference_store}</span>
                </div>
              </div>
            </div>

            {/* Pricing Information */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-2" />
                Pricing Information
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Issue Price:</span>
                  <div className="text-gray-900 dark:text-white font-medium">TSh {issuePrice.toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Ufundi:</span>
                  <div className="text-gray-900 dark:text-white font-medium">TSh {servicePrice.toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Final Price:</span>
                  <div className="text-gray-900 dark:text-white font-medium">TSh {finalPrice.toLocaleString()}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Ganji:</span>
                  <div className={`font-medium ${ganji >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    TSh {ganji.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Status and Date */}
            <div className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-300">Service Date:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {service.service_date ? new Date(service.service_date).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewServiceModal;
