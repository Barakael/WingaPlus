import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
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

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-600">
          <div className="flex items-center text-white">
            <Activity className="h-8 w-8 mr-3" />
            <div>
              <h2 className="text-xl font-bold">Activity Logs</h2>
              <p className="text-purple-100">Total: {logs.total}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">Loading logs...</p>
          ) : logs.data.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No logs found.</p>
          ) : (
            <div className="space-y-3">
              {logs.data.map((item) => (
                <div key={item.id} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {item.user?.name || 'System'} - {item.action}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(item.created_at)}</p>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                      {item.action}
                    </span>
                    <span className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      {item.model || 'N/A'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex items-center justify-between">
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
      </div>
    </div>
  );
};

export default SystemLogs;
