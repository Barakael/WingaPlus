import React, { useEffect, useMemo, useState } from 'react';
import { BarChart3, Download, Store, UserCheck } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getReportsWithFilters, type ReportsResponse } from '../../services/superAdmin';
import { showErrorToast } from '../../lib/toast';

const SystemReports: React.FC = () => {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [reports, setReports] = useState<ReportsResponse>({
    period: {
      date_from: null,
      date_to: null,
    },
    summary: {
      joined_shops: 0,
      joined_wingas: 0,
      active_shops: 0,
      active_wingas: 0,
    },
    sales_by_shop: [],
    sales_by_salesman: [],
    recent_activity: [],
  });
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);

  useEffect(() => {
    fetchReports({});
  }, []);

  const fetchReports = async (params: { date_from?: string; date_to?: string }) => {
    try {
      setLoading(true);
      const data = await getReportsWithFilters(params);
      setReports(data);
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

  const applyDateFilter = () => {
    fetchReports({
      date_from: dateFrom || undefined,
      date_to: dateTo || undefined,
    });
  };

  const resetDateFilter = () => {
    setDateFrom('');
    setDateTo('');
    fetchReports({});
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

  const shopRevenueChartData = useMemo(
    () =>
      reports.sales_by_shop.map((shop) => ({
        name: shop.shop?.name || `Shop #${shop.shop_id}`,
        revenue: Number(shop.total_revenue || 0),
        sales: Number(shop.total_sales || 0),
      })),
    [reports.sales_by_shop]
  );

  const wingaRevenueChartData = useMemo(
    () =>
      reports.sales_by_salesman.map((winga) => ({
        name: winga.salesman?.name || `Winga #${winga.salesman_id}`,
        revenue: Number(winga.total_revenue || 0),
        sales: Number(winga.total_sales || 0),
      })),
    [reports.sales_by_salesman]
  );

  const activityTypeChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    reports.recent_activity.forEach((item) => {
      grouped[item.action] = (grouped[item.action] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [reports.recent_activity]);

  const summaryChartData = useMemo(
    () => [
      { name: 'Joined Shops', value: reports.summary.joined_shops },
      { name: 'Joined Wingas', value: reports.summary.joined_wingas },
      { name: 'Active Shops', value: reports.summary.active_shops },
      { name: 'Active Wingas', value: reports.summary.active_wingas },
    ],
    [reports.summary]
  );

  const downloadCsv = (filename: string, rows: Array<Record<string, string | number>>) => {
    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        headers
          .map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`)
          .join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportSummary = () => {
    downloadCsv('report_summary.csv', [
      {
        joined_shops: reports.summary.joined_shops,
        joined_wingas: reports.summary.joined_wingas,
        active_shops: reports.summary.active_shops,
        active_wingas: reports.summary.active_wingas,
      },
    ]);
    setShowExportMenu(false);
  };

  const exportShops = () => {
    downloadCsv(
      'shops_report.csv',
      reports.sales_by_shop.map((shop) => ({
        shop_id: shop.shop_id,
        shop_name: shop.shop?.name || '',
        total_sales: shop.total_sales,
        total_revenue: shop.total_revenue,
      }))
    );
    setShowExportMenu(false);
  };

  const exportWingas = () => {
    downloadCsv(
      'wingas_report.csv',
      reports.sales_by_salesman.map((winga) => ({
        salesman_id: winga.salesman_id,
        salesman_name: winga.salesman?.name || '',
        shop_name: winga.salesman?.shop?.name || '',
        total_sales: winga.total_sales,
        total_revenue: winga.total_revenue,
      }))
    );
    setShowExportMenu(false);
  };

  const exportActivity = () => {
    downloadCsv(
      'activity_report.csv',
      reports.recent_activity.map((activity) => ({
        id: activity.id,
        user_name: activity.user?.name || 'System',
        action: activity.action,
        model: activity.model,
        description: activity.description,
        created_at: formatDate(activity.created_at),
      }))
    );
    setShowExportMenu(false);
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Date from</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">Date to</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={applyDateFilter}
            className="px-4 py-2 bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] text-sm font-medium"
          >
            Apply Filter
          </button>
          <button
            onClick={resetDateFilter}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium"
          >
            Reset
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-[#1973AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading reports...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Joined Shops</p>
                <Store className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.summary.joined_shops}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Joined Wingas</p>
                <UserCheck className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.summary.joined_wingas}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Active Shops</p>
                <Store className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.summary.active_shops}</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">Active Wingas</p>
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{reports.summary.active_wingas}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shops Revenue</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                  <BarChart data={shopRevenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#1973AE" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Wingas Revenue</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                  <BarChart data={wingaRevenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="revenue" fill="#16a34a" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Joined vs Active</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                  <PieChart>
                    <Pie data={summaryChartData} dataKey="value" nameKey="name" outerRadius={110} label>
                      {summaryChartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={['#1973AE', '#2563eb', '#16a34a', '#22c55e'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity Types</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={250}>
                  <BarChart data={activityTypeChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#9333ea" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {showExportMenu && (
            <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 min-w-56 border border-gray-200 dark:border-gray-700">
              <button onClick={exportSummary} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Summary</button>
              <button onClick={exportShops} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Shops Report</button>
              <button onClick={exportWingas} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Wingas Report</button>
              <button onClick={exportActivity} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Activity Report</button>
            </div>
          )}
          <button
            onClick={() => setShowExportMenu((prev) => !prev)}
            className="h-12 w-12 rounded-full bg-[#1973AE] text-white shadow-lg hover:bg-[#0d5a8a] flex items-center justify-center"
            aria-label="Open export menu"
          >
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;
