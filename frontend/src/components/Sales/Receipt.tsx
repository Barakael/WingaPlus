import React from 'react';
import { Receipt as ReceiptIcon, QrCode, Download, Printer, Mail } from 'lucide-react';

interface ReceiptProps {
  receipt: any;
  onClose: () => void;
}

const Receipt: React.FC<ReceiptProps> = ({ receipt, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download feature coming soon!');
  };

  const handleEmail = () => {
    // In a real app, this would send the receipt via email
    alert('Email feature coming soon!');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <ReceiptIcon className="h-8 w-8 text-[#1973AE] mr-3" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Receipt
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {receipt.receipt_number}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrint}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Print"
              >
                <Printer className="h-5 w-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Download PDF"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={handleEmail}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                title="Email Receipt"
              >
                <Mail className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Receipt Content */}
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-gray-50 dark:bg-gray-700">
            {/* Store Info */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Zunny Store</h3>
              <p className="text-gray-600 dark:text-gray-400">Mwenge Sokoni, Dar es Salaam</p>
              <p className="text-gray-600 dark:text-gray-400">Phone: +255 712 345 678</p>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receipt Number:</p>
                <p className="font-semibold text-gray-900 dark:text-white">{receipt.receipt_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Date:</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {new Date(receipt.issued_at).toLocaleDateString()}
                </p>
              </div>
              {receipt.customer_name && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{receipt.customer_name}</p>
                </div>
              )}
              {receipt.category && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category:</p>
                  <p className="font-semibold text-gray-900 dark:text-white capitalize">{receipt.category}</p>
                </div>
              )}
              {receipt.reference_store && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Reference Store:</p>
                  <p className="font-semibold text-gray-900 dark:text-white">{receipt.reference_store}</p>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Items Purchased</h4>
              <div className="space-y-2">
                {receipt.items.map((item: any, index: number) => (
                  <div key={index} className="py-2 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white">{item.product_name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity} × TSh {item.unit_price.toLocaleString()}
                        </p>
                        {item.phone_name && (
                          <p className="text-sm text-[#1973AE] dark:text-[#5da3d5]">
                            📱 {item.phone_name}
                          </p>
                        )}
                        {item.imei && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            IMEI: {item.imei}
                          </p>
                        )}
                        {item.color && item.storage && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {item.color} • {item.storage}
                          </p>
                        )}
                      </div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        TSh {item.total_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-gray-300 dark:border-gray-600 pt-4 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="text-gray-900 dark:text-white">TSh {receipt.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Tax (18%):</span>
                  <span className="text-gray-900 dark:text-white">TSh {receipt.tax_amount.toLocaleString()}</span>
                </div>
                {receipt.discount_amount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                    <span className="text-red-600 dark:text-red-400">-TSh {receipt.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 dark:border-gray-600 pt-2">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-gray-900 dark:text-white">TSh {receipt.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* QR Code for Warranty */}
            <div className="text-center mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Scan for Warranty Information</p>
              <div className="inline-block p-3 bg-white border-2 border-gray-300 rounded-lg">
                <QrCode className="h-16 w-16 text-gray-800" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{receipt.qr_code}</p>
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Thank you for your business!</p>
              <p>Issued by: {receipt.issued_by}</p>
              <p className="mt-2">For warranty claims, please present this receipt.</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
