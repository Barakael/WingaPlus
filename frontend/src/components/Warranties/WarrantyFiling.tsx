import React, { useState } from 'react';
import { Shield, User, Phone, Mail, DollarSign, HardDrive, Smartphone } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import SuccessModal from './SuccessModal';

const WarrantyFiling: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');
  const [costPriceInput, setCostPriceInput] = useState<string>('0');
  const [unitPriceInput, setUnitPriceInput] = useState<string>('0');
  const [offersInput, setOffersInput] = useState<string>('0');
  const [imeiNumber, setImeiNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedWarranty, setSubmittedWarranty] = useState<any>(null);
  const [storeName, setStoreName] = useState('');

  const totalAmount = parseFloat(unitPriceInput) || 0;
  const costPrice = parseFloat(costPriceInput) || 0;
  const offers = parseFloat(offersInput) || 0;
  const baseGanji = totalAmount - costPrice;
  const ganji = baseGanji - offers;

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
      const response = await fetch(`${BASE_URL}/api/sales`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          // sale fields
          product_name: phoneName,
          quantity: 1,
          unit_price: parseFloat(unitPriceInput) || 0,
          selling_price: parseFloat(unitPriceInput) || 0,
          cost_price: parseFloat(costPriceInput) || 0,
          offers: parseFloat(offersInput) || 0,
          sale_date: new Date().toISOString(),
          customer_name: customerName,
          customer_phone: customerPhone,
          reference_store: storeName,
          salesman_id: user?.id || 1, // Use authenticated user ID
          // phone-specific fields (required by validation)
          phone_name: phoneName,
          imei: imeiNumber,
          color: color,
          storage: storage,
          // warranty flags/fields (unified single-table approach)
          has_warranty: true,
          warranty_months: parseInt(warrantyPeriod) || 0,
          warranty_start: new Date().toISOString(),
          // put device-specific details into warranty_details JSON
          warranty_details: {
            phone_name: phoneName,
            customer_email: customerEmail,
            color: color,
            storage: storage,
            cost_price: parseFloat(costPriceInput) || 0,
            selling_price: parseFloat(unitPriceInput) || 0,
            imei_number: imeiNumber,
          }
        }),
      });

      if (!response.ok) {
        // Try to get error details from response
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.errors) {
            const errorDetails = Object.values(errorData.errors).flat().join(', ');
            errorMessage += `: ${errorDetails}`;
          }
        } catch (e) {
          // If we can't parse the error response, use the default message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      // Backend returns sendResponse($sale, ...) so sale is in data.data or data.data depending on wrapper
      // Our controller returns { success: true, data: { ... }, message }
      const salePayload = data?.data ?? data;

      // Build warranty-like object expected by the modal/view
      const warrantyDetails = salePayload?.warranty_details ?? {};

      const warrantyData = {
        id: (salePayload?.id ?? '').toString(),
        phone_name: salePayload?.product_name ?? warrantyDetails.phone_name ?? phoneName,
        customer_name: salePayload?.customer_name ?? warrantyDetails.customer_name ?? customerName,
        customer_email: warrantyDetails.customer_email ?? customerEmail,
        customer_phone: salePayload?.customer_phone ?? customerPhone,
        sales_person: warrantyDetails.color ?? color,
        storage: warrantyDetails.storage ?? storage,
        price: (warrantyDetails.price ?? salePayload?.unit_price ?? '').toString(),
        imei_number: warrantyDetails.imei_number ?? imeiNumber,
        warranty_period: (salePayload?.warranty_months ?? warrantyPeriod ?? '').toString(),
        status: salePayload?.warranty_status ?? 'unknown',
        expiry_date: salePayload?.warranty_end ?? null,
        submitted_at: salePayload?.created_at ?? new Date().toISOString(),
        email_sent: true,
        linked_sale: salePayload ?? null,
      } as any;

      setSubmittedWarranty(warrantyData);
      setShowSuccessModal(true);

      // Reset form
      setWarrantyPeriod('');
      setPhoneName('');
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setStoreName('');
      setColor('');
      setStorage('');
      setCostPriceInput('0');
      setUnitPriceInput('0');
      setImeiNumber('');
    } catch (error) {
      console.error('Error filing warranty:', error);
      // Show detailed error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to file warranty: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#800000] to-[#600000] rounded-lg flex items-center justify-center mr-3">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  File New Warranty
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Complete sale and warranty details
                </p>
              </div>
            </div>
            <button
              onClick={onBack}
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
            {/* Customer Information - 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <User className="inline h-3 w-3 mr-1" />
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Mail className="inline h-3 w-3 mr-1" />
                  Customer Email
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="inline h-3 w-3 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  🏪 Reference Store
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Enter store name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Phone Details - Compact Grid */}
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Smartphone className="inline h-3 w-3 mr-1" />
                    Phone Name
                  </label>
                  <input
                    type="text"
                    value={phoneName}
                    onChange={(e) => setPhoneName(e.target.value)}
                    placeholder="iPhone 15 Pro"
                    className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <HardDrive className="inline h-3 w-3 mr-1" />
                    Storage
                  </label>
                  <select
                    value={storage}
                    onChange={(e) => setStorage(e.target.value)}
                    className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    IMEI Number
                  </label>
                  <input
                    type="text"
                    value={imeiNumber}
                    onChange={(e) => setImeiNumber(e.target.value)}
                    placeholder="IMEI"
                    className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sale Details - Compact */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Warranty Period
              </label>
              <select
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Choose period...</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>

            {/* Pricing Details - Responsive Layout */}
            <div className="space-y-3">
              {/* Cost and Offers in 2 columns */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zoezi (Cost)
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
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Offers/Discount
                  </label>
                  <input
                    type="text"
                    value={offersInput ? formatNumberWithCommas(offersInput) : ''}
                    onChange={(e) => {
                      const v = e.target.value.replace(/,/g, '');
                      if (v === '') { setOffersInput(''); return; }
                      if (/^\d*(?:\.\d{0,2})?$/.test(v)) setOffersInput(v);
                    }}
                    onBlur={() => { if (offersInput === '') setOffersInput('0'); }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Selling Price in full width */}
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Total Summary - Compact */}
            <div className="hidden md:grid gap-2 md:grid-cols-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Selling Price</div>
                <div className="text-sm font-bold text-[#800000] dark:text-[#A00000]">TSh {totalAmount.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-orange-600 dark:text-orange-400">Base Profit</div>
                <div className="text-sm font-bold text-orange-600 dark:text-orange-400">TSh {baseGanji.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-red-600 dark:text-red-400">Offers Given</div>
                <div className="text-sm font-bold text-red-600 dark:text-red-400">-TSh {offers.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Net Ganji</div>
                <div className={`text-sm font-bold ${ganji >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                  TSh {ganji.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Actions - Compact */}
            <div className="flex space-x-3 pt-1">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-gray-500 text-white py-1 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !phoneName || !customerName || !customerEmail || !customerPhone || !storeName || !color || !storage || !costPriceInput || !unitPriceInput || !imeiNumber || !warrantyPeriod}
                className="flex-1 bg-gradient-to-r from-[#800000] to-[#600000] text-white py-2 px-4 rounded-lg font-medium hover:from-[#600000] hover:to-[#400000] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-2 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Filing...
                  </>
                ) : (
                  <>
                    <Shield className="h-2 w-4 mr-2" />
                    File Warranty
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && submittedWarranty && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onBack();
          }}
          warrantyData={submittedWarranty}
        />
      )}
    </div>
  );
};

export default WarrantyFiling;
