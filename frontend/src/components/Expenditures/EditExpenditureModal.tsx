import React, { useState, useEffect } from 'react';
import { X, Edit, Save, Wallet } from 'lucide-react';
import { Expenditure } from '../../services/expenditures';
import { updateExpenditure } from '../../services/expenditures';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

interface EditExpenditureModalProps {
  expenditure: Expenditure | null;
  isOpen: boolean;
  onClose: () => void;
  onExpenditureUpdated: (updatedExpenditure: Expenditure) => void;
}

const EditExpenditureModal: React.FC<EditExpenditureModalProps> = ({ expenditure, isOpen, onClose, onExpenditureUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    notes: '',
    expenditure_date: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  // Populate form when expenditure changes
  useEffect(() => {
    if (expenditure) {
      setFormData({
        name: expenditure.name || '',
        amount: expenditure.amount ? String(expenditure.amount) : '',
        notes: expenditure.notes || '',
        expenditure_date: expenditure.expenditure_date ? new Date(expenditure.expenditure_date).toISOString().split('T')[0] : '',
      });
    }
  }, [expenditure]);

  if (!isOpen || !expenditure) return null;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenditure) return;

    setLoading(true);
    setError(null);

    try {
      const updatePayload = {
        name: formData.name,
        amount: parseFloat(formData.amount.replace(/,/g, '')) || 0,
        notes: formData.notes || undefined,
        expenditure_date: formData.expenditure_date ? new Date(formData.expenditure_date).toISOString() : undefined,
        salesman_id: expenditure.salesman_id,
      };

      const updatedExpenditure = await updateExpenditure(expenditure.id, updatePayload);
      onExpenditureUpdated(updatedExpenditure);
      showSuccessToast('✏️ Expenditure updated successfully!');
      onClose();
    } catch (err) {
      const technicalError = err instanceof Error ? err.message : '';
      let userMessage = '❌ Could not update expenditure. Please try again.';
      
      if (technicalError.includes('network') || technicalError.includes('fetch')) {
        userMessage = '📡 Connection problem. Check your internet and try again.';
      } else if (technicalError.includes('not found') || technicalError.includes('404')) {
        userMessage = '⚠️ Expenditure not found. It may have been deleted.';
      }
      
      setError(userMessage);
      showErrorToast(userMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400 mr-2 sm:mr-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Edit Expenditure
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-4">
              <p className="text-red-800 dark:text-red-200 text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Expenditure Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Transport, Lunch, Supplies"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>

            {/* Amount and Date in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Wallet className="inline h-4 w-4 mr-1" />
                  Amount (TSh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.amount ? formatNumberWithCommas(formData.amount) : ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/,/g, '');
                    if (v === '') { handleInputChange('amount', ''); return; }
                    if (/^\d*(?:\.\d{0,2})?$/.test(v)) handleInputChange('amount', v);
                  }}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Expenditure Date
                </label>
                <input
                  type="date"
                  value={formData.expenditure_date}
                  onChange={(e) => handleInputChange('expenditure_date', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="What was this expenditure for?"
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-6 border-t border-gray-200 dark:border-gray-700 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name || !formData.amount || parseFloat(formData.amount.replace(/,/g, '')) <= 0}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Expenditure'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenditureModal;

