import React from 'react';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import StatCard from '../Common/StatCard';
import { products, sales } from '../../database';

const ShopOwnerDashboard: React.FC = () => {
  const shopProducts = products.filter((p: any) => p.shop_id === '1');
  const shopSales = sales.filter((s: any) => {
    const product = products.find((p: any) => p.id === s.product_id);
    return product?.shop_id === '1';
  });
  
  const totalRevenue = shopSales.reduce((sum: number, sale: any) => sum + sale.total_amount, 0);
  const lowStockProducts = shopProducts.filter((p: any) => p.stock_quantity <= p.min_stock_level);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Shop Owner Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Downtown Phone Store - Overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Revenue"
          value={`TSh ${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="Total Sales"
          value={shopSales.length}
          icon={ShoppingCart}
          color="blue"
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="Products"
          value={shopProducts.length}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Sales
          </h2>
          <div className="space-y-4">
            {shopSales.slice(0, 5).map((sale: any) => {
              const product = products.find((p: any) => p.id === sale.product_id);
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
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Low Stock Alert
          </h2>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Only {product.stock_quantity} left
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded-full">
                      Low Stock
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  All products are well stocked!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <Package className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-600">Add Product</span>
          </button>
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-600">Manage Staff</span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-600">View Reports</span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-orange-600">Stock Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShopOwnerDashboard;