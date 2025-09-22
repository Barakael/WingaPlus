import React, { useState } from 'react';
import { Shield, User, Phone, AlertTriangle, CheckCircle, Clock, Mail, DollarSign, HardDrive, Smartphone } from 'lucide-react';
import SuccessModal from './SuccessModal';

const WarrantyFiling: React.FC = () => {
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

  const [warranties, setWarranties] = useState<any[]>([]);
  const [loadingWarranties, setLoadingWarranties] = useState(true);

  // Fetch warranties from API
  const fetchWarranties = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/warranties');
      if (response.ok) {
        const data = await response.json();
        setWarranties(data.warranties);
      }
    } catch (error) {
      console.error('Error fetching warranties:', error);
    } finally {
      setLoadingWarranties(false);
    }
  };

  // Fetch warranties on component mount
  React.useEffect(() => {
    fetchWarranties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:8000/api/warranties', {
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

      // Refresh warranties list
      fetchWarranties();

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Expired':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Expired ${Math.abs(diffDays)} days ago`;
    } else if (diffDays === 0) {
      return 'Expires today';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  const getDaysRemainingColor = (expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return 'text-red-600 dark:text-red-400';
    } else if (diffDays <= 30) {
      return 'text-yellow-600 dark:text-yellow-400';
    } else {
      return 'text-green-600 dark:text-green-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'expired':
        return 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Warranty Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            File and track product warranties
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File New Warranty */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            File New Warranty
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                  Color
                </label>
                <select
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                >
                  <option value="">Select color...</option>
                  <option value="Black">Black</option>
                  <option value="White">White</option>
                  <option value="Blue">Blue</option>
                  <option value="Green">Green</option>
                  <option value="Purple">Purple</option>
                  <option value="Orange">Orange</option>
                  <option value="Red">Red</option>
                  <option value="Gold">Gold</option>
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
  {/* Existing Warranties */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Warranties
        </h2>

        <div className="space-y-4">
          {loadingWarranties ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading warranties...</p>
            </div>
          ) : warranties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">No warranties filed yet.</p>
            </div>
          ) : (
            warranties.map((warranty) => (
              <div key={warranty.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(warranty.status || 'active')}
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Warranty #{warranty.id}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {warranty.phone_name}
                      </p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(warranty.status || 'active')}`}>
                    {warranty.status ? warranty.status.replace('_', ' ') : 'Active'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Customer:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{warranty.customer_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Phone:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{warranty.customer_phone}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Color:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{warranty.color}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Storage:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{warranty.storage}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Store:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{warranty.store_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Expiry Date:</span>
                    <span className="ml-2 text-gray-900 dark:text-white">{new Date(warranty.expiry_date).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Days Remaining:</span>
                    <span className={`ml-2 font-medium ${getDaysRemainingColor(warranty.expiry_date)}`}>
                      {getDaysRemaining(warranty.expiry_date)}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  Filed on {new Date(warranty.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        warrantyData={submittedWarranty}
      />

    </div>
  );
};

export default WarrantyFiling;
