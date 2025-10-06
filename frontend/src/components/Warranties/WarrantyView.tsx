import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface WarrantyViewProps {
  onFileWarranty: () => void;
  openSaleForm?: (prefill?: any) => void;
}

const WarrantyView: React.FC<WarrantyViewProps> = ({ onFileWarranty, openSaleForm }) => {
  const [warranties, setWarranties] = useState<any[]>([]);
  const [loadingWarranties, setLoadingWarranties] = useState(true);

  // Fetch sales that have warranties
  const fetchWarranties = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/sales');
      if (response.ok) {
        const data = await response.json();
        // Our API wraps responses as { success, data: { data: [...], total: ... }, message }
        const sales = data?.data?.data ?? [];
        // Filter only sales that have warranties
        const warrantySales = (sales || []).filter((s: any) => s.has_warranty === true || s.has_warranty === 1);
        // Map to the warranty shape expected by the UI
        const mapped = warrantySales.map((s: any) => ({
          id: s.id,
          phone_name: s.product_name || (s.warranty_details?.phone_name ?? ''),
          customer_name: s.customer_name || (s.warranty_details?.customer_name ?? ''),
          customer_phone: s.customer_phone || (s.warranty_details?.customer_phone ?? ''),
          color: s.warranty_details?.color ?? '',
          storage: s.warranty_details?.storage ?? '',
          store_name: s.warranty_details?.store_name ?? '',
          expiry_date: s.warranty_end ?? null,
          warranty_months: s.warranty_months ?? (s.warranty_details?.warranty_months ?? null),
          status: s.warranty_status ?? 'unknown',
          created_at: s.created_at,
        }));

        setWarranties(mapped);
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
            View and track product warranties
          </p>
        </div>
        <button
          onClick={onFileWarranty}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
        >
         
          File New Warranty
        </button>
      </div>

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

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Filed on {new Date(warranty.created_at).toLocaleDateString()}
                  </div>
                  {/* {openSaleForm && (
                    <button
                      onClick={() => openSaleForm({
                        customer_name: warranty.customer_name,
                        customer_phone: warranty.customer_phone,
                        warranty_months: 12,
                        // Map to product if possible; placeholder product_id left undefined
                      })}
                      className="text-xs bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1 rounded-md hover:from-green-600 hover:to-emerald-700 transition-colors"
                    >
                      Create Sale
                    </button>
                  )} */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WarrantyView;