import React from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Target, Calendar, Award } from 'lucide-react';
import { sales, products } from '../../database';
import { useAuth } from '../../contexts/AuthContext';

const SalesmanSales: React.FC = () => {
  const { user } = useAuth();

  // Filter sales for current salesman
  const mySales = sales.filter(sale => sale.salesman_id === user?.id);

  // Calculate stats
  const totalSales = mySales.reduce((sum, sale) => sum + sale.total_amount, 0);
  const totalItems = mySales.reduce((sum, sale) => sum + sale.quantity, 0);
  const averageSale = mySales.length > 0 ? totalSales / mySales.length : 0;

  // Monthly target (mock)
  const monthlyTarget = 5000;
  const monthlyProgress = (totalSales / monthlyTarget) * 100;

  // Recent sales
  const recentSales = mySales.slice(0, 10);

  // Sales by product
  const salesByProduct = mySales.reduce((acc, sale) => {
    const product = products.find(p => p.id === sale.product_id);
    if (product) {
      acc[product.name] = (acc[product.name] || 0) + sale.total_amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(salesByProduct)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Sales Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your sales performance and achievements
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Items Sold</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Sale</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {averageSale.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{mySales.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Target Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Monthly Target Progress
        </h2>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              TSh {totalSales.toLocaleString()} / TSh {monthlyTarget.toLocaleString()}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {monthlyProgress.toFixed(1)}% Complete
            </span>
            <span className={`font-medium ${monthlyProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
              TSh {Math.max(0, monthlyTarget - totalSales).toLocaleString()} remaining
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Recent Sales
          </h2>

          <div className="space-y-4">
            {recentSales.length > 0 ? (
              recentSales.map((sale) => {
                const product = products.find(p => p.id === sale.product_id);
                return (
                  <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {product?.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {sale.customer_name} • Qty: {sale.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">
                        TSh {sale.total_amount}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No sales yet
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Start making sales to see your performance here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Top Performing Products
          </h2>

          <div className="space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map(([productName, revenue], index) => (
                <div key={productName} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {productName}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Revenue generated
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">
                      TSh {revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No sales data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Performance Insights
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Sales Trend
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {mySales.length > 5 ? 'You\'re on a good streak!' : 'Keep up the momentum!'}
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">
              Customer Satisfaction
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              {mySales.filter(s => s.warranty_months > 0).length} warranties provided
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Product Knowledge
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Selling {new Set(mySales.map(s => s.product_id)).size} different products
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesmanSales;
