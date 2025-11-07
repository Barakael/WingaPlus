import React, { useEffect, useState } from 'react';
import { Store, Users, Package, UserCheck } from 'lucide-react';
import StatCard from '../Common/StatCard';
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Shops"
          value={stats.total_shops}
          icon={Store}
          color="blue"
        />
        <StatCard
          title="Total Salesmen (Mawinga)"
          value={stats.total_salesmen}
          icon={Users}
          color="green"
        />
        <StatCard
          title="Shop Keepers"
          value={stats.total_storekeepers}
          icon={UserCheck}
          color="purple"
        />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Recent Shops
          </h2>
          {recentShops.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No shops yet</p>
          ) : (
            <div className="space-y-4">
              {recentShops.map((shop) => (
                <div key={shop.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {shop.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {shop.location} {shop.address ? `• ${shop.address}` : ''}
                    </p>
                    {shop.owner && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Owner: {shop.owner.name}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Top Performing Products
          </h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No sales data yet</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-[#1973AE] rounded-lg flex items-center justify-center mr-3">
                      <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {product.product_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {product.total_quantity} units sold
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#1973AE]">
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
