import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, RefreshCw, FileDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface CombinedRecord {
  id: string | number;
  type: 'sale' | 'service';
  date: string;
  label: string;
  customer: string;
  revenue: number; // total amount or final_price
  ganji: number; // profit
  offers: number;
  warranty: boolean;
}

const ShopGanji: React.FC = () => {
  const { user } = useAuth();
  const shopId = useMemo(() => (user?.shop_id || user?.id), [user]);

  const [sales, setSales] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
  const itemsPerPage = 15;

  // Load sales and services
  const loadData = useCallback(async () => {
    if (!shopId) return;
    try {
      setLoading(true);
      const headers = { 'Accept': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` };
      const [salesRes, servicesRes] = await Promise.all([
        fetch(`${BASE_URL}/api/sales?shop_id=${shopId}`, { headers }),
        fetch(`${BASE_URL}/api/services?shop_id=${shopId}`, { headers }),
      ]);
      const salesJson = await salesRes.json();
      const servicesJson = await servicesRes.json();
      const sData = salesJson?.data?.data ?? salesJson?.data ?? [];
      const svcData = servicesJson?.data?.data ?? servicesJson?.data ?? [];
      setSales(Array.isArray(sData) ? sData : []);
      setServices(Array.isArray(svcData) ? svcData : []);
      setCurrentPage(1);
    } catch (e) {
      console.error('Failed to load ganji data', e);
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => { loadData(); }, [loadData]);

  const combined: CombinedRecord[] = useMemo(() => {
    const saleRecords: CombinedRecord[] = sales.map(s => {
      const cost = Number(s.cost_price) || 0;
      const unit = Number(s.unit_price) || Number(s.selling_price) || 0;
      const qty = Number(s.quantity) || 1;
      const offers = Number(s.offers) || 0;
      const revenue = Number(s.total_amount) || qty * unit;
      const ganji = s.ganji != null ? Number(s.ganji) : ((unit - cost) * qty) - offers;
      return {
        id: s.id,
        type: 'sale',
        date: s.sale_date || s.created_at,
        label: (s.product_name || s.product_id || 'Sale').toString(),
        customer: s.customer_name || 'N/A',
        revenue,
        ganji,
        offers,
        warranty: !!s.has_warranty,
      };
    });
    const serviceRecords: CombinedRecord[] = services.map(svc => {
      const issue = Number(svc.issue_price) || 0;
      const sp = Number(svc.service_price) || 0;
      const final = Number(svc.final_price) || 0;
      const offers = Number(svc.offers) || 0;
      const cost = issue + sp;
      const ganji = svc.ganji != null ? Number(svc.ganji) : (final - cost) - offers;
      return {
        id: svc.id,
        type: 'service',
        date: svc.service_date || svc.created_at,
        label: (svc.device_name || 'service').toString(),
        customer: svc.customer_name || 'N/A',
        revenue: final,
        ganji,
        offers,
        warranty: false,
      };
    });
    return [...saleRecords, ...serviceRecords].sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [sales, services]);

  const filtered = useMemo(() => {
    let items = combined;
    items = items.filter(r => {
      const d = new Date(r.date);
      const iso = d.toISOString().split('T')[0];
      if (filterType === 'daily' && dateFilter) return iso === dateFilter;
      if (filterType === 'monthly' && monthFilter && yearFilter) {
        const m = (d.getMonth()+1).toString().padStart(2,'0');
        const y = d.getFullYear().toString();
        return m === monthFilter && y === yearFilter;
      }
      if (filterType === 'yearly' && yearFilter) return d.getFullYear().toString() === yearFilter;
      if (filterType === 'range' && startDateFilter && endDateFilter) return iso >= startDateFilter && iso <= endDateFilter;
      return true;
    });
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => r.label.toLowerCase().includes(q) || r.customer.toLowerCase().includes(q));
    }
    return items;
  }, [combined, filterType, dateFilter, monthFilter, yearFilter, startDateFilter, endDateFilter, search]);

  const totals = useMemo(()=>{
    const revenue = filtered.reduce((sum,r)=> sum + r.revenue, 0);
    const ganji = filtered.reduce((sum,r)=> sum + r.ganji, 0);
    const offers = filtered.reduce((sum,r)=> sum + r.offers, 0);
    const warrantyCount = filtered.filter(r=> r.warranty).length;
    return { revenue, ganji, offers, count: filtered.length, warrantyCount };
  }, [filtered]);

  // pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIdx = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(startIdx, startIdx + itemsPerPage);

  // Export to Excel
  const exportExcel = () => {
    const rows = filtered.map(r => ({
      Date: new Date(r.date).toLocaleDateString('en-GB'),
      Type: r.type,
      Label: r.label,
      Customer: r.customer,
      Revenue: r.revenue,
      Ganji: r.ganji,
      Offers: r.offers,
      Warranty: r.warranty ? 'Yes' : 'No',
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, 'Ganji');
    const summary = [
      { Metric: 'Total Revenue', Value: totals.revenue },
      { Metric: 'Total Ganji', Value: totals.ganji },
      { Metric: 'Total Offers', Value: totals.offers },
      { Metric: 'Warranty Sales', Value: totals.warrantyCount },
      { Metric: 'Records', Value: totals.count },
    ];
    const ws2 = XLSX.utils.json_to_sheet(summary);
    XLSX.utils.book_append_sheet(wb, ws2, 'Summary');
    XLSX.writeFile(wb, `ganji-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.text('Ganji Report', 105, 15, { align: 'center' });
    doc.setFontSize(10); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 105, 22, { align: 'center' });
    let y = 30;
    doc.setFontSize(9); doc.text(`Total Revenue: ${Math.round(totals.revenue).toLocaleString()}`, 15, y); y+=5;
    doc.text(`Total Ganji: ${Math.round(totals.ganji).toLocaleString()}`, 15, y); y+=5;
    doc.text(`Offers: ${Math.round(totals.offers).toLocaleString()}`, 15, y); y+=5;
    doc.text(`Warranty Sales: ${totals.warrantyCount}`, 15, y); y+=8;
    // headers
    doc.setFontSize(8);
    const headers = ['Date','Type','Label','Customer','Revenue','Ganji'];
    let x = 15; headers.forEach(h=>{ doc.text(h, x, y); x+=30; });
    y+=4; doc.line(15,y,195,y); y+=4;
    pageItems.forEach(r=>{
      if (y>270){ doc.addPage(); y=20; }
      const row = [new Date(r.date).toLocaleDateString('en-GB'), r.type, r.label.substring(0,12), r.customer.substring(0,12), Math.round(r.revenue).toString(), Math.round(r.ganji).toString()];
  x=15; row.forEach((cell)=>{ doc.text(cell, x, y); x+=30; });
      y+=6;
    });
    doc.save(`ganji-report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center"><TrendingUp className="h-6 w-6 mr-2"/>Ganji Overview</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Combined profit from sales & services</p>
        </div>
        <button onClick={loadData} className="px-3 py-2 bg-[#1973AE] text-white rounded-lg flex items-center text-sm"><RefreshCw className={`h-4 w-4 mr-2 ${loading?'animate-spin':''}`}/>Refresh</button>
      </div>

      {/* Aggregated Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Revenue</div>
          <div className="text-lg font-semibold">TSh {Math.round(totals.revenue).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Ganji (Profit)</div>
          <div className="text-lg font-semibold text-green-600">{Math.round(totals.ganji).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Offers Deducted</div>
          <div className="text-lg font-semibold text-red-600">{Math.round(totals.offers).toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
          <div className="text-xs text-gray-500">Warranty Sales</div>
          <div className="text-lg font-semibold">{totals.warrantyCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow space-y-2">
        <div className="flex flex-wrap gap-2 items-center">
          <select value={filterType} onChange={(e)=>setFilterType(e.target.value as any)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white">
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="range">Range</option>
          </select>
          {filterType==='daily' && <input type="date" value={dateFilter} onChange={(e)=>setDateFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>}
          {filterType==='monthly' && <>
            <select value={monthFilter} onChange={(e)=>setMonthFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white">
              <option value="">Month</option>
              {Array.from({length:12},(_,i)=>String(i+1).padStart(2,'0')).map(m=> <option key={m} value={m}>{m}</option>)}
            </select>
            <input type="number" value={yearFilter} onChange={(e)=>setYearFilter(e.target.value)} className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
          </>}
          {filterType==='yearly' && <input type="number" value={yearFilter} onChange={(e)=>setYearFilter(e.target.value)} className="w-24 border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>}
          {filterType==='range' && <>
            <input type="date" value={startDateFilter} onChange={(e)=>setStartDateFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
            <input type="date" value={endDateFilter} onChange={(e)=>setEndDateFilter(e.target.value)} className="border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
          </>}
          <input placeholder="Search label or customer" value={search} onChange={(e)=>setSearch(e.target.value)} className="flex-1 min-w-[180px] border rounded px-2 py-1 text-sm dark:bg-gray-700 dark:text-white"/>
          <div className="flex gap-2 ml-auto">
            <button onClick={exportExcel} className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm flex items-center"><FileDown className="h-4 w-4 mr-1"/>Excel</button>
            <button onClick={exportPDF} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm flex items-center"><FileDown className="h-4 w-4 mr-1"/>PDF</button>
          </div>
        </div>
      </div>

      {/* Combined Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow">
        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">Loading...</div>
        ) : pageItems.length > 0 ? (
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Label</th>
                <th className="py-2 text-left hidden md:table-cell">Customer</th>
                <th className="py-2 text-right">Revenue</th>
                <th className="py-2 text-right">Ganji</th>
                <th className="py-2 text-center">Warranty</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map(r => {
                return (
                  <tr key={`${r.type}-${r.id}`} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-2">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="py-2 capitalize">{r.type}</td>
                    <td className="py-2 font-medium">{r.label}</td>
                    <td className="py-2 hidden md:table-cell">{r.customer}</td>
                    <td className="py-2 text-right">TSh {Math.round(r.revenue).toLocaleString()}</td>
                    <td className={`py-2 text-right ${r.ganji>=0?'text-green-600':'text-red-600'}`}>{Math.round(r.ganji).toLocaleString()}</td>
                    <td className="py-2 text-center">{r.warranty ? <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">Yes</span> : <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full">No</span>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-600 dark:text-gray-400">No records match filters.</div>
        )}

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
    </div>
  );
};

export default ShopGanji;
