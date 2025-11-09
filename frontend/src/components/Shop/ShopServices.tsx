import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { RefreshCw, Eye, Edit, Trash2, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import ViewServiceModal from '../Services/ViewServiceModal';
import EditServiceModal from '../Services/EditServiceModal';

const ShopServices: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [_, setError] = useState<string | null>(null);

  // Filters
  const [filterType, setFilterType] = useState<'daily' | 'monthly' | 'yearly' | 'range'>('daily');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [search, setSearch] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const shopId = useMemo(() => (user?.shop_id || user?.id), [user]);

  const loadServices = useCallback(async () => {
    if (!shopId) return;
    try {
      setLoading(true);
      setError(null);
      const url = `${BASE_URL}/api/services?shop_id=${shopId}`;
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error(`Failed to fetch services: ${res.status}`);
      const json = await res.json();
      const data = json?.data?.data ?? json?.data ?? [];
      setServices(Array.isArray(data) ? data : []);
      setCurrentPage(1);
    } catch (e: any) {
      setError(e?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const filtered = useMemo(() => {
    let items = services;

    // date filters
    items = items.filter((svc) => {
      const dateStr = (svc.service_date ? new Date(svc.service_date) : new Date(svc.created_at)).toISOString().split('T')[0];
      if (filterType === 'daily' && dateFilter) return dateStr === dateFilter;
      if (filterType === 'monthly' && monthFilter && yearFilter) {
        const d = new Date(svc.service_date || svc.created_at);
        const m = (d.getMonth() + 1).toString().padStart(2, '0');
        const y = d.getFullYear().toString();
        return m === monthFilter && y === yearFilter;
      }
      if (filterType === 'yearly' && yearFilter) return new Date(dateStr).getFullYear().toString() === yearFilter;
      if (filterType === 'range' && startDateFilter && endDateFilter) return dateStr >= startDateFilter && dateStr <= endDateFilter;
      return true;
    });

    // search filter
    if (search) {
      const q = search.toLowerCase();
      items = items.filter((s) =>
        (s.device_name || '').toLowerCase().includes(q) ||
        (s.customer_name || '').toLowerCase().includes(q)
      );
    }
    return items;
  }, [services, filterType, dateFilter, monthFilter, yearFilter, startDateFilter, endDateFilter, search]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  const calcGanji = (svc: any) => {
    const finalP = Number(svc.final_price) || 0;
    const issue = Number(svc.issue_price) || 0;
    const sp = Number(svc.service_price) || 0;
    const offers = Number(svc.offers) || 0;
    return (finalP - (issue + sp)) - offers;
  };

  const totals = useMemo(() => {
    const ganji = filtered.reduce((sum, s) => sum + (Number(s.ganji) || calcGanji(s)), 0);
    const revenue = filtered.reduce((sum, s) => sum + (Number(s.final_price) || 0), 0);
    return { ganji, revenue, count: filtered.length };
  }, [filtered]);

  // actions
  const handleView = (svc: any) => { setSelectedService(svc); setViewModalOpen(true); };
  const handleEdit = (svc: any) => { setSelectedService(svc); setEditModalOpen(true); };
  const handleDelete = async (svc: any) => {
    if (!confirm(`Delete service for ${svc.device_name}?`)) return;
    try {
      const res = await fetch(`${BASE_URL}/api/services/${svc.id}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      await loadServices();
    } catch (e: any) {
      alert(e?.message || 'Delete failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Track service jobs and profit</p>
        </div>
        <button onClick={loadServices} className="px-3 py-2 bg-[#1973AE] text-white rounded-lg flex items-center text-sm">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Revenue</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">TSh {Math.round(totals.revenue).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Profit (Ganji)</div>
          <div className="text-lg font-semibold text-green-600 flex items-center"><TrendingUp className="h-4 w-4 mr-1"/> {Math.round(totals.ganji).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Jobs</div>
          <div className="text-lg font-semibold text-gray-900 dark:text-white">{totals.count}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <select value={filterType} onChange={(e)=>setFilterType(e.target.value as any)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white">
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="range">Range</option>
          </select>
          {filterType==='daily' && (<input type="date" value={dateFilter} onChange={(e)=>setDateFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>)}
          {filterType==='monthly' && (
            <>
              <select value={monthFilter} onChange={(e)=>setMonthFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white">
                <option value="">Month</option>
                {Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')).map(m=> <option key={m} value={m}>{m}</option>)}
              </select>
              <input type="number" value={yearFilter} onChange={(e)=>setYearFilter(e.target.value)} className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
            </>
          )}
          {filterType==='yearly' && (<input type="number" value={yearFilter} onChange={(e)=>setYearFilter(e.target.value)} className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>)}
          {filterType==='range' && (
            <>
              <input type="date" value={startDateFilter} onChange={(e)=>setStartDateFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
              <input type="date" value={endDateFilter} onChange={(e)=>setEndDateFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
            </>
          )}
          <input placeholder="Search device/customer" value={search} onChange={(e)=>setSearch(e.target.value)} className="flex-1 min-w-[160px] border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
        {loading ? (
          <div className="text-center text-sm text-gray-500 dark:text-gray-400 py-8">Loading services...</div>
        ) : pageItems.length > 0 ? (
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Device</th>
                <th className="text-left py-2 hidden sm:table-cell">Customer</th>
                <th className="text-right py-2">Final Price</th>
                <th className="text-right py-2">Ganji</th>
                <th className="text-center py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((svc)=>{
                const ganji = Number(svc.ganji) || calcGanji(svc);
                return (
                  <tr key={svc.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/10">
                    <td className="py-2">{svc.service_date ? new Date(svc.service_date).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-2 font-medium">{svc.device_name || 'N/A'}</td>
                    <td className="py-2 hidden sm:table-cell">{svc.customer_name || 'N/A'}</td>
                    <td className="py-2 text-right">TSh {(Number(svc.final_price)||0).toLocaleString()}</td>
                    <td className={`py-2 text-right ${ganji>=0 ? 'text-green-600' : 'text-red-600'}`}>{Math.round(ganji).toLocaleString()}</td>
                    <td className="py-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={()=>handleView(svc)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded" title="View"><Eye className="h-4 w-4"/></button>
                        <button onClick={()=>handleEdit(svc)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-green-600" title="Edit"><Edit className="h-4 w-4"/></button>
                        <button onClick={()=>handleDelete(svc)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-600" title="Delete"><Trash2 className="h-4 w-4"/></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">No services found.</div>
        )}

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400">Showing {startIdx+1} - {Math.min(startIdx+itemsPerPage, filtered.length)} of {filtered.length}</div>
            <div className="flex items-center gap-1">
              <button onClick={()=>setCurrentPage(p=>Math.max(1,p-1))} disabled={currentPage===1} className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">Prev</button>
              <span className="text-xs">{currentPage}/{totalPages}</span>
              <button onClick={()=>setCurrentPage(p=>Math.min(totalPages,p+1))} disabled={currentPage===totalPages} className="px-2 py-1 text-sm rounded bg-gray-100 dark:bg-gray-700 disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ViewServiceModal service={selectedService} isOpen={viewModalOpen} onClose={()=>{setViewModalOpen(false); setSelectedService(null);}} />
      <EditServiceModal service={selectedService} isOpen={editModalOpen} onClose={()=>{setEditModalOpen(false); setSelectedService(null);}} onUpdate={loadServices} />
    </div>
  );
};

export default ShopServices;
