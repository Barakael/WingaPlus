import React from 'react';
import { Store, DollarSign, ShoppingCart, Package } from 'lucide-react';
import StatCard from '../Common/StatCard';
import { shops, products, sales } from '../../database';

const SuperAdminDashboard: React.FC = () => {
  const totalShops = shops.length;
  const totalProducts = products.length;
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum: number, sale: any) => sum + sale.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of all shops and system performance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Shops"
          value={totalShops}
          icon={Store}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Revenue"
          value={`TSh ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value={totalSales}
          icon={ShoppingCart}
          color="purple"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Total Products"
          value={totalProducts}
          icon={Package}
          color="orange"
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Shops
          </h2>
          <div className="space-y-4">
            {shops.map((shop: any) => (
              <div key={shop.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {shop.address}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {shop.phone}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            System Performance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Users</span>
              <span className="font-semibold text-gray-900 dark:text-white">24</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">System Uptime</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">Database Size</span>
              <span className="font-semibold text-gray-900 dark:text-white">2.4 GB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Requests/min</span>
              <span className="font-semibold text-gray-900 dark:text-white">1,247</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
