import React from 'react';
import { CheckCircle, X, Send, FileText } from 'lucide-react';

interface WarrantyData {
  id: string;
  phone_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  sales_person: string;
  storage: string;
  price: string;
  imei_number: string;
  warranty_period: string;
  status: string;
  expiry_date: string;
  submitted_at: string;
  email_sent: boolean;
  linked_sale?: {
    id: number;
    product_name: string;
    total_amount: string | number;
    warranty_months: number | null;
  } | null;
}

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  warrantyData: WarrantyData | null;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, warrantyData }) => {
  if (!isOpen || !warrantyData) return null;

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
                  Warranty Filed Successfully!
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

          {/* Email Report */}
          <div className="bg-indigo-50 dark:bg-green-900/20 border border-indigo-200 dark:border-green-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3 mb-3">
              <Send className="h-5 w-5 text-[#1973AE] dark:text-[#5da3d5]" />
              <h3 className="font-semibold text-[#094a73] dark:text-blue-400">
                Email Report
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-gray-200">Status:</span>
                <span className="font-medium text-green-600 dark:text-green-400">✓ Email Sent Successfully</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-gray-200">Recipient:</span>
                <span className="font-medium text-gray-900 dark:text-white">{warrantyData.customer_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-gray-200">Subject:</span>
                <span className="font-medium text-gray-900 dark:text-white">Warranty - {warrantyData.phone_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0d5a8a] dark:text-gray-200">Sent At:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{new Date(warrantyData.submitted_at).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Warranty Details
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Warranty Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
             
              <div>
                <span className="text-gray-600 dark:text-gray-400">Phone Name:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.phone_name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.customer_name}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.customer_email}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.customer_phone}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Color:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.sales_person}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.storage}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Price:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">Tsh {warrantyData.price}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">IMEI:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.imei_number}</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Warranty Period:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">{warrantyData.warranty_period} Months</span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded-full font-medium ${
                  warrantyData.status === 'active'
                    ? 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {warrantyData.status.charAt(0).toUpperCase() + warrantyData.status.slice(1)}
                </span>
              </div>
              <div>
                <span className="text-gray-600 dark:text-gray-400">Expiry Date:</span>
                <span className="ml-2 font-medium text-gray-900 dark:text-white">
                  {new Date(warrantyData.expiry_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div> */}
{/* 
          {warrantyData.linked_sale && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2 text-green-800 dark:text-green-200 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" /> Linked Sale Created
              </h3>
              <div className="text-sm grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <span className="text-green-700 dark:text-green-300">Sale ID:</span>
                  <span className="ml-2 font-medium">{warrantyData.linked_sale.id}</span>
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300">Product:</span>
                  <span className="ml-2 font-medium">{warrantyData.linked_sale.product_name}</span>
                </div>
                <div>
                  <span className="text-green-700 dark:text-green-300">Total Amount:</span>
                  <span className="ml-2 font-medium">Tsh {warrantyData.linked_sale.total_amount}</span>
                </div>
                {warrantyData.linked_sale.warranty_months && (
                  <div>
                    <span className="text-green-700 dark:text-green-300">Warranty Months:</span>
                    <span className="ml-2 font-medium">{warrantyData.linked_sale.warranty_months}</span>
                  </div>
                )}
              </div>
            </div>
          )} */}

          {/* Action Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white py-3 px-2 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
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
