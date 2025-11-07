import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import { getReports } from '../../services/superAdmin';
import { showErrorToast } from '../../lib/toast';

interface SalesByShop {
  shop_name: string;
  total_sales: number;
  total_amount: string;
}

interface SalesBySalesman {
  salesman_name: string;
  shop_name: string;
  total_sales: number;
  total_amount: string;
}

interface RecentActivity {
  user_name: string;
  action: string;
  model: string;
  description: string;
  created_at: string;
}

interface ReportsData {
  sales_by_shop: SalesByShop[];
  sales_by_salesman: SalesBySalesman[];
  recent_activities: RecentActivity[];
}

const SystemReports: React.FC = () => {
  const [reports, setReports] = useState<ReportsData>({
    sales_by_shop: [],
    sales_by_salesman: [],
    recent_activities: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await getReports();
      setReports(data.data || {
        sales_by_shop: [],
        sales_by_salesman: [],
        recent_activities: [],
      });
    } catch (error: any) {
      showErrorToast('Failed to load reports');
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-TZ', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            System Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Analytics and activity tracking
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#1973AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      ) : (
        <>
          {/* Sales by Shop */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600">
              <div className="flex items-center text-white">
                <BarChart3 className="h-8 w-8 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Sales by Shop</h2>
                  <p className="text-blue-100">Performance overview of all shops</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {reports.sales_by_shop.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No sales data available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Shop Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {reports.sales_by_shop.map((shop, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {shop.shop_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {shop.total_sales} sales
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(shop.total_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Sales by Salesman */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-green-500 to-green-600">
              <div className="flex items-center text-white">
                <TrendingUp className="h-8 w-8 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Sales by Salesman</h2>
                  <p className="text-green-100">Individual performance tracking</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {reports.sales_by_salesman.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No salesman data available
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Salesman
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Shop
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {reports.sales_by_salesman.map((salesman, index) => (
                        <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                            {salesman.salesman_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {salesman.shop_name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {salesman.total_sales} sales
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(salesman.total_amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600">
              <div className="flex items-center text-white">
                <Activity className="h-8 w-8 mr-3" />
                <div>
                  <h2 className="text-xl font-bold">Recent Activities</h2>
                  <p className="text-purple-100">Latest system activities</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              {reports.recent_activities.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent activities
                </p>
              ) : (
                <div className="space-y-4">
                  {reports.recent_activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-purple-600 dark:text-purple-300" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {activity.user_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                            {activity.action}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
                            {activity.model}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SystemReports;
