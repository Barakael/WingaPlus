import React, { useState } from 'react';
import { Wrench, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import SuccessModal from './SuccessModal';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const ServiceFiling: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user } = useAuth();
  const [deviceName, setDeviceName] = useState('');
  const [issue, setIssue] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [issuePriceInput, setIssuePriceInput] = useState<string>('0');
  const [servicePriceInput, setServicePriceInput] = useState<string>('0');
  const [finalPriceInput, setFinalPriceInput] = useState<string>('0');
  const [offersInput, setOffersInput] = useState<string>('0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedService, setSubmittedService] = useState<any>(null);
  const [storeName, setStoreName] = useState('');

  const issuePrice = parseFloat(issuePriceInput) || 0;
  const servicePrice = parseFloat(servicePriceInput) || 0;
  const finalPrice = parseFloat(finalPriceInput) || 0;
  const offers = parseFloat(offersInput) || 0;
  const costPrice = issuePrice + servicePrice; // Zoezi
  const baseGanji = finalPrice - costPrice;
  const ganji = baseGanji - offers;

  // Helper function to format numbers with commas
  const formatNumberWithCommas = (value: string): string => {
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          device_name: deviceName,
          issue: issue,
          customer_name: customerName,
          store_name: storeName,
          issue_price: issuePrice,
          service_price: servicePrice,
          final_price: finalPrice,
          offers: offers,
          service_date: new Date().toISOString().split('T')[0], // Today's date
          salesman_id: user?.id || 1,
        }),
      });

      if (!response.ok) {
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
      const servicePayload = data?.data ?? data;

      const serviceData = {
        id: servicePayload?.id?.toString(),
        device_name: servicePayload?.device_name ?? deviceName,
        issue: servicePayload?.issue ?? issue,
        customer_name: servicePayload?.customer_name ?? customerName,
        store_name: servicePayload?.store_name ?? storeName,
        issue_price: servicePayload?.issue_price?.toString() ?? issuePrice.toString(),
        service_price: servicePayload?.service_price?.toString() ?? servicePrice.toString(),
        final_price: servicePayload?.final_price?.toString() ?? finalPrice.toString(),
        ganji: servicePayload?.ganji?.toString() ?? ganji.toString(),
        service_date: servicePayload?.service_date ?? new Date().toISOString().split('T')[0],
        created_at: servicePayload?.created_at ?? new Date().toISOString(),
      } as any;

      setSubmittedService(serviceData);
      setShowSuccessModal(true);
      showSuccessToast('🔧 Service filed successfully!');

      // Reset form
      setDeviceName('');
      setIssue('');
      setCustomerName('');
      setStoreName('');
      setIssuePriceInput('0');
      setServicePriceInput('0');
      setFinalPriceInput('0');
      setOffersInput('0');
    } catch (error) {
      console.error('Error filing service:', error);
      const technicalError = error instanceof Error ? error.message : '';
      let userMessage = '❌ Could not save service record. Please try again.';
      
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
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header - Compact */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] rounded-lg flex items-center justify-center mr-3">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Record Service
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Complete device service and customer details
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

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-3">
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
              {/* <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Phone className="inline h-3 w-3 mr-1" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div> */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  <Wrench className="inline h-3 w-3 mr-1" />
                   Fundi
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="Enter store name"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Device Details - Compact Grid */}
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    
                    Device Name
                  </label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    placeholder="iPhone 15 Pro.."
                    className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Kipengele
                  </label>
                    <input
                        type="text"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        placeholder="battery, screen,"
                        className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        required
                    />
                </div>
              </div>
            </div>

            {/* Pricing Details - Responsive Layout */}
            <div className="space-y-3">
              {/* Device and Service Cost */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Zoezi ya kifaa
                  </label>
                  <input
                    type="text"
                    value={issuePriceInput ? formatNumberWithCommas(issuePriceInput) : ''}
                    onChange={(e) => {
                      const v = e.target.value.replace(/,/g, '');
                      if (v === '') { setIssuePriceInput(''); return; }
                      if (/^\d*(?:\.\d{0,2})?$/.test(v)) setIssuePriceInput(v);
                    }}
                    onBlur={() => { if (issuePriceInput === '') setIssuePriceInput('0'); }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Ufundi
                  </label>
                  <input
                    type="text"
                    value={servicePriceInput ? formatNumberWithCommas(servicePriceInput) : ''}
                    onChange={(e) => {
                      const v = e.target.value.replace(/,/g, '');
                      if (v === '') { setServicePriceInput(''); return; }
                      if (/^\d*(?:\.\d{0,2})?$/.test(v)) setServicePriceInput(v);
                    }}
                    onBlur={() => { if (servicePriceInput === '' ) setServicePriceInput('0'); }}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Offers field */}
              {/* <div>
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
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div> */}

              {/* Final Price in full width */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Final Price
                </label>
                <input
                  type="text"
                  value={finalPriceInput ? formatNumberWithCommas(finalPriceInput) : ''}
                  onChange={(e) => {
                    const v = e.target.value.replace(/,/g, '');
                    if (v === '') { setFinalPriceInput(''); return; }
                    if (/^\d*(?:\.\d{0,2})?$/.test(v)) setFinalPriceInput(v);
                  }}
                  onBlur={() => { if (finalPriceInput === '' ) setFinalPriceInput('0'); }}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Total Summary - Compact */}
            <div className="hidden md:grid gap-2 md:grid-cols-4 bg-gray-50 dark:bg-gray-700/40 rounded-lg p-3">
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Cost</div>
                <div className="text-sm font-bold text-[#1973AE] dark:text-[#5da3d5]">TSh {costPrice.toFixed(2)}</div>
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
                disabled={isSubmitting || !deviceName || !issue || !customerName || !storeName || !issuePriceInput || !servicePriceInput || !finalPriceInput}
                className="flex-1 bg-[#1973AE] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#0d5a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3 h-2 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Filing...
                  </>
                ) : (
                  <>
                    <Wrench className="h-2 w-4 mr-2" />
                    File Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && submittedService && (
        <SuccessModal
          isOpen={showSuccessModal}
          onClose={() => {
            setShowSuccessModal(false);
            onBack();
          }}
          serviceData={submittedService}
        />
      )}
    </div>
  );
};

export default ServiceFiling;
