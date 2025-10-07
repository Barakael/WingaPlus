import React, { useState } from 'react';
import { ShoppingCart, User, Phone, Type } from 'lucide-react';
import Receipt from './Receipt';
import { createSale } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';
// Free-text product entry; no product list import

interface SalePrefill {
  product_id?: string | number;
  product_name?: string;
  customer_name?: string;
  customer_phone?: string;
  warranty_months?: number;
  unit_price?: number;
}

interface SaleFormProps {
  onClose: () => void;
  onSale: (saleData: any) => void;
  prefill?: SalePrefill; // optional prefill coming from warranties/orders/etc
}

type SaleCategory = 'phones' | 'accessories';

const SaleForm: React.FC<SaleFormProps> = ({ onClose, onSale, prefill }) => {
  const { user } = useAuth();
  const initialProductName = prefill?.product_name || '';
  const [category, setCategory] = useState<SaleCategory>('phones');
  const [productName, setProductName] = useState(initialProductName);
  const [referenceStore, setReferenceStore] = useState('');
  const [customerName, setCustomerName] = useState(prefill?.customer_name || '');
  // Phone-specific fields
  const [phoneName, setPhoneName] = useState('');
  const [imei, setImei] = useState('');
  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');
  // Keep raw input as string to avoid transient NaN states
  const [quantityInput, setQuantityInput] = useState<string>('1');
  const [unitPriceInput, setUnitPriceInput] = useState<string>(
    prefill?.unit_price !== undefined ? String(prefill.unit_price) : '0'
  );
  const [costPriceInput, setCostPriceInput] = useState<string>('0');
  const [showReceipt, setShowReceipt] = useState(false);
  const [generatedReceipt, setGeneratedReceipt] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quantity = Number.parseInt(quantityInput, 10) > 0 ? Number.parseInt(quantityInput, 10) : 0;
  const unitPrice = Number.parseFloat(unitPriceInput) >= 0 ? Number.parseFloat(unitPriceInput) : 0;
  const costPrice = Number.parseFloat(costPriceInput) >= 0 ? Number.parseFloat(costPriceInput) : 0;
  const totalAmount = quantity * unitPrice;
  const ganji = quantity > 0 ? (unitPrice - costPrice) * quantity : 0;

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    setError(null);
    try {
      const subtotal = quantity * unitPrice;
      const taxAmount = subtotal * 0.18; // 18% VAT (client-only display for now)
      const totalAmount = subtotal + taxAmount; // server will store quantity*unit_price only currently

      if (!productName.trim() && !prefill?.product_id && category === 'accessories') {
        setError('Product name is required');
        setSubmitting(false);
        return;
      }

      if (!referenceStore.trim()) {
        setError('Reference store is required');
        setSubmitting(false);
        return;
      }

      if (category === 'phones') {
        if (!customerName.trim()) {
          setError('Customer name is required for phone sales');
          setSubmitting(false);
          return;
        }
        if (!phoneName.trim()) {
          setError('Phone name is required for phone sales');
          setSubmitting(false);
          return;
        }
        if (!imei.trim()) {
          setError('IMEI is required for phone sales');
          setSubmitting(false);
          return;
        }
        if (!color.trim()) {
          setError('Color is required for phone sales');
          setSubmitting(false);
          return;
        }
        if (!storage) {
          setError('Storage is required for phone sales');
          setSubmitting(false);
          return;
        }
      } else if (category === 'accessories') {
        if (!productName.trim()) {
          setError('Product name is required for accessory sales');
          setSubmitting(false);
          return;
        }
      }

      const created = await createSale({
        product_id: prefill?.product_id ? String(prefill.product_id) : undefined,
        product_name: category === 'phones' ? phoneName.trim() : productName.trim(),
        reference_store: referenceStore.trim(),
        category,
        // Always include customer fields, but they can be empty for accessories
        customer_name: category === 'phones' ? customerName.trim() : '',
        // Phone-specific fields
        ...(category === 'phones' && {
          phone_name: phoneName.trim(),
          imei: imei.trim(),
          color: color.trim(),
          storage: storage,
        }),
        quantity: category === 'phones' ? 1 : parseInt(quantityInput),
        unit_price: unitPrice,
        selling_price: unitPrice,
        cost_price: costPrice,
        salesman_id: user?.id ? String(user.id) : undefined,
        sale_date: new Date().toISOString(),
      });

      const receiptData = {
        sale_id: created.id,
        receipt_number: `RCP-${Date.now()}`,
        category,
        reference_store: referenceStore,
        ...(category === 'phones' && {
          customer_name: customerName,
        }),
        items: [{
          product_name: category === 'phones' ? phoneName.trim() : productName.trim(),
          ...(category === 'phones' && {
            phone_name: phoneName.trim(),
            imei: imei.trim(),
            color: color.trim(),
            storage: storage,
          }),
          quantity: category === 'phones' ? 1 : parseInt(quantityInput),
          unit_price: unitPrice,
          total_amount: subtotal
        }],
        subtotal,
        tax_amount: taxAmount,
        discount_amount: 0,
        total_amount: totalAmount,
        qr_code: `RCP-QR-${Date.now()}`,
        issued_by: user.name,
        issued_at: new Date().toISOString()
      };

      setGeneratedReceipt(receiptData);
      setShowReceipt(true);
      onSale(created);
    } catch (err: any) {
      setError(err.message || 'Failed to create sale');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  New Sale
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Record a sale
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <span className="sr-only">Close</span>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Main Form Grid */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Category and Reference Store */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as SaleCategory)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="phones">📱 Phones</option>
                  <option value="accessories">🔧 Accessories</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reference Store
                </label>
                <input
                  type="text"
                  value={referenceStore}
                  onChange={(e) => setReferenceStore(e.target.value)}
                  placeholder="Store/location"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Row 2: Product Name (Accessories) or Phone Name (Phones) */}
            {(category === 'accessories' || category === 'phones') && (
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center">
                  {category === 'accessories' ? <Type className="h-3 w-3 mr-1" /> : <Phone className="h-3 w-3 mr-1" />}
                  {category === 'phones' ? 'Phone Name (Product)' : 'Product Name'}
                </label>
                <input
                  type="text"
                  value={category === 'phones' ? phoneName : productName}
                  onChange={(e) => category === 'phones' ? setPhoneName(e.target.value) : setProductName(e.target.value)}
                  placeholder={category === 'phones' ? 'iPhone 15 Pro, Samsung Galaxy S24' : 'Phone Case, Screen Protector'}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            )}

            {/* Phone Details - Compact Grid */}
            {category === 'phones' && (
              <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                {/* <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Phone Details
                </h4> */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      IMEI
                    </label>
                    <input
                      type="text"
                      value={imei}
                      onChange={(e) => setImei(e.target.value)}
                      placeholder="IMEI"
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color
                    </label>
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      placeholder="Space Black"
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Storage
                    </label>
                    <select
                      value={storage}
                      onChange={(e) => setStorage(e.target.value)}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Storage</option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Customer
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Customer name"
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sale Details - Compact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {category === 'accessories' && (
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={quantityInput}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '') { setQuantityInput(''); return; }
                      if (/^\d+$/.test(v)) setQuantityInput(v);
                    }}
                    onBlur={() => { if (quantityInput === '' || quantity === 0) setQuantityInput('1'); }}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-center font-semibold"
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost Price
                </label>
                <input
                  type="text"
                  value={costPriceInput ? formatNumberWithCommas(costPriceInput) : ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/,/g, '');
                    if (v === '') { setCostPriceInput(''); return; }
                    if (/^\d*(?:\.\d{0,2})?$/.test(v)) setCostPriceInput(v);
                  }}
                  onBlur={() => { if (costPriceInput === '') setCostPriceInput('0'); }}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selling Price
                </label>
                <input
                  type="text"
                  value={unitPriceInput ? formatNumberWithCommas(unitPriceInput) : ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/,/g, '');
                    if (v === '') { setUnitPriceInput(''); return; }
                    if (/^\d*(?:\.\d{0,2})?$/.test(v)) setUnitPriceInput(v);
                  }}
                  onBlur={() => { if (unitPriceInput === '' ) setUnitPriceInput('0'); }}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Total Summary - Compact */}
            <div className="hidden md:grid gap-2 md:grid-cols-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Amount</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">TSh {totalAmount.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Ganji (Profit)</div>
                <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">TSh {ganji.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Per Unit Margin</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">TSh {(unitPrice - costPrice).toFixed(2)}</div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>
            )}

            {/* Actions - Compact */}
            <div className="flex space-x-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || (category === 'accessories' && !productName.trim()) || (category === 'phones' && (!customerName.trim() || !phoneName.trim()))}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {submitting ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : 'Complete Sale'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && generatedReceipt && (
        <Receipt
          receipt={generatedReceipt}
          onClose={() => {
            setShowReceipt(false);
            onClose();
          }}
        />
      )}
    </div>
  );
};

export default SaleForm;