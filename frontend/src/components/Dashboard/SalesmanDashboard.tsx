import React from 'react';
import { DollarSign, ShoppingCart, Target, TrendingUp, QrCode, Clock } from 'lucide-react';
import StatCard from '../Common/StatCard';
import { products, sales } from '../../database';

const SalesmanDashboard: React.FC = () => {
  const mySales = sales.filter((s: any) => s.salesman_id === '4');
  const todaysSales = mySales.filter((s: any) => 
    new Date(s.sale_date).toDateString() === new Date().toDateString()
  );
  const totalRevenue = mySales.reduce((sum: number, sale: any) => sum + sale.total_amount, 0);
  const todaysRevenue = todaysSales.reduce((sum: number, sale: any) => sum + sale.total_amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Salesman Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your sales performance and scan QR codes
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`TSh ${todaysRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend={{ value: 15, isPositive: true }}
        />
        <StatCard
          title="Today's Sales"
          value={todaysSales.length}
          icon={ShoppingCart}
          color="blue"
          trend={{ value: 20, isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value={mySales.length}
          icon={Target}
          color="purple"
        />
        <StatCard
          title="Total Revenue"
          value={`TSh ${totalRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Scan QR Code</h2>
              <p className="opacity-90">Start a new sale by scanning product QR code</p>
            </div>
            <QrCode className="h-12 w-12 opacity-80" />
          </div>
          <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white py-3 px-4 rounded-lg font-medium transition-all duration-200">
            Open QR Scanner
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Sales Target
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Monthly Target</span>
              <span className="font-semibold text-gray-900 dark:text-white">$5,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Achieved</span>
              <span className="font-semibold text-green-600">TSh {totalRevenue.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalRevenue / 5000) * 100, 100)}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {((totalRevenue / 5000) * 100).toFixed(1)}% of monthly target achieved
            </p>
          </div>
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          My Recent Sales
        </h2>
        <div className="space-y-4">
          {mySales.slice(0, 5).map((sale) => {
            const product = products.find((p: any) => p.id === sale.product_id);
            return (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <ShoppingCart className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {product?.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {sale.customer_name} • Qty: {sale.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    TSh {sale.total_amount}
                  </p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;