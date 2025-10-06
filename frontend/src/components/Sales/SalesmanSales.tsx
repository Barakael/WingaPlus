import React, { useEffect, useState } from 'react';
import { TrendingUp, DollarSign, ShoppingCart, Target, Calendar, Filter, Download, FileText, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { listSales } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface SalesmanSalesProps {
  openSaleForm?: (prefill?: any) => void;
}

const SalesmanSales: React.FC<SalesmanSalesProps> = ({ openSaleForm }) => {
  const { user } = useAuth();

  const [mySales, setMySales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Target selection state
  const [selectedTargetLevel, setSelectedTargetLevel] = useState<string>('');

  // Filter states
  const [dateFilter, setDateFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [filteredSales, setFilteredSales] = useState<any[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Define target levels (same as in TargetManagement)
  const targetLevels = [
    { id: 'beginner', name: 'Beginner Level', target: 200000 },
    { id: 'junior', name: 'Junior Level', target: 400000 },
    { id: 'amateur', name: 'Amateur Level', target: 600000 },
    { id: 'professional', name: 'Professional Level', target: 800000 },
    { id: 'master', name: 'Master Level', target: 1200000 },
    { id: 'pro', name: 'Pro Level', target: 2000000 }
  ];

  // Load saved target level on component mount
  useEffect(() => {
    const savedTarget = localStorage.getItem(`salesman_target_${user?.id}`);
    if (savedTarget) {
      setSelectedTargetLevel(savedTarget);
    } else {
      // Default to amateur level
      setSelectedTargetLevel('amateur');
    }
  }, [user]);

  // Save target level when changed
  const handleTargetChange = (targetId: string) => {
    setSelectedTargetLevel(targetId);
    if (user?.id) {
      localStorage.setItem(`salesman_target_${user.id}`, targetId);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Load sales data function
  const loadSalesData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await listSales({ salesman_id: String(user.id) });
      setMySales(data);
      // Don't limit here, let filtering handle pagination
      setFilteredSales(data);
      setCurrentPage(1); // Reset to first page when loading new data
    } catch (e: any) {
      setError(e.message || 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSalesData();
  }, [user]);

  // Filter sales based on date and product filters
  useEffect(() => {
    let filtered = mySales;

    if (dateFilter) {
      filtered = filtered.filter(sale => {
        const saleDate = new Date(sale.sale_date).toISOString().split('T')[0];
        return saleDate === dateFilter;
      });
    }

    if (productFilter) {
      filtered = filtered.filter(sale =>
        sale.product_name?.toLowerCase().includes(productFilter.toLowerCase()) ||
        sale.product_id?.toString().toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    setFilteredSales(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [mySales, dateFilter, productFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedSales = filteredSales.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const goToPrevious = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNext = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  // Calculate stats
  const totalSales = mySales.reduce((sum, sale) => sum + Number(sale.total_amount), 0);
  const totalItems = mySales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
  const totalGanji = mySales.reduce((sum, sale) => {
    const ganji = (Number(sale.unit_price) - Number(sale.cost_price)) * Number(sale.quantity);
    return sum + ganji;
  }, 0);
  const averageSale = mySales.length > 0 ? totalSales / mySales.length : 0;

  // Monthly target based on selected level
  const selectedTarget = targetLevels.find(level => level.id === selectedTargetLevel);
  const monthlyTarget = selectedTarget ? selectedTarget.target : 600000; // Default to amateur level
  const monthlyProgress = (totalGanji / monthlyTarget) * 100;

  // Export functions
  const exportToPDF = () => {
    try {
      console.log('Starting PDF export...');

      if (filteredSales.length === 0) {
        alert('No sales data to export. Please make some sales first.');
        return;
      }

      const doc = new jsPDF();
      console.log('jsPDF instance created');

      // Add title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Sales Records Report', 105, 20, { align: 'center' });

      // Add generation date
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });

      let yPosition = 45;

      // Add filters info if applied
      if (dateFilter || productFilter) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');

        if (dateFilter) {
          doc.text(`Date Filter: ${dateFilter}`, 20, yPosition);
          yPosition += 8;
        }

        if (productFilter) {
          doc.text(`Product Filter: ${productFilter}`, 20, yPosition);
          yPosition += 8;
        }

        yPosition += 5;
      }

      // Table headers
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      const headers = ['Date', 'Product', 'Customer', 'Qty', 'Cost Price', 'Sell Price', 'Profit'];
      const columnWidths = [25, 35, 30, 15, 25, 25, 25];
      let xPosition = 20;

      headers.forEach((header, index) => {
        doc.text(header, xPosition, yPosition);
        xPosition += columnWidths[index];
      });

      // Draw header line
      doc.line(20, yPosition + 2, 190, yPosition + 2);
      yPosition += 10;

      // Table data
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      filteredSales.forEach((sale) => {
        if (yPosition > 270) { // New page if needed
          doc.addPage();
          yPosition = 30;
        }

        const costPrice = Number(sale.cost_price) || 0;
        const sellingPrice = Number(sale.unit_price) || 0;
        const quantity = Number(sale.quantity) || 1;
        const profit = (sellingPrice - costPrice) * quantity;

        const rowData = [
          new Date(sale.sale_date).toLocaleDateString('en-GB'),
          (sale.product_name || sale.product_id || 'N/A').substring(0, 15),
          (sale.customer_name || 'N/A').substring(0, 12),
          quantity.toString(),
          formatCurrency(costPrice),
          formatCurrency(sellingPrice),
          formatCurrency(profit)
        ];

        xPosition = 20;
        rowData.forEach((cell, cellIndex) => {
          doc.text(cell, xPosition, yPosition);
          xPosition += columnWidths[cellIndex];
        });

        yPosition += 8;
      });

      // Add summary at the bottom
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 30;
      }

      yPosition += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary:', 20, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Total Sales: ${formatCurrency(totalSales)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Profit: ${formatCurrency(totalGanji)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Items: ${totalItems}`, 25, yPosition);

      // Save the PDF
      const filename = `sales-report-${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Saving PDF as:', filename);
      doc.save(filename);

      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('PDF export error:', error);
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportToExcel = () => {
    // Prepare data for Excel
    const excelData = filteredSales.map((sale) => {
      const costPrice = Number(sale.cost_price) || 0;
      const sellingPrice = Number(sale.unit_price) || 0;
      const quantity = Number(sale.quantity) || 1;
      const profit = (sellingPrice - costPrice) * quantity;

      return {
        'Date': new Date(sale.sale_date).toLocaleDateString('en-GB'),
        'Product': sale.product_name || sale.product_id || 'N/A',
        'Customer': sale.customer_name || 'N/A',
        'Quantity': quantity,
        'Cost Price': costPrice,
        'Selling Price': sellingPrice,
        'Profit': profit,
        'Total Amount': Number(sale.total_amount) || 0
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');

    // Add summary sheet
    const summaryData = [
      { 'Metric': 'Total Sales', 'Value': totalSales },
      { 'Metric': 'Total Profit', 'Value': totalGanji },
      { 'Metric': 'Total Items', 'Value': totalItems },
      { 'Metric': 'Average Sale', 'Value': averageSale },
      { 'Metric': 'Number of Sales', 'Value': filteredSales.length }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Save the file
    XLSX.writeFile(wb, `sales-report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Sales by product
  const salesByProduct = mySales.reduce((acc, sale) => {
    const key = sale.product_name || sale.product_id || 'Unknown';
    acc[key] = (acc[key] || 0) + Number(sale.total_amount);
    return acc;
  }, {} as Record<string, number>);

  const topProducts = (Object.entries(salesByProduct) as [string, number][]) 
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header - Compact on all screens */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            My Sales Dashboard
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Track your sales performance and achievements
          </p>
        </div>
        {openSaleForm && (
          <div className="flex justify-start sm:justify-end">
            <button
              onClick={() => openSaleForm()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 text-sm lg:text-base w-auto"
            >
              New Sale
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-4 w-4 md:h-6 md:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">TSh {formatCurrency(totalSales)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">TSh {formatCurrency(totalGanji)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Items Sold</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="h-5 w-5 md:h-6 md:w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Sale</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">TSh {formatCurrency(averageSale)}</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* Monthly Target Progress - Compact */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 lg:p-6">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Monthly Profit Target Progress
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Target Level:</label>
            <select
              value={selectedTargetLevel}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="px-2 py-1 lg:px-3 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {targetLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white">
              TSh {formatCurrency(totalGanji)} / TSh {formatCurrency(monthlyTarget)}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 lg:h-4">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 lg:h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs lg:text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {monthlyProgress.toFixed(1)}% Complete
            </span>
            <span className={`font-medium ${monthlyProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
              TSh {formatCurrency(Math.max(0, monthlyTarget - totalGanji))} remaining
            </span>
          </div>
        </div>
      </div>

      {/* Sales Records - Full Width, Compact on Mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 md:p-4 lg:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3 lg:mb-4">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Sales Records
          </h2>
          <div className="flex space-x-1 lg:space-x-2">
            <button
              onClick={loadSalesData}
              disabled={loading}
              className="flex items-center px-2 py-1 lg:px-3 text-xs lg:text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-2 py-1 lg:px-3 text-xs lg:text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center px-2 py-1 lg:px-3 text-xs lg:text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <FileSpreadsheet className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              Excel
            </button>
          </div>
        </div>

        {/* Filters - Compact */}
        <div className="mb-3 lg:mb-4 grid grid-cols-1 md:grid-cols-2 gap-2 lg:gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Product
            </label>
            <input
              type="text"
              value={productFilter}
              onChange={(e) => setProductFilter(e.target.value)}
              placeholder="Search product name..."
              className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4 lg:py-8 text-gray-500 dark:text-gray-400 text-xs lg:text-sm">Loading sales...</div>
          ) : error ? (
            <div className="text-center py-4 lg:py-8 text-red-600 dark:text-red-400 text-xs lg:text-sm">{error}</div>
          ) : filteredSales.length > 0 ? (
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[70px] lg:min-w-[80px]">Date</th>
                  <th className="text-left py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[100px] lg:min-w-[120px]">Product</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[100px]">Cost Price</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[100px]">Selling Price</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[60px] lg:min-w-[80px]">Profit</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => {
                  const costPrice = Number(sale.cost_price) || 0;
                  const sellingPrice = Number(sale.unit_price) || 0;
                  const quantity = Number(sale.quantity) || 1;
                  const profit = (sellingPrice - costPrice) * quantity;

                  return (
                    <tr key={sale.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-gray-900 dark:text-white text-xs">
                        {new Date(sale.sale_date).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-gray-900 dark:text-white">
                        <div className="font-medium text-xs lg:text-sm">{sale.product_name || sale.product_id}</div>
                        {sale.customer_name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px] lg:max-w-[100px]">
                            {sale.customer_name}
                          </div>
                        )}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-right text-gray-900 dark:text-white font-mono text-xs lg:text-sm">
                        {formatCurrency(costPrice)}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-right text-gray-900 dark:text-white font-mono text-xs lg:text-sm">
                        {formatCurrency(sellingPrice)}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-right font-semibold text-green-600 dark:text-green-400 font-mono text-xs lg:text-sm">
                        {formatCurrency(profit)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-4 lg:py-8">
              <ShoppingCart className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-2 lg:mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                No sales found
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 lg:mt-2">
                Try adjusting your filters or make some sales
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredSales.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              {/* <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredSales.length)} of {filteredSales.length} sales
              </div> */}
              <div className="flex items-center space-x-1">
                <button
                  onClick={goToPrevious}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => goToPage(pageNum)}
                      className={`px-3 py-1 text-sm rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={goToNext}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Insights and Top Products - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-6">
        {/* Performance Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 lg:p-6">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
            Performance Insights
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
            <div className="p-2 lg:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1 lg:mb-2 text-sm">
                Sales Trend
              </h3>
              <p className="text-xs lg:text-sm text-blue-700 dark:text-blue-300">
                {mySales.length > 5 ? 'You\'re on a good streak!' : 'Keep up the momentum!'}
              </p>
            </div>

            <div className="p-2 lg:p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1 lg:mb-2 text-sm">
                Customer Satisfaction
              </h3>
              <p className="text-xs lg:text-sm text-green-700 dark:text-green-300">
                {mySales.filter(s => s.warranty_months > 0).length} warranties provided
              </p>
            </div>

            <div className="p-2 lg:p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-1 lg:mb-2 text-sm">
                Product Knowledge
              </h3>
              <p className="text-xs lg:text-sm text-purple-700 dark:text-purple-300">
                Selling {new Set(mySales.map(s => s.product_id)).size} different products
              </p>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 lg:p-6">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
            Top Performing Products
          </h2>

          <div className="space-y-2 lg:space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map(([productName, revenue], index) => (
                <div key={productName} className="flex items-center justify-between p-2 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm mr-2 lg:mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {productName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Revenue generated
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-sm">
                      TSh {formatCurrency(revenue)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4 lg:py-8">
                <TrendingUp className="h-8 w-8 lg:h-12 lg:w-12 text-gray-400 mx-auto mb-2 lg:mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-xs lg:text-sm">
                  No sales data available
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesmanSales;
