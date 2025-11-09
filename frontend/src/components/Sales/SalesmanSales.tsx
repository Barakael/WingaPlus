import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, ShoppingCart, Target, Calendar, FileText, FileSpreadsheet, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react';
import { listSales, deleteSale, listTargets, Target as TargetType } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';
import { Sale } from '../../types';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import ViewSaleModal from './ViewSaleModal';
import EditSaleModal from './EditSaleModal';
import { showSuccessToast, showErrorToast, showWarningToast } from '../../lib/toast';

interface SalesmanSalesProps {
  openSaleForm?: (prefill?: Sale, onComplete?: () => void) => void;
}

const SalesmanSales: React.FC<SalesmanSalesProps> = ({ openSaleForm }) => {
  const { user } = useAuth();

  const [mySales, setMySales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Target selection state
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  // Filter states - Enhanced
  const [filterType, setFilterType] = useState<'daily' | 'monthly' | 'yearly' | 'range'>('daily');
  const [dateFilter, setDateFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(new Date().getFullYear().toString());
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');
  const [productFilter, setProductFilter] = useState('');
  const [filteredSales, setFilteredSales] = useState<Sale[]>([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);

  // Load targets
  const loadTargets = useCallback(async () => {
    if (!user) return;
    try {
      const data = await listTargets({ salesman_id: String(user.id) });
      setTargets(data);
      // Set default target if none selected
      if (!selectedTargetId && data.length > 0) {
        const savedTargetId = localStorage.getItem(`salesman_selected_target_${user.id}`);
        if (savedTargetId && data.find(t => String(t.id) === savedTargetId)) {
          setSelectedTargetId(savedTargetId);
        } else {
          // Default to first active monthly target
          const defaultTarget = data.find(t => t.type === 'monthly' && t.status === 'active');
          if (defaultTarget) {
            setSelectedTargetId(String(defaultTarget.id));
          }
        }
      }
    } catch (e) {
      console.error('Failed to load targets:', e);
    }
  }, [user, selectedTargetId]);

  // Load saved target level on component mount
  useEffect(() => {
    const savedTargetId = user?.id ? localStorage.getItem(`salesman_selected_target_${user.id}`) : null;
    if (savedTargetId) {
      setSelectedTargetId(savedTargetId);
    }
  }, [user]);

  // Load targets when component mounts
  useEffect(() => {
    loadTargets();
  }, [loadTargets]);

  // Save target selection when changed
  const handleTargetChange = (targetId: string) => {
    setSelectedTargetId(targetId);
    if (user?.id) {
      localStorage.setItem(`salesman_selected_target_${user.id}`, targetId);
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Load sales data function
  const loadSalesData = useCallback(async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await listSales({ salesman_id: String(user.id) });
      setMySales(data);
      // Don't limit here, let filtering handle pagination
      setFilteredSales(data);
      setCurrentPage(1); // Reset to first page when loading new data
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);

  // Filter sales based on enhanced filters
  useEffect(() => {
    let filtered = mySales;

    // Apply date filters based on filter type
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

    // Apply product filter
    if (productFilter) {
      filtered = filtered.filter(sale =>
        sale.product_name?.toLowerCase().includes(productFilter.toLowerCase()) ||
        sale.product_id?.toString().toLowerCase().includes(productFilter.toLowerCase())
      );
    }

    setFilteredSales(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [mySales, filterType, dateFilter, monthFilter, yearFilter, startDateFilter, endDateFilter, productFilter]);

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
  const totalSales = mySales.reduce((sum, sale) => {
    const saleAmount = Number(sale.total_amount);
    const offers = Number(sale.offers) || 0;
    return sum + (saleAmount - offers); // Subtract offers from total sales
  }, 0);
  const totalItems = mySales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
  const totalGanji = mySales.reduce((sum, sale) => {
    const baseProfit = (Number(sale.unit_price) - Number(sale.cost_price)) * Number(sale.quantity);
    const offers = Number(sale.offers) || 0;
    const ganji = baseProfit - offers; // Already subtracting offers from profit
    return sum + ganji;
  }, 0);
  const averageSale = mySales.length > 0 ? totalSales / mySales.length : 0;

  // Monthly target based on selected target
  const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);
  const currentValue = selectedTarget ? 
    (selectedTarget.metric === 'profit' ? totalGanji : totalItems) : 
    300000; // Default fallback
  const targetValue = selectedTarget ? selectedTarget.target_value : 600000; // Default fallback
  const monthlyProgress = (currentValue / targetValue) * 100;

  // Export functions - Enhanced with filter information
  const exportToPDF = () => {
    try {
      console.log('Starting PDF export...');

      if (filteredSales.length === 0) {
        alert('No sales data to export. Please adjust your filters or make some sales first.');
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
      if (dateFilter || monthFilter || yearFilter || startDateFilter || endDateFilter || productFilter) {
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');

        if (filterType === 'daily' && dateFilter) {
          doc.text(`Date Filter: ${dateFilter}`, 20, yPosition);
          yPosition += 8;
        } else if (filterType === 'monthly' && monthFilter && yearFilter) {
          const monthName = new Date(parseInt(yearFilter), parseInt(monthFilter) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          doc.text(`Monthly Filter: ${monthName}`, 20, yPosition);
          yPosition += 8;
        } else if (filterType === 'yearly' && yearFilter) {
          doc.text(`Yearly Filter: ${yearFilter}`, 20, yPosition);
          yPosition += 8;
        } else if (filterType === 'range' && startDateFilter && endDateFilter) {
          doc.text(`Date Range: ${startDateFilter} to ${endDateFilter}`, 20, yPosition);
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
      const headers = ['Date', 'Product', 'Customer', 'Qty', 'Zoezi', 'Sell Price', 'Ganji'];
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
        const offers = Number(sale.offers) || 0;
        const profit = (sellingPrice - costPrice) * quantity - offers;

        const rowData = [
          new Date(sale.sale_date || '').toLocaleDateString('en-GB'),
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

      // Calculate filtered stats
      const filteredTotalSales = filteredSales.reduce((sum, sale) => {
        const saleAmount = Number(sale.total_amount);
        const offers = Number(sale.offers) || 0;
        return sum + (saleAmount - offers); // Subtract offers from total sales
      }, 0);
      const filteredTotalItems = filteredSales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
      const filteredTotalGanji = filteredSales.reduce((sum, sale) => {
        const baseProfit = (Number(sale.unit_price) - Number(sale.cost_price)) * Number(sale.quantity);
        const offers = Number(sale.offers) || 0;
        const ganji = baseProfit - offers; // Already subtracting offers from profit
        return sum + ganji;
      }, 0);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Total Sales: ${formatCurrency(filteredTotalSales)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Profit: ${formatCurrency(filteredTotalGanji)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Items: ${filteredTotalItems}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Number of Records: ${filteredSales.length}`, 25, yPosition);

      // Save the PDF
      const filterSuffix = filterType !== 'daily' || dateFilter || productFilter ? `-${filterType}` : '';
      const filename = `sales-report${filterSuffix}-${new Date().toISOString().split('T')[0]}.pdf`;
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
      const offers = Number(sale.offers) || 0;
      const profit = (sellingPrice - costPrice) * quantity - offers;

      return {
        'Date': new Date(sale.sale_date || '').toLocaleDateString('en-GB'),
        'Product': sale.product_name || sale.product_id || 'N/A',
        'Customer': sale.customer_name || 'N/A',
        'Quantity': quantity,
        'Cost Price': costPrice,
        'Selling Price': sellingPrice,
        'Offers/Discount': offers,
        'Profit': profit,
        'Total Amount': Number(sale.total_amount) || 0,
        'Warranty Months': sale.warranty_months || 0,
        'Has Warranty': sale.has_warranty ? 'Yes' : 'No'
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales Data');

    // Add summary sheet with filtered data
    const filteredTotalSales = filteredSales.reduce((sum, sale) => {
      const saleAmount = Number(sale.total_amount);
      const offers = Number(sale.offers) || 0;
      return sum + (saleAmount - offers); // Subtract offers from total sales
    }, 0);
    const filteredTotalItems = filteredSales.reduce((sum, sale) => sum + Number(sale.quantity), 0);
    const filteredTotalGanji = filteredSales.reduce((sum, sale) => {
      const baseProfit = (Number(sale.unit_price) - Number(sale.cost_price)) * Number(sale.quantity);
      const offers = Number(sale.offers) || 0;
      const ganji = baseProfit - offers; // Already subtracting offers from profit
      return sum + ganji;
    }, 0);

    const summaryData = [
      { 'Metric': 'Filter Type', 'Value': filterType },
      { 'Metric': 'Date Filter', 'Value': filterType === 'daily' ? dateFilter : filterType === 'monthly' ? `${monthFilter}/${yearFilter}` : filterType === 'yearly' ? yearFilter : `${startDateFilter} - ${endDateFilter}` },
      { 'Metric': 'Product Filter', 'Value': productFilter || 'None' },
      { 'Metric': 'Total Sales', 'Value': filteredTotalSales },
      { 'Metric': 'Total Profit', 'Value': filteredTotalGanji },
      { 'Metric': 'Total Items', 'Value': filteredTotalItems },
      { 'Metric': 'Average Sale', 'Value': filteredSales.length > 0 ? filteredTotalSales / filteredSales.length : 0 },
      { 'Metric': 'Number of Sales', 'Value': filteredSales.length },
      { 'Metric': 'Export Date', 'Value': new Date().toLocaleDateString() }
    ];
    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    // Save the file with filter info in filename
    const filterSuffix = filterType !== 'daily' || dateFilter || productFilter ? `-${filterType}` : '';
    XLSX.writeFile(wb, `sales-report${filterSuffix}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Action handlers
  const handleViewSale = (sale: Sale) => {
    setSelectedSale(sale);
    setViewModalOpen(true);
  };

  const handleEditSale = (sale: Sale) => {
    setSelectedSale(sale);
    setEditModalOpen(true);
  };

  const handleDeleteSale = async (sale: Sale) => {
    // TODO: Implement delete sale functionality
    console.log('Delete sale:', sale);
    
    if (window.confirm(`Are you sure you want to delete this sale?\n\nProduct: ${sale.product_name || sale.product_id}\nAmount: TSh ${formatCurrency(sale.total_amount)}\nDate: ${new Date(sale.sale_date || '').toLocaleDateString()}\n\nThis action cannot be undone.`)) {
      try {
        setLoading(true);
        await deleteSale(sale.id);
        
        // Remove the sale from local state
        setMySales(prev => prev.filter(s => s.id !== sale.id));
        setFilteredSales(prev => prev.filter(s => s.id !== sale.id));
        
        showSuccessToast('✅ Sale deleted successfully!');
      } catch (error) {
        console.error('Error deleting sale:', error);
        const technicalError = error instanceof Error ? error.message : '';
        let userMessage = '❌ Could not delete sale. Please try again.';
        
        if (technicalError.includes('network') || technicalError.includes('fetch')) {
          userMessage = '📡 Connection problem. Check your internet and try again.';
        } else if (technicalError.includes('not found') || technicalError.includes('404')) {
          userMessage = '⚠️ Sale already deleted or not found.';
        }
        
        showErrorToast(userMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  // Modal handlers
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedSale(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedSale(null);
  };

  const handleSaleUpdated = (updatedSale: Sale) => {
    // Update the sale in local state
    setMySales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
    setFilteredSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
  };

  // Sales by product - Track by profit (ganji) instead of revenue
  const salesByProduct = mySales.reduce((acc, sale) => {
    // Normalize product name to lowercase to avoid duplicates
    const productName = (sale.product_name || sale.product_id || 'Unknown').toLowerCase();
    
    // Calculate profit for this sale
    const costPrice = Number(sale.cost_price) || 0;
    const sellingPrice = Number(sale.unit_price) || 0;
    const quantity = Number(sale.quantity) || 1;
    const offers = Number(sale.offers) || 0;
    const profit = (sellingPrice - costPrice) * quantity - offers;
    
    acc[productName] = (acc[productName] || 0) + profit;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = (Object.entries(salesByProduct) as [string, number][]) 
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2);

  return (
    <div className="space-y-4 lg:space-y-6">

      {/* Monthly Target Progress - Compact
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 md:p-4 lg:p-6">
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
            Monthly Profit Target
          </h2>
          <div className="flex items-center gap-2">
            <label className="text-xs lg:text-sm text-gray-600 dark:text-gray-400">Target Level:</label>
            <select
              value={selectedTargetId}
              onChange={(e) => handleTargetChange(e.target.value)}
              className="px-2 py-1 lg:px-3 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {targets.length > 0 ? (
                targets.map((target) => (
                  <option key={target.id} value={String(target.id)}>
                    {target.name} - {target.metric === 'profit' ? 'TSh' : ''} {formatCurrency(target.target_value)}{target.metric === 'items_sold' ? ' items' : ''}
                  </option>
                ))
              ) : (
                <option value="">No targets available</option>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-sm lg:text-base text-gray-900 dark:text-white">
              {selectedTarget?.metric === 'profit' ? 'TSh ' : ''}{formatCurrency(currentValue)} / {selectedTarget?.metric === 'profit' ? 'TSh ' : ''}{formatCurrency(targetValue)}{selectedTarget?.metric === 'items_sold' ? ' items' : ''}
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 lg:h-4">
            <div
              className="bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] h-3 lg:h-4 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(monthlyProgress, 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-between text-xs lg:text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              {monthlyProgress.toFixed(1)}% Complete
            </span>
            <span className={`font-medium ${monthlyProgress >= 100 ? 'text-green-600' : 'text-orange-600'}`}>
              {selectedTarget?.metric === 'profit' ? 'TSh ' : ''}{formatCurrency(Math.max(0, targetValue - currentValue))}{selectedTarget?.metric === 'items_sold' ? ' items' : ''} remaining
            </span>
          </div>
        </div>
      </div> */}

      {/* Sales Records - Full Width, Compact on Mobile */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-2 md:p-4 lg:p-6">
        <div className="flex flex-col space-y-3 mb-3 lg:mb-4">
          {/* Title and New Sale Button Row */}
          <div className="flex items-center justify-between">
            <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
              <Calendar className="h-4 w-4 lg:h-5 lg:w-5 mr-2" />
              Sales Records
            </h2>
            {openSaleForm && (
              <button
                onClick={() => openSaleForm && openSaleForm(undefined, loadSalesData)}
                className="bg-[#04BCF2] text-white px-3 py-2 lg:px-4 lg:py-2 rounded-lg font-medium hover:bg-[#03a8d8] transition-all duration-200 text-sm lg:text-base"
              >
                New Sale
              </button>
            )}
          </div>
          
          {/* Action Buttons Row */}
          <div className="flex space-x-1 lg:space-x-2 ">
            <button
              onClick={loadSalesData}
              disabled={loading}
              className="flex items-center px-2 py-1 lg:px-3 text-xs lg:text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] disabled:bg-[#1973AE]/50 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-3 w-3 lg:h-4 lg:w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportToPDF}
              className="flex items-center px-2 py-1 md:py-2 md:px-3 lg:px-3 text-xs lg:text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors"
            >
              <FileText className="h-3 w-3 lg:h-5 lg:w-5 mr-1" />
              PDF
            </button>
            <button
              onClick={exportToExcel}
              className="flex items-center px-2 py-1 md:py-2 md:px-3 lg:px-3 text-xs lg:text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors"
            >
              <FileSpreadsheet className="h-3 w-3 lg:h-4 lg:w-4 mr-1" />
              Excel
            </button>
          </div>
        </div>

        {/* Enhanced Filters */}
        <div className="mb-3 lg:mb-4 space-y-3">
          {/* Filter Type Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs md:text-md font-medium text-gray-700 dark:text-gray-300">Filter by:</label>
            <div className="flex flex-wrap gap-1 ">
              {[
                { value: 'daily', label: 'Daily' },
                { value: 'monthly', label: 'Monthly' },
                { value: 'yearly', label: 'Yearly' },
                
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilterType(option.value as any)}
                  className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                    filterType === option.value
                      ? 'bg-[#1973AE] text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Filter Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filterType === 'daily' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Date
                  </label>
                  <input
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    placeholder="Search product..."
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {filterType === 'monthly' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Month
                  </label>
                  <select
                    value={monthFilter}
                    onChange={(e) => setMonthFilter(e.target.value)}
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">All Months</option>
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      const monthName = new Date(2000, i, 1).toLocaleDateString('en-US', { month: 'long' });
                      return (
                        <option key={month} value={month}>
                          {monthName}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Year
                  </label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Array.from({ length: 5 }, (_, i) => {
                      const year = (new Date().getFullYear() - i).toString();
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Product
                  </label>
                  <input
                    type="text"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    placeholder="Search product..."
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}

            {filterType === 'yearly' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Year
                  </label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    {Array.from({ length: 10 }, (_, i) => {
                      const year = (new Date().getFullYear() - i).toString();
                      return (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Filter by Product
                  </label>
                  <input
                    type="text"
                    value={productFilter}
                    onChange={(e) => setProductFilter(e.target.value)}
                    placeholder="Search product..."
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
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
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                    placeholder="Search product..."
                    className="w-full px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </>
            )}
          </div>

          {/* Clear Filters Button */}
          {(dateFilter || monthFilter || yearFilter || startDateFilter || endDateFilter || productFilter) && (
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setDateFilter('');
                  setMonthFilter('');
                  setYearFilter(new Date().getFullYear().toString());
                  setStartDateFilter('');
                  setEndDateFilter('');
                  setProductFilter('');
                }}
                className="px-3 py-1 text-xs bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-4 lg:py-8 text-gray-500 dark:text-gray-400 text-xs lg:text-sm">Loading sales...</div>
          ) : error ? (
            <div className="text-center py-4 lg:py-6 text-red-600 dark:text-red-400 text-xs lg:text-sm">{error}</div>
          ) : filteredSales.length > 0 ? (
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[70px] lg:min-w-[80px]">Date</th>
                  <th className="text-left py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[100px] lg:min-w-[120px]">Product</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[60px] lg:min-w-[80px]">Ganji</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[100px] hidden md:table-cell">Zoezi</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[100px] hidden md:table-cell">Bei</th>                  
                  <th className="text-center py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSales.map((sale) => {
                  const costPrice = Number(sale.cost_price) || 0;
                  const sellingPrice = Number(sale.unit_price) || 0;
                  const quantity = Number(sale.quantity) || 1;
                  const offers = Number(sale.offers) || 0;
                  const profit = (sellingPrice - costPrice) * quantity - offers;

                  return (
                    <tr 
                      key={sale.id} 
                      className="border-b border-gray-100 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors"
                      onClick={() => handleViewSale(sale)}
                    >
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-gray-900 dark:text-white text-xs">
                        {new Date(sale.sale_date || '').toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-gray-900 dark:text-white">
                        <div className="font-medium text-xs lg:text-sm">{sale.product_name || sale.product_id}</div>
                        {sale.customer_name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px] lg:max-w-[100px]">
                            {sale.customer_name}
                          </div>
                        )}
                      </td>
                        <td className="py-2 px-1 lg:py-3 lg:px-2 text-right font-semibold text-green-600 dark:text-green-400 font-mono text-xs lg:text-sm">
                        {formatCurrency(profit)}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-right text-gray-900 dark:text-white font-mono text-xs lg:text-sm hidden md:table-cell">
                        {formatCurrency(costPrice)}
                      </td>
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-right text-gray-900 dark:text-white font-mono text-xs lg:text-sm hidden md:table-cell">
                        {formatCurrency(sellingPrice)}
                      </td>
                    
                      <td className="py-2 px-1 lg:py-3 lg:px-2 text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewSale(sale);
                            }}
                            className="p-1 text-[#1973AE] hover:text-[#0d5a8a] dark:text-[#5da3d5] dark:hover:text-[#7db3d9] transition-colors hidden md:inline"
                            title="View Sale Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditSale(sale);
                            }}
                            className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                            title="Edit Sale"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSale(sale);
                            }}
                            className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                            title="Delete Sale"
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
                          ? 'bg-red-500 text-white'
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
      
     

        {/* Top Products */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-4 lg:p-6">
          <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
            Top Performing Products
          </h2>

          <div className="space-y-2 lg:space-y-4">
            {topProducts.length > 0 ? (
              topProducts.map(([productName, profit], index) => (
                <div key={productName} className="flex items-center justify-between p-2 lg:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] rounded-full flex items-center justify-center text-white font-bold text-xs lg:text-sm mr-2 lg:mr-3">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white text-sm capitalize">
                        {productName}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Profit generated
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600 text-sm">
                      TSh {formatCurrency(profit)}
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

      {/* Modals */}
      <ViewSaleModal
        sale={selectedSale}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />

      <EditSaleModal
        sale={selectedSale}
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onSaleUpdated={handleSaleUpdated}
      />
    </div>
  );
};

export default SalesmanSales;
