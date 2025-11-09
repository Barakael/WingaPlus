import React, { useState, useEffect, useCallback } from 'react';
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, AlertTriangle, Clock, Wrench } from 'lucide-react';
import StatCard from '../Common/StatCard';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import ShopProducts from '../Shop/ShopProducts';
import ShopSales from '../Shop/ShopSales';
import ShopStaff from '../Shop/ShopStaff';
import ShopServices from '../Shop/ShopServices';
import ShopGanji from '../Shop/ShopGanji';
import WarrantyView from '../Warranties/WarrantyView';
import Reports from '../Reports/Reports';
import Settings from '../Common/Settings';

interface ShopOwnerDashboardProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

const ShopOwnerDashboard: React.FC<ShopOwnerDashboardProps> = ({ activeTab = 'dashboard', onTabChange }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    totalProducts: 0,
    lowStockProducts: 0,
    totalStaff: 0,
    totalProfit: 0,
  });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch dashboard stats
  const fetchDashboardStats = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const shopId = user.shop_id || user.id;

      const [salesRes, productsRes, staffRes] = await Promise.all([
        fetch(`${BASE_URL}/api/sales?shop_id=${shopId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        }),
        fetch(`${BASE_URL}/api/products?shop_id=${shopId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        }),
        fetch(`${BASE_URL}/api/users?shop_id=${shopId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
        }),
      ]);

      const salesData = await salesRes.json();
      const productsData = await productsRes.json();
      const staffData = await staffRes.json();

      const sales = salesData?.data?.data || salesData?.data || [];
      const products = productsData?.data?.data || productsData?.data || [];
      const staff = staffData?.data?.data || staffData?.data || [];

      // Calculate stats
      const totalRevenue = sales.reduce((sum: number, sale: any) => {
        return sum + (Number(sale.total_amount) - (Number(sale.offers) || 0));
      }, 0);

      const totalProfit = sales.reduce((sum: number, sale: any) => {
        const profit = sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0);
        return sum + profit;
      }, 0);

      const lowStock = products.filter((p: any) => 
        p.stock_quantity > 0 && p.stock_quantity <= p.min_stock_level
      );

      setStats({
        totalRevenue,
        totalSales: sales.length,
        totalProducts: products.length,
        lowStockProducts: lowStock.length,
        totalStaff: staff.filter((s: any) => s.role === 'salesman' || s.role === 'storekeeper').length,
        totalProfit,
      });

      setRecentSales(sales.slice(0, 5));
      setLowStockProducts(lowStock.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === 'dashboard') {
      fetchDashboardStats();
    }
  }, [activeTab, fetchDashboardStats]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ShopProducts />;
      case 'sales':
        return <ShopSales />;
      case 'services':
        return <ShopServices />;
      case 'ganji':
        return <ShopGanji />;
      case 'staff':
        return <ShopStaff />;
      case 'warranties':
        return <WarrantyView onFileWarranty={() => {}} />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Shop Owner Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            {user?.name}'s Shop Overview
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
        <StatCard
          title="Revenue"
          value={`TSh ${formatCurrency(stats.totalRevenue)}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Profit"
          value={`TSh ${formatCurrency(stats.totalProfit)}`}
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="Sales"
          value={stats.totalSales}
          icon={ShoppingCart}
          color="purple"
        />
        <StatCard
          title="Products"
          value={stats.totalProducts}
          icon={Package}
          color="purple"
        />
        <StatCard
          title="Staff"
          value={stats.totalStaff}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Low Stock"
          value={stats.lowStockProducts}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Products</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage inventory</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('products')}
            className="w-full bg-[#1973AE] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#0d5a8a] transition-all duration-200"
          >
            Manage Products
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Sales</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">View all transactions</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('sales')}
            className="w-full bg-[#1973AE] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#0d5a8a] transition-all duration-200"
          >
            View Sales
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Staff</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage team</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('staff')}
            className="w-full bg-[#1973AE] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#0d5a8a] transition-all duration-200"
          >
            Manage Staff
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Ganji</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Profit from sales & services</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('ganji')}
            className="w-full bg-[#1973AE] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#0d5a8a] transition-all duration-200"
          >
            View Ganji
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow duration-200">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3 sm:mr-4">
              <Wrench className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">Services</h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Manage repairs & jobs</p>
            </div>
          </div>
          <button 
            onClick={() => onTabChange?.('services')}
            className="w-full bg-[#1973AE] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#0d5a8a] transition-all duration-200"
          >
            View Services
          </button>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Sales
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : recentSales.length > 0 ? (
              recentSales.map((sale: any) => {
                const profit = sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0);
                
                return (
                  <div key={sale.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3">
                        <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {sale.product_name || sale.product_id}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {sale.customer_name || 'Customer'} • Qty: {sale.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-green-600">
                        TSh {formatCurrency(profit)}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center justify-end mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(sale.sale_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No recent sales</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4">
            Low Stock Alert
          </h2>
          <div className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading...</div>
            ) : lowStockProducts.length > 0 ? (
              lowStockProducts.map((product: any) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {product.name}
                    </h3>
                    <p className="text-xs text-red-600 dark:text-red-400">
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
    </div>
  );

  return renderContent();
};

export default ShopOwnerDashboard;
