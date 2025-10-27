import React, { useState, useEffect } from 'react';
import { X, Edit, Save } from 'lucide-react';
import { Sale } from '../../types';
import { updateSale } from '../../services/sales';

interface EditSaleModalProps {
  sale: Sale | null;
  isOpen: boolean;
  onClose: () => void;
  onSaleUpdated: (updatedSale: Sale) => void;
}

const EditSaleModal: React.FC<EditSaleModalProps> = ({ sale, isOpen, onClose, onSaleUpdated }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    customer_name: '',
    customer_phone: '',
    quantity: 1,
    selling_price: 0,
    cost_price: 0,
    offers: 0,
    warranty_months: 0,
    sale_date: '',
    color: '',
    storage: '',
    imei: '',
    phone_name: '',
    has_warranty: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate form when sale changes
  useEffect(() => {
    if (sale) {
      setFormData({
        product_name: sale.product_name || '',
        customer_name: sale.customer_name || '',
        customer_phone: sale.customer_phone || '',
        quantity: Number(sale.quantity) || 1,
        selling_price: Number(sale.selling_price) || Number(sale.unit_price) || 0,
        cost_price: Number(sale.cost_price) || 0,
        offers: Number(sale.offers) || 0,
        warranty_months: Number(sale.warranty_months) || 0,
        sale_date: sale.sale_date ? new Date(sale.sale_date).toISOString().split('T')[0] : '',
        color: sale.color || '',
        storage: sale.storage || '',
        imei: sale.imei || '',
        phone_name: sale.phone_name || '',
        has_warranty: Boolean(sale.has_warranty)
      });
    }
  }, [sale]);

  if (!isOpen || !sale) return null;

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sale) return;

    setLoading(true);
    setError(null);

    try {
      const updatePayload = {
        product_name: formData.product_name,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        quantity: formData.quantity,
        unit_price: formData.selling_price, // Backend expects unit_price
        selling_price: formData.selling_price, // Backend also requires selling_price
        cost_price: formData.cost_price,
        offers: formData.offers,
        warranty_months: formData.has_warranty ? formData.warranty_months : 0,
        sale_date: formData.sale_date,
        color: formData.color,
        storage: formData.storage,
        imei: formData.imei,
        phone_name: formData.phone_name,
        has_warranty: formData.has_warranty
      };

      const updatedSale = await updateSale(sale.id, updatePayload);
      onSaleUpdated(updatedSale);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update sale');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <Edit className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600 dark:text-yellow-400 mr-2 sm:mr-3" />
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              Edit Sale #{sale.id}
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

          {/* Essential Information - Compact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.product_name}
                  onChange={(e) => handleInputChange('product_name', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => handleInputChange('customer_name', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

             
            </div>

            <div className="space-y-3">
              {/* Pricing Information */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Selling Price (TSh) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.selling_price}
                    onChange={(e) => handleInputChange('selling_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cost Price (TSh)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.cost_price}
                    onChange={(e) => handleInputChange('cost_price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Offers/Discount (TSh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.offers}
                  onChange={(e) => handleInputChange('offers', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Amount to deduct from profit"
                />
              </div>

              {/* Profit Calculation Display */}
              {formData.selling_price > 0 && formData.cost_price > 0 && (
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Profit Calculation:</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Base Profit: TSh {((formData.selling_price - formData.cost_price) * formData.quantity).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Less Offers: TSh {formData.offers.toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                    Final Profit: TSh {(((formData.selling_price - formData.cost_price) * formData.quantity) - formData.offers).toLocaleString()}
                  </div>
                </div>
              )}

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="has_warranty"
                  checked={formData.has_warranty}
                  onChange={(e) => handleInputChange('has_warranty', e.target.checked)}
                  className="h-4 w-4 text-[#1973AE] focus:ring-[#1973AE] border-gray-300 rounded"
                />
                <label htmlFor="has_warranty" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Warranty
                </label>
              </div>
            </div>
          </div>

          {/* Warranty Months - Show only if warranty is enabled */}
          {formData.has_warranty && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warranty Months
              </label>
              <input
                type="number"
                min="1"
                max="24"
                value={formData.warranty_months}
                onChange={(e) => handleInputChange('warranty_months', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          )}

          

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 border-t border-gray-200 dark:border-gray-700">
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
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Updating...' : 'Update Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSaleModal;
