import React, { useState } from 'react';
import { Shield, User, Phone, Mail, DollarSign, HardDrive, Smartphone } from 'lucide-react';
import SuccessModal from './SuccessModal';

const WarrantyFiling: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [warrantyPeriod, setWarrantyPeriod] = useState('');
  const [phoneName, setPhoneName] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [color, setColor] = useState('');
  const [storage, setStorage] = useState('');
  const [price, setPrice] = useState('');
  const [imeiNumber, setImeiNumber] = useState('');
  const [storeName, setStoreName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedWarranty, setSubmittedWarranty] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://95.111.247.129/api/warranties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone_name: phoneName,
          customer_name: customerName,
          customer_email: customerEmail,
          customer_phone: customerPhone,
          store_name: storeName,
          color: color,
          storage: storage,
          price: parseFloat(price),
          imei_number: imeiNumber,
          warranty_period: parseInt(warrantyPeriod),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Transform backend response to match modal expectations
      const warrantyData = {
        id: data.warranty.id.toString(),
        phone_name: data.warranty.phone_name,
        customer_name: data.warranty.customer_name,
        customer_email: data.warranty.customer_email,
        customer_phone: data.warranty.customer_phone,
        sales_person: data.warranty.color,
        storage: data.warranty.storage,
        price: data.warranty.price.toString(),
        imei_number: data.warranty.imei_number,
        warranty_period: data.warranty.warranty_period.toString(),
        status: data.warranty.status,
        expiry_date: data.warranty.expiry_date,
        submitted_at: new Date().toISOString(),
        email_sent: true, // Assuming email was sent if request succeeded
      };

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
      setPrice('');
      setImeiNumber('');
    } catch (error) {
      console.error('Error filing warranty:', error);
      // You could add error handling here, like showing an error message
      alert('Failed to file warranty. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            File New Warranty
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Fill in the details to file a warranty
          </p>
        </div>
        <button
          onClick={onBack}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back to Warranties
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Shield className="h-5 w-5 mr-2" />
          Warranty Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Smartphone className="inline h-4 w-4 mr-1" />
                Phone Name
              </label>
              <input
                type="text"
                value={phoneName}
                onChange={(e) => setPhoneName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Warranty Period
              </label>
              <select
                value={warrantyPeriod}
                onChange={(e) => setWarrantyPeriod(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Choose warranty period...</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Customer Name
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Customer Email
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Customer Phone
              </label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🏪 Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter store name"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Color
              </label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Enter color"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <HardDrive className="inline h-4 w-4 mr-1" />
                Storage
              </label>
              <select
                value={storage}
                onChange={(e) => setStorage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select storage...</option>
                <option value="64GB">64GB</option>
                <option value="128GB">128GB</option>
                <option value="256GB">256GB</option>
                <option value="512GB">512GB</option>
                <option value="1TB">1TB</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Tsh"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              IMEI Number
            </label>
            <input
              type="text"
              value={imeiNumber}
              onChange={(e) => setImeiNumber(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Enter IMEI number"
              required
            />
          </div>


          <button
            type="submit"
            disabled={isSubmitting || !phoneName || !customerName || !customerEmail || !customerPhone || !storeName || !color || !storage || !price || !imeiNumber || !warrantyPeriod}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Filing Warranty...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-2" />
                File Warranty
              </>
            )}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          onBack();
        }}
        warrantyData={submittedWarranty}
      />

    </div>
  );
};

export default WarrantyFiling;
