import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, TrendingUp, DollarSign, Calendar, RefreshCw, Eye, Edit, Trash2, Filter, Download, Search, MoreVertical, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import { showSuccessToast, showErrorToast } from '../../lib/toast';
import { Sale } from '../../types';
import ViewSaleModal from '../Sales/ViewSaleModal';
import EditSaleModal from '../Sales/EditSaleModal';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

const ShopSales: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [salesmen, setSalesmen] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [filterType, setFilterType] = useState<'daily' | 'monthly' | 'yearly' | 'range'>('daily');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [salesmanFilter, setSalesmanFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  // Fetch sales
  const fetchSales = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/api/sales?shop_id=${user.shop_id || user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const salesData = data?.data?.data || data?.data || [];
        setSales(salesData);
        setFilteredSales(salesData);
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
      showErrorToast('Failed to load sales');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch salesmen
  const fetchSalesmen = useCallback(async () => {
    if (!user) return;
    try {
      const response = await fetch(`${BASE_URL}/api/users?shop_id=${user.shop_id || user.id}&role=salesman`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        const salesmenData = data?.data?.data || data?.data || [];
        setSalesmen(salesmenData);
      }
    } catch (err) {
      console.error('Error fetching salesmen:', err);
    }
  }, [user]);

  useEffect(() => {
    fetchSales();
    fetchSalesmen();
  }, [fetchSales, fetchSalesmen]);

  // Apply filters
  useEffect(() => {
    let filtered = sales;

    // Date filters
    if (filterType === 'daily' && dateFilter) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.sale_date || '').toISOString().split('T')[0];
        return saleDate === dateFilter;
      });
    } else if (filterType === 'monthly' && monthFilter && yearFilter) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.sale_date || '');
        const saleMonth = (saleDate.getMonth() + 1).toString().padStart(2, '0');
        const saleYear = saleDate.getFullYear().toString();
        return saleMonth === monthFilter && saleYear === yearFilter;
      });
    } else if (filterType === 'yearly' && yearFilter) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.sale_date || '');
        const saleYear = saleDate.getFullYear().toString();
        return saleYear === yearFilter;
      });
    } else if (filterType === 'range' && startDateFilter && endDateFilter) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.sale_date || '').toISOString().split('T')[0];
        return saleDate >= startDateFilter && saleDate <= endDateFilter;
      });
    }

    // Salesman filter
    if (salesmanFilter) {
      filtered = filtered.filter(sale => String(sale.salesman_id) === salesmanFilter);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer_phone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSales(filtered);
    setCurrentPage(1);
  }, [sales, filterType, dateFilter, monthFilter, yearFilter, startDateFilter, endDateFilter, salesmanFilter, searchTerm]);

  // Calculate stats
  const totalRevenue = filteredSales.reduce((sum, sale) => {
    const saleAmount = Number(sale.total_amount) || 0;
    const offers = Number(sale.offers) || 0;
    return sum + (saleAmount - offers);
  }, 0);

  const totalProfit = filteredSales.reduce((sum, sale) => {
    const costPrice = Number(sale.cost_price) || 0;
    const sellingPrice = Number(sale.unit_price) || 0;
    const quantity = Number(sale.quantity) || 1;
    const offers = Number(sale.offers) || 0;
    const profit = (sellingPrice - costPrice) * quantity - offers;
    return sum + profit;
  }, 0);

  // Calculate weekly sales (last 7 days)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklySales = sales.filter(sale => {
    const saleDate = new Date(sale.sale_date || '');
    return saleDate >= oneWeekAgo;
  }).length;

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

  // Handle actions
  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setViewModalOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setSelectedSale(sale);
    setEditModalOpen(true);
  };

  const handleDeleteSale = async (sale: Sale) => {
    if (!window.confirm('Are you sure you want to delete this sale? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/sales/${sale.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete sale');
      }

      showSuccessToast('Sale deleted successfully!');
      fetchSales();
    } catch (err) {
      console.error('Error deleting sale:', err);
      showErrorToast('Failed to delete sale');
    }
  };

  // Export functions
  const exportToExcel = () => {
    const exportData = filteredSales.map(sale => ({
      Date: new Date(sale.sale_date || '').toLocaleDateString(),
      Product: sale.product_name || sale.product_id,
      Customer: sale.customer_name || 'N/A',
      Phone: sale.customer_phone || 'N/A',
      Quantity: sale.quantity,
      'Unit Price': sale.unit_price,
      'Total Amount': sale.total_amount,
      Offers: sale.offers || 0,
      'Net Amount': Number(sale.total_amount) - (Number(sale.offers) || 0),
      Profit: sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    XLSX.writeFile(wb, `sales_${new Date().toISOString().split('T')[0]}.xlsx`);
    showSuccessToast('Sales exported to Excel!');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Sales Report', 14, 22);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`Total Sales: ${filteredSales.length}`, 14, 36);
    doc.text(`Total Revenue: TSh ${formatCurrency(totalRevenue)}`, 14, 42);
    doc.text(`Total Profit: TSh ${formatCurrency(totalProfit)}`, 14, 48);

    let yPosition = 58;
    filteredSales.slice(0, 20).forEach((sale, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      const profit = sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0);
      doc.text(
        `${index + 1}. ${sale.product_name} - TSh ${formatCurrency(Number(sale.total_amount))} (Profit: ${formatCurrency(profit)})`,
        14,
        yPosition
      );
      yPosition += 7;
    });

    doc.save(`sales_report_${new Date().toISOString().split('T')[0]}.pdf`);
    showSuccessToast('Sales exported to PDF!');
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSalesmanName = (salesmanId?: string): string => {
    if (!salesmanId) return 'Unknown';
    const salesman = salesmen.find(s => String(s.id) === String(salesmanId));
    return salesman?.name || 'Unknown';
  };

  if (loading && sales.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 text-[#1973AE] animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading sales...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Sales Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track and manage all shop sales
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-base sm:text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
                TSh {formatCurrency(totalRevenue)}
              </p>
            </div>
            <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-base sm:text-2xl font-bold text-[#1973AE] dark:text-[#5da3d5] mt-1">
                TSh {formatCurrency(totalProfit)}
              </p>
            </div>
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-[#1973AE]" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{filteredSales.length}</p>
            </div>
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-[#1973AE]" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Weekly Sales</p>
              <p className="text-base sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">{weeklySales}</p>
            </div>
            <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        {/* Mobile Layout - Search + 3-dot menu */}
        <div className="lg:hidden">
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search sales..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <MoreVertical className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Mobile Filter Dropdown */}
          {filterMenuOpen && (
            <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h3>
                <button
                  onClick={() => setFilterMenuOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Filter Type Selection */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-700 dark:text-gray-300">Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setFilterType('daily')}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                      filterType === 'daily'
                        ? 'bg-[#1973AE] text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setFilterType('monthly')}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                      filterType === 'monthly'
                        ? 'bg-[#1973AE] text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setFilterType('yearly')}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                      filterType === 'yearly'
                        ? 'bg-[#1973AE] text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    Yearly
                  </button>
                  <button
                    onClick={() => setFilterType('range')}
                    className={`px-3 py-2 text-xs rounded-lg transition-colors ${
                      filterType === 'range'
                        ? 'bg-[#1973AE] text-white'
                        : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                    }`}
                  >
                    Range
                  </button>
                </div>
              </div>

              {/* Date Filter Inputs */}
              <div className="space-y-3">
                {filterType === 'daily' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {filterType === 'monthly' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Month
                      </label>
                      <select
                        value={monthFilter}
                        onChange={(e) => setMonthFilter(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      >
                        <option value="">Select month...</option>
                        {Array.from({ length: 12 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                            {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Year
                      </label>
                      <input
                        type="number"
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {filterType === 'yearly' && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                      className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                    />
                  </div>
                )}

                {filterType === 'range' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                        className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                      />
                    </div>
                  </>
                )}

                {/* Salesman Filter */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Salesman
                  </label>
                  <select
                    value={salesmanFilter}
                    onChange={(e) => setSalesmanFilter(e.target.value)}
                    className="w-full px-2 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-600 text-gray-900 dark:text-white"
                  >
                    <option value="">All Salesmen</option>
                    {salesmen.map((salesman) => (
                      <option key={salesman.id} value={salesman.id}>
                        {salesman.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout - All filters in full view */}
        <div className="hidden lg:block">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
          </div>

          <div className="space-y-4">
            {/* Filter Type Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setFilterType('daily')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filterType === 'daily'
                    ? 'bg-[#1973AE] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setFilterType('monthly')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filterType === 'monthly'
                    ? 'bg-[#1973AE] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setFilterType('yearly')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filterType === 'yearly'
                    ? 'bg-[#1973AE] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Yearly
              </button>
              <button
                onClick={() => setFilterType('range')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                  filterType === 'range'
                    ? 'bg-[#1973AE] text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                Range
              </button>
            </div>

            {/* Date Filter Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filterType === 'daily' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {filterType === 'monthly' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Month
                    </label>
                    <select
                      value={monthFilter}
                      onChange={(e) => setMonthFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select month...</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Year
                    </label>
                    <input
                      type="number"
                      value={yearFilter}
                      onChange={(e) => setYearFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              {filterType === 'yearly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Year
                  </label>
                  <input
                    type="number"
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {filterType === 'range' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDateFilter}
                      onChange={(e) => setStartDateFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDateFilter}
                      onChange={(e) => setEndDateFilter(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                </>
              )}

              {/* Salesman Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Salesman
                </label>
                <select
                  value={salesmanFilter}
                  onChange={(e) => setSalesmanFilter(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="">All Salesmen</option>
                  {salesmen.map((salesman) => (
                    <option key={salesman.id} value={salesman.id}>
                      {salesman.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Product, customer..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            Sales ({filteredSales.length})
          </h2>
          <button
            onClick={fetchSales}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Mobile View - Cards */}
        <div className="block sm:hidden space-y-3">
          {paginatedSales.map((sale) => {
            const profit = sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0);

            return (
              <div key={sale.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {sale.product_name || sale.product_id}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {sale.customer_name || 'N/A'} • {getSalesmanName(sale.salesman_id)}
                    </p>
                  </div>
                  <Calendar className="h-4 w-4 text-gray-400" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Qty:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">{sale.quantity}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="ml-1 font-medium text-green-600">TSh {formatCurrency(Number(sale.total_amount))}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Profit:</span>
                    <span className="ml-1 font-medium text-[#1973AE]">TSh {formatCurrency(profit)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Date:</span>
                    <span className="ml-1 font-medium text-gray-900 dark:text-white">
                      {new Date(sale.sale_date || '').toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleViewSale(sale)}
                    className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 rounded-lg text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </button>
                  <button
                    onClick={() => handleEditSale(sale)}
                    className="flex-1 bg-[#1973AE] text-white px-3 py-2 rounded-lg text-xs font-medium hover:bg-[#0d5a8a] transition-colors flex items-center justify-center"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteSale(sale)}
                    className="flex-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-200 px-3 py-2 rounded-lg text-xs font-medium hover:bg-red-200 dark:hover:bg-red-800 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salesman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Qty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedSales.map((sale) => {
                const profit = sale.ganji || ((Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity)) - (Number(sale.offers) || 0);

                return (
                  <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(sale.sale_date || '').toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {sale.product_name || sale.product_id}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sale.customer_name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getSalesmanName(sale.salesman_id)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {sale.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                      TSh {formatCurrency(Number(sale.total_amount))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#1973AE]">
                      TSh {formatCurrency(profit)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleViewSale(sale)}
                          className="text-gray-600 dark:text-gray-400 hover:text-[#1973AE] dark:hover:text-[#5da3d5]"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEditSale(sale)}
                          className="text-gray-600 dark:text-gray-400 hover:text-[#1973AE] dark:hover:text-[#5da3d5]"
                          title="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSale(sale)}
                          className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No sales found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredSales.length)} of {filteredSales.length} sales
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {viewModalOpen && selectedSale && (
        <ViewSaleModal
          sale={selectedSale}
          isOpen={viewModalOpen}
          onClose={() => {
            setViewModalOpen(false);
            setSelectedSale(null);
          }}
        />
      )}

      {editModalOpen && selectedSale && (
        <EditSaleModal
          sale={selectedSale}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedSale(null);
          }}
          onSaleUpdated={(updatedSale) => {
            fetchSales();
            setEditModalOpen(false);
            setSelectedSale(null);
          }}
        />
      )}

      {/* Floating Download Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Download Options Menu */}
        {downloadMenuOpen && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[160px] mb-2">
            <button
              onClick={() => {
                exportToExcel();
                setDownloadMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center text-sm text-gray-700 dark:text-gray-300"
            >
              <Download className="h-4 w-4 mr-2 text-green-600" />
              Download Excel
            </button>
            <button
              onClick={() => {
                exportToPDF();
                setDownloadMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center text-sm text-gray-700 dark:text-gray-300"
            >
              <Download className="h-4 w-4 mr-2 text-red-600" />
              Download PDF
            </button>
          </div>
        )}

        {/* Main Floating Button */}
        <button
          onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
          className="bg-[#1973AE] hover:bg-[#0d5a8a] text-white rounded-full p-4 shadow-lg transition-all duration-200 flex items-center justify-center"
          title="Download Reports"
        >
          <Download className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};

export default ShopSales;
