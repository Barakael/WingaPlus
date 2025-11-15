import React from 'react';
import { CheckCircle, X, Send, FileText } from 'lucide-react';

interface ServiceData {
  id: string;
  device_name: string;
  issue: string;
  customer_name: string;
  store_name: string;
  issue_price: string;
  service_price: string;
  final_price: string;
  ganji: string;
  service_date: string;
  created_at: string;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceData: ServiceData | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, serviceData }) => {
  if (!isOpen || !serviceData) return null;

  const issuePrice = parseFloat(serviceData.issue_price) || 0;
  const servicePrice = parseFloat(serviceData.service_price) || 0;
  const finalPrice = parseFloat(serviceData.final_price) || 0;
  const ganji = finalPrice - (issuePrice + servicePrice);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Service Filed Successfully!
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Email Report
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Send className="h-5 w-5 text-[#1973AE] dark:text-[#5da3d5]" />
              <h3 className="font-semibold text-[#094a73] dark:text-red-100">
                Service Report
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-[#7db3d9]">Status:</span>
                <span className="font-medium text-green-600 dark:text-green-400">✓ Service Recorded Successfully</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-[#7db3d9]">Customer:</span>
                <span className="font-medium">{serviceData.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-[#7db3d9]">Device:</span>
                <span className="font-medium">{serviceData.device_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-[#7db3d9]">Filed At:</span>
                <span className="font-medium">{new Date(serviceData.submitted_at).toLocaleString()}</span>
              </div>
            </div>
          </div> */}

          {/* Service Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Service Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 dark:text-gray-400">Device Name:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{serviceData.device_name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Issue:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{serviceData.issue}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{serviceData.customer_name}</span>
              </div>
              
              <div>
                <span className="text-gray-600 dark:text-gray-400">Fundi:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{serviceData.store_name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Service Date:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {serviceData.service_date ? new Date(serviceData.service_date).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Issue Price:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">TSh {issuePrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Service Price (Ufundi):</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">TSh {servicePrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Final Price:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">TSh {finalPrice.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Ganji:</span>
                <span className={`ml-2 font-medium ${ganji >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  TSh {ganji.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
