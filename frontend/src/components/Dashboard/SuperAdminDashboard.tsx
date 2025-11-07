import React, { useEffect, useState } from 'react';
import { Store, Users, Package, UserCheck } from 'lucide-react';
import { getDashboardStats } from '../../services/superAdmin';
import { showErrorToast } from '../../lib/toast';

interface DashboardStats {
  total_shops: number;
  total_salesmen: number;
  total_storekeepers: number;
  total_users: number;
}

interface TopProduct {
  product_name: string;
  sales_count: number;
  total_quantity: number;
}

interface RecentShop {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  status: string;
  owner?: {
    name: string;
  };
}

const SuperAdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    total_shops: 0,
    total_salesmen: 0,
    total_storekeepers: 0,
    total_users: 0,
  });
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [recentShops, setRecentShops] = useState<RecentShop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getDashboardStats();
        setStats(data.stats);
        setTopProducts(data.top_products || []);
        setRecentShops(data.recent_shops || []);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        showErrorToast('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1973AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-xs sm:text-sm md:text-base">
            Overview of all shops and system performance
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Store className="h-5 w-5 md:h-6 md:w-6 text-[#1973AE] dark:text-[#04BCF2]" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Shops</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total_shops}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="h-5 w-5 md:h-6 md:w-6 text-[#1973AE] dark:text-[#04BCF2]" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Salesmen (Mawinga)</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total_salesmen}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-5 w-5 md:h-6 md:w-6 text-[#1973AE] dark:text-[#04BCF2]" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Shop Keepers</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{stats.total_storekeepers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            Recent Shops
          </h2>
          {recentShops.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-xs sm:text-sm">No shops yet</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {recentShops.slice(0, 2).map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="min-w-0 flex-1 mr-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                      {shop.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {shop.location} {shop.address ? `• ${shop.address}` : ''}
                    </p>
                    {shop.owner && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 truncate">
                        Owner: {shop.owner.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      {shop.phone}
                    </p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                      shop.status === 'active' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                    }`}>
                      {shop.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            Top Performing Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8 text-xs sm:text-sm">No sales data yet</p>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-3 md:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center min-w-0 flex-1">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-2 md:mr-3 flex-shrink-0">
                      <Package className="h-4 w-4 md:h-5 md:w-5 text-[#1973AE] dark:text-[#04BCF2]" />
                    </div>
                    <div className="min-w-0 mr-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                        {product.product_name}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {product.total_quantity} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-[#1973AE] dark:text-[#04BCF2] text-sm sm:text-base">
                      {product.sales_count} sales
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
