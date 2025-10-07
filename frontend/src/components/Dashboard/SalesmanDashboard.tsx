import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingCart, Target, TrendingUp, Clock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listSales } from '../../services/sales';

interface SalesmanDashboardProps {
  onTabChange?: (tab: string) => void;
}

const SalesmanDashboard: React.FC<SalesmanDashboardProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const [mySales, setMySales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    const run = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await listSales({ salesman_id: String(user.id) });
        setMySales(data);
      } catch (e: any) {
        console.error('Failed to load sales:', e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user]);

  // Calculate stats
  const totalSales = mySales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalItems = mySales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
  const totalGanji = mySales.reduce((sum, sale) => {
    const ganji = (Number(sale.unit_price) - Number(sale.cost_price)) * Number(sale.quantity);
    return sum + ganji;
  }, 0);
  const averageSale = mySales.length > 0 ? totalSales / mySales.length : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Salesman Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
            Track your sales performance 
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 md:h-5 md:w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm md:text-md font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Tsh {formatCurrency(totalSales)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">TSh <br></br> {formatCurrency(totalGanji)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Items <br /> Sold</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Sale</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">TSh <br></br> {formatCurrency(averageSale)}</p>
            </div>
          </div>
        </div>
      </div>

    
      {/* Advanced Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Commission (Ganji)</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">View earnings & payouts</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('commissions')}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-blue-600 transition-all duration-200 text-sm"
          >
            View Commissions(Ganji)
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4">
              <Target className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Target Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Track goals & achievements</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('targets')}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-200 text-sm"
          >
            View Targets
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Warranties</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Manage warranties & claims</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('warranties')}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 text-sm"
          >
            View Warranties
          </button>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          My Recent Sales
        </h2>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading sales...</div>
          ) : mySales.slice(0, 2).map((sale: any) => (
            <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {sale.product_name || sale.product_id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sale.customer_name || 'Customer'} • Qty: {sale.quantity}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">
                  TSh {formatCurrency(sale.total_amount)}
                </p>
                <p className="text-xs text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(sale.sale_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;