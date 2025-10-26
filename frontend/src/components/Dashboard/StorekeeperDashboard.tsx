import React from 'react';
import { Package, AlertTriangle, TrendingUp, Warehouse, Plus, Minus } from 'lucide-react';
import StatCard from '../Common/StatCard';
import { products } from '../../database';

const StorekeeperDashboard: React.FC = () => {
  const lowStockProducts = products.filter((p: any) => p.stock_quantity <= p.min_stock_level);
  const totalStock = products.reduce((sum: number, product: any) => sum + product.stock_quantity, 0);
  const outOfStockProducts = products.filter((p: any) => p.stock_quantity === 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Storekeeper Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage inventory and track stock levels
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Products"
          value={products.length}
          icon={Package}
          color="blue"
        />
        <StatCard
          title="Total Stock"
          value={totalStock}
          icon={Warehouse}
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value={lowStockProducts.length}
          icon={AlertTriangle}
          color="orange"
        />
        <StatCard
          title="Out of Stock"
          value={outOfStockProducts.length}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Inventory Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Low Stock Alert
          </h2>
          <div className="space-y-4">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-sm text-orange-600 dark:text-orange-400">
                      Stock: {product.stock_quantity} / Min: {product.min_stock_level}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Stock Movements
          </h2>
          <div className="space-y-4">
            {/* Mock stock movements */}
            {[
              { type: 'in', product: 'iPhone 15', quantity: 10, date: '2024-01-15' },
              { type: 'out', product: 'Samsung Galaxy S24', quantity: 2, date: '2024-01-14' },
              { type: 'in', product: 'Phone Case', quantity: 50, date: '2024-01-13' },
            ].map((movement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                    movement.type === 'in' 
                      ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400'
                  }`}>
                    {movement.type === 'in' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {movement.product}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {movement.type === 'in' ? 'Stock In' : 'Stock Out'} • {movement.quantity} units
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {new Date(movement.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <Plus className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-600">Add Stock</span>
          </button>
          <button className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <Package className="h-8 w-8 text-[#800000] mx-auto mb-2" />
            <span className="text-sm font-medium text-[#800000]">New Product</span>
          </button>
          <button className="p-4 bg-purple-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors">
            <TrendingUp className="h-8 w-8 text-[#800000] mx-auto mb-2" />
            <span className="text-sm font-medium text-[#800000]">Stock Report</span>
          </button>
          <button className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-orange-600">Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StorekeeperDashboard;
