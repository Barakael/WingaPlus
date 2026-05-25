import React, { useEffect, useMemo, useState } from 'react';
import { Activity, Download } from 'lucide-react';
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
  LineChart,
  Line,
} from 'recharts';
import { getLogs } from '../../services/superAdmin';
import { showErrorToast } from '../../lib/toast';

interface LogItem {
  id: number;
  action: string;
  model: string;
  description: string;
  changes?: Record<string, unknown> | null;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email?: string;
  } | null;
}

interface PaginatedLogs {
  data: LogItem[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const SystemLogs: React.FC = () => {
  const [logs, setLogs] = useState<PaginatedLogs>({
    data: [],
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [action, setAction] = useState('');
  const [model, setModel] = useState('');
  const [query, setQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const fetchLogs = async (pageNumber = page) => {
    try {
      setLoading(true);
      const data = await getLogs({
        page: String(pageNumber),
        per_page: '20',
        action: action || undefined,
        model: model || undefined,
        q: query || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
      setLogs(data);
    } catch (error) {
      showErrorToast('Failed to load system logs');
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApply = () => {
    setPage(1);
    fetchLogs(1);
  };

  const onReset = () => {
    setAction('');
    setModel('');
    setQuery('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
    setTimeout(() => fetchLogs(1), 0);
  };

  const onPageChange = (nextPage: number) => {
    if (nextPage < 1 || nextPage > logs.last_page) return;
    setPage(nextPage);
    fetchLogs(nextPage);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const actionChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    logs.data.forEach((item) => {
      grouped[item.action] = (grouped[item.action] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [logs.data]);

  const modelChartData = useMemo(() => {
    const grouped: Record<string, number> = {};
    logs.data.forEach((item) => {
      const modelName = item.model || 'Unknown';
      grouped[modelName] = (grouped[modelName] || 0) + 1;
    });
    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  }, [logs.data]);

  const dailyTrendData = useMemo(() => {
    const grouped: Record<string, number> = {};
    logs.data.forEach((item) => {
      const day = new Date(item.created_at).toISOString().slice(0, 10);
      grouped[day] = (grouped[day] || 0) + 1;
    });
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [logs.data]);

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

  const exportFilteredLogs = () => {
    downloadCsv(
      'system_logs_filtered.csv',
      logs.data.map((item) => ({
        id: item.id,
        action: item.action,
        model: item.model || 'N/A',
        user: item.user?.name || 'System',
        description: item.description,
        created_at: formatDate(item.created_at),
      }))
    );
    setShowExportMenu(false);
  };

  const exportActionSummary = () => {
    downloadCsv('system_logs_action_summary.csv', actionChartData);
    setShowExportMenu(false);
  };

  const exportModelSummary = () => {
    downloadCsv('system_logs_model_summary.csv', modelChartData);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Logs</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track login, registration and system changes</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <input
            type="text"
            placeholder="Search description"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All actions</option>
            <option value="login">login</option>
            <option value="logout">logout</option>
            <option value="register">register</option>
            <option value="create">create</option>
            <option value="update">update</option>
            <option value="delete">delete</option>
          </select>
          <input
            type="text"
            placeholder="Model (User, Shop...)"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <div className="flex gap-2">
            <button onClick={onApply} className="px-3 py-2 text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a]">
              Filter
            </button>
            <button onClick={onReset} className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200">
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Activity className="h-7 w-7 text-purple-600" />
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Logs Overview</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total records on current page: {logs.data.length}</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300">Total matching: {logs.total}</p>
        </div>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading logs...</p>
        ) : logs.data.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">No logs found.</p>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Actions Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <BarChart data={actionChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#9333ea" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Models Distribution</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <PieChart>
                    <Pie data={modelChartData} dataKey="value" nameKey="name" outerRadius={95} label>
                      {modelChartData.map((entry, index) => (
                        <Cell key={`cell-${entry.name}`} fill={['#1973AE', '#16a34a', '#9333ea', '#ea580c', '#2563eb'][index % 5]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 xl:col-span-2">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Daily Log Trend (Current Page)</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={220}>
                  <LineChart data={dailyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="count" stroke="#1973AE" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-2 pb-20 flex items-center justify-between">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Page {logs.current_page} of {logs.last_page}
        </p>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= logs.last_page}
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <div className="fixed bottom-6 right-6 z-40">
        <div className="relative">
          {showExportMenu && (
            <div className="absolute bottom-14 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 min-w-56 border border-gray-200 dark:border-gray-700">
              <button onClick={exportFilteredLogs} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Filtered Logs</button>
              <button onClick={exportActionSummary} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Action Summary</button>
              <button onClick={exportModelSummary} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">Export Model Summary</button>
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

export default SystemLogs;
