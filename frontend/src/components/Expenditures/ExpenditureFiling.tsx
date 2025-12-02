import React, { useState } from 'react';
import { Wallet, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { createExpenditure } from '../../services/expenditures';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const ExpenditureFiling: React.FC<{ onBack: () => void; onSuccess?: () => void }> = ({ onBack, onSuccess }) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [amountInput, setAmountInput] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createExpenditure({
        salesman_id: user?.id || 0,
        name: name,
        amount: parseFloat(amountInput.replace(/,/g, '')) || 0,
        notes: notes || undefined,
        expenditure_date: new Date().toISOString(),
      });

      showSuccessToast('💰 Expenditure recorded successfully!');

      // Reset form
      setName('');
      setAmountInput('');
      setNotes('');

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onBack();
    } catch (error) {
      console.error('Error filing expenditure:', error);
      const technicalError = error instanceof Error ? error.message : '';
      let userMessage = '❌ Could not save expenditure. Please try again.';
      
      if (technicalError.includes('network') || technicalError.includes('fetch')) {
        userMessage = '📡 Connection problem. Check your internet and try again.';
      } else if (technicalError.includes('validation') || technicalError.includes('required')) {
        userMessage = '⚠️ Please fill in all required fields correctly.';
      }
      
      showErrorToast(userMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] rounded-lg flex items-center justify-center mr-3">
                <Wallet className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Record New Expenditure (Matumizi)
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Track your spending
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expenditure Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Transport, Lunch, Supplies"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                <Wallet className="inline h-4 w-4 mr-1" />
                Amount (TSh) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={amountInput ? formatNumberWithCommas(amountInput) : ''}
                onChange={(e) => {
                  const v = e.target.value.replace(/,/g, '');
                  if (v === '') { setAmountInput(''); return; }
                  if (/^\d*(?:\.\d{0,2})?$/.test(v)) setAmountInput(v);
                }}
                placeholder="0.00"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What was this expenditure for?"
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !name || !amountInput || parseFloat(amountInput.replace(/,/g, '')) <= 0}
                className="flex-1 bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] text-white py-2 px-4 rounded-lg font-medium hover:from-[#0d5a8a] hover:to-[#094a73] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-2 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Recording...
                  </>
                ) : (
                  <>
                    <Wallet className="h-4 w-4 mr-2" />
                    Record Expenditure
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenditureFiling;

