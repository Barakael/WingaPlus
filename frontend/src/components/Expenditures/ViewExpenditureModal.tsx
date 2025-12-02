import React from 'react';
import { X, Wallet, Calendar } from 'lucide-react';
import { Expenditure } from '../../services/expenditures';

interface ViewExpenditureModalProps {
  expenditure: Expenditure | null;
  isOpen: boolean;
  onClose: () => void;
}

const ViewExpenditureModal: React.FC<ViewExpenditureModalProps> = ({ expenditure, isOpen, onClose }) => {
  if (!isOpen || !expenditure) return null;

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        {/* Header - Compact with gradient */}
        <div className="relative bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] p-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{expenditure.name}</h2>
              <div className="flex items-center text-xs text-blue-100 mt-1">
                <Calendar className="h-3 w-3 mr-1" />
                Date: {new Date(expenditure.expenditure_date).toLocaleDateString('en-GB')}
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
        <div className="p-4 space-y-3 max-h-[70vh] overflow-y-auto">
          {/* Name */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expenditure Name</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {expenditure.name}
            </p>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="flex items-start">
              <Wallet className="h-4 w-4 text-[#1973AE] dark:text-[#5da3d5] mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-600 dark:text-gray-400">Amount</p>
                <p className="font-semibold text-lg text-red-600 dark:text-red-400">
                  TSh {formatCurrency(expenditure.amount)}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {expenditure.notes && (
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Notes</p>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                {expenditure.notes}
              </p>
            </div>
          )}

          {/* Date Info */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <div className="grid grid-cols-2 gap-2 text-center">
              
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Expenditure Date</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">
                  {new Date(expenditure.expenditure_date).toLocaleDateString('en-GB')}
                </p>
              </div>
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

export default ViewExpenditureModal;

