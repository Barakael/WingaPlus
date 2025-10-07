import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, DollarSign, Target, Calendar, FileText, FileSpreadsheet, RefreshCw, BarChart3 } from 'lucide-react';
import { listSales, listTargets, Target as TargetType } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';
import { Sale } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface PeriodData {
  period: string;
  ganji: number;
  sales: number;
  items: number;
  transactions: number;
}

interface PerformanceStats {
  totalGanji: number;
  totalSales: number;
  totalItems: number;
  totalTransactions: number;
  averageGanji: number;
  bestPeriod: string;
  currentPeriodProgress: number;
  periodType: 'weekly' | 'monthly';
  targetMetric: string;
}

const CommissionTracking: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Period selection
  const [periodType, setPeriodType] = useState<'weekly' | 'monthly'>('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Target selection
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');

  // Analytics data
  const [periodData, setPeriodData] = useState<PeriodData[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStats>({
    totalGanji: 0,
    totalSales: 0,
    totalItems: 0,
    totalTransactions: 0,
    averageGanji: 0,
    bestPeriod: '',
    currentPeriodProgress: 0,
    periodType: 'monthly',
    targetMetric: 'profit'
  });

  // Load targets data for current user
  const loadTargetsData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await listTargets({ salesman_id: String(user.id) });
      setTargets(data);
      // Set default target if none selected
      if (!selectedTargetId && data.length > 0) {
        const savedTargetId = localStorage.getItem(`commission_selected_target_${user.id}`);
        if (savedTargetId && data.find(t => String(t.id) === savedTargetId)) {
          setSelectedTargetId(savedTargetId);
        } else {
          // Default to first active target
          const defaultTarget = data.find(t => t.status === 'active');
          if (defaultTarget) {
            setSelectedTargetId(String(defaultTarget.id));
          }
        }
      }
    } catch (e) {
      console.error('Failed to load targets:', e);
    }
  }, [user, selectedTargetId]);

  // Load sales data for current user
  const loadSalesData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await listSales({ salesman_id: String(user.id) });
      setSales(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load sales');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Calculate period data
  const calculatePeriodData = useCallback(() => {
    if (!sales.length) return;

    const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);
    const targetValue = selectedTarget ? selectedTarget.target_value : 200000; // Default fallback
    const targetMetric = selectedTarget?.metric || 'profit';

    // For monthly chart, show all 12 months of the selected year
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const periods: Record<string, PeriodData> = {};

    // Initialize all months with zero values
    months.forEach(month => {
      periods[`${month} ${selectedYear}`] = {
        period: month,
        ganji: 0,
        sales: 0,
        items: 0,
        transactions: 0
      };
    });

    sales.forEach(sale => {
      const saleDate = new Date(sale.sale_date || '');
      if (saleDate.getFullYear() !== selectedYear) return; // Only include sales from selected year

      let periodKey: string;

      if (periodType === 'weekly') {
        // Get week number and year
        const startOfYear = new Date(saleDate.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((saleDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        periodKey = `Week ${weekNumber}, ${saleDate.getFullYear()}`;
      } else {
        // Monthly
        const monthName = saleDate.toLocaleDateString('en-US', { month: 'long' });
        periodKey = `${monthName} ${saleDate.getFullYear()}`;
      }

      if (!periods[periodKey]) {
        periods[periodKey] = {
          period: periodKey,
          ganji: 0,
          sales: 0,
          items: 0,
          transactions: 0
        };
      }

      const ganji = (Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity);
      periods[periodKey].ganji += ganji;
      periods[periodKey].sales += Number(sale.total_amount);
      periods[periodKey].items += Number(sale.quantity);
      periods[periodKey].transactions += 1;
    });

    // Convert to array and sort by month order
    let periodArray: PeriodData[];
    if (periodType === 'monthly') {
      // For monthly view, show all 12 months in order
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth(); // 0-based
      const currentYear = currentDate.getFullYear();
      
      periodArray = months.map((month, index) => {
        const monthData = periods[`${month} ${selectedYear}`];
        // Only show data for months that have passed or current month
        // For past years, show all months
        // For current year, only show up to current month
        if (selectedYear < currentYear) {
          return monthData;
        } else if (selectedYear === currentYear) {
          // For current year, only show months up to current month
          return index <= currentMonth ? monthData : { ...monthData, ganji: 0, sales: 0, items: 0, transactions: 0 };
        } else {
          // Future years - show all as zero
          return { ...monthData, ganji: 0, sales: 0, items: 0, transactions: 0 };
        }
      });
    } else {
      // For weekly view, sort by period
      periodArray = Object.values(periods).sort((a, b) => {
        return a.period.localeCompare(b.period);
      });
    }

    // Filter to show only the last 4 months for weekly view
    let filteredPeriodArray = periodArray;
    if (periodType === 'weekly') {
      filteredPeriodArray = periodArray.slice(-4); // Get last 4 weeks
    }

    setPeriodData(filteredPeriodArray);

    // Calculate performance stats
    const totalGanji = filteredPeriodArray.reduce((sum, p) => sum + p.ganji, 0);
    const totalSales = filteredPeriodArray.reduce((sum, p) => sum + p.sales, 0);
    const totalItems = filteredPeriodArray.reduce((sum, p) => sum + p.items, 0);
    const totalTransactions = filteredPeriodArray.reduce((sum, p) => sum + p.transactions, 0);

    const bestPeriod = filteredPeriodArray.reduce((best, current) =>
      current.ganji > best.ganji ? current : best, filteredPeriodArray[0] || { period: '' }
    );

    // Calculate current period progress based on target metric
    const currentDate = new Date();
    let currentPeriodValue = 0;
    let currentPeriodKey = '';

    if (periodType === 'monthly') {
      const currentMonth = currentDate.toLocaleDateString('en-US', { month: 'long' });
      currentPeriodKey = `${currentMonth} ${currentDate.getFullYear()}`;
    } else {
      // Weekly calculation
      const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const weekNumber = Math.ceil(((currentDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
      currentPeriodKey = `Week ${weekNumber}, ${currentDate.getFullYear()}`;
    }

    const currentPeriodData = periods[currentPeriodKey];
    if (currentPeriodData) {
      currentPeriodValue = targetMetric === 'profit' ? currentPeriodData.ganji : currentPeriodData.items;
    }

    const currentPeriodProgress = targetValue > 0 ?
      (currentPeriodValue / targetValue) * 100 : 0;

    setPerformanceStats({
      totalGanji,
      totalSales,
      totalItems,
      totalTransactions,
      averageGanji: totalTransactions > 0 ? totalGanji / totalTransactions : 0,
      bestPeriod: bestPeriod?.period || '',
      currentPeriodProgress,
      periodType,
      targetMetric
    });
  }, [sales, periodType, targets, selectedTargetId, selectedYear]);

  useEffect(() => {
    loadSalesData();
  }, [loadSalesData]);

  useEffect(() => {
    loadTargetsData();
  }, [loadTargetsData]);

  useEffect(() => {
    calculatePeriodData();
  }, [calculatePeriodData]);

  // Export functions
  const exportToPDF = () => {
    try {
      const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);
      const doc = new jsPDF();

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Commission Tracking Report', 105, 20, { align: 'center' });

      // User info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Salesman: ${user?.name || 'Unknown'}`, 20, 35);
      doc.text(`Period: ${periodType === 'monthly' ? 'Monthly' : 'Weekly'} View`, 20, 42);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 49);

      let yPosition = 65;

      // Summary
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Performance Summary', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Profit (Ganji): ${formatCurrency(performanceStats.totalGanji)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Sales Revenue: ${formatCurrency(performanceStats.totalSales)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Items Sold: ${performanceStats.totalItems}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Transactions: ${performanceStats.totalTransactions}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Best ${periodType === 'monthly' ? 'Month' : 'Week'}: ${performanceStats.bestPeriod}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Monthly Target: ${selectedTarget ? `${selectedTarget.name} - ${selectedTarget.metric === 'profit' ? 'TSh ' + formatCurrency(selectedTarget.target_value) : selectedTarget.target_value + ' items'} (${selectedTarget.period})` : 'No target selected'}`, 25, yPosition);
      yPosition += 15;

      // Table
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${periodType === 'monthly' ? 'Monthly' : 'Weekly'} Performance`, 20, yPosition);
      yPosition += 10;

      // Headers
      doc.setFontSize(9);
      const headers = ['Period', 'Profit (Ganji)', 'Sales Revenue', 'Items', 'Transactions'];
      const colWidths = [50, 35, 35, 25, 30];
      let xPos = 20;

      headers.forEach((header, index) => {
        doc.text(header, xPos, yPosition);
        xPos += colWidths[index];
      });

      yPosition += 8;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;

      // Data
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);

      periodData.forEach((period) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }

        xPos = 20;
        const rowData = [
          period.period.substring(0, 15),
          formatCurrency(period.ganji),
          formatCurrency(period.sales),
          period.items.toString(),
          period.transactions.toString()
        ];

        rowData.forEach((cell, index) => {
          doc.text(cell, xPos, yPosition);
          xPos += colWidths[index];
        });

        yPosition += 6;
      });

      doc.save(`commission-report-${user?.name || 'salesman'}-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportToExcel = () => {
    const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);
    const excelData = periodData.map(period => ({
      'Period': period.period,
      'Profit (Ganji)': period.ganji,
      'Sales Revenue': period.sales,
      'Items Sold': period.items,
      'Transactions': period.transactions
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${periodType === 'monthly' ? 'Monthly' : 'Weekly'} Data`);

    // Summary sheet
    const summaryData = [{
      'Metric': 'Total Profit (Ganji)',
      'Value': performanceStats.totalGanji
    }, {
      'Metric': 'Total Sales Revenue',
      'Value': performanceStats.totalSales
    }, {
      'Metric': 'Total Items Sold',
      'Value': performanceStats.totalItems
    }, {
      'Metric': 'Total Transactions',
      'Value': performanceStats.totalTransactions
    }, {
      'Metric': `Best ${periodType === 'monthly' ? 'Month' : 'Week'}`,
      'Value': performanceStats.bestPeriod
    }, {
      'Metric': 'Target',
      'Value': selectedTarget ? `${selectedTarget.name} - ${selectedTarget.metric === 'profit' ? 'TSh ' + formatCurrency(selectedTarget.target_value) : selectedTarget.target_value + ' items'} (${selectedTarget.period})` : 'No target selected'
    }, {
      'Metric': 'Current Period Progress (%)',
      'Value': performanceStats.currentPeriodProgress.toFixed(1)
    }];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    XLSX.writeFile(wb, `commission-report-${user?.name || 'salesman'}-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            My Commission Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track your profit performance over time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadSalesData}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-3 py-2 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1" />
            Excel
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center">
          <Calendar className="h-5 w-5 mr-2" />
          View Settings
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-1">
              Period Type
            </label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as 'weekly' | 'monthly')}
              className="w-full px-3 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                  {new Date().getFullYear() - i}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-1">
              Target
            </label>
            <select
              value={selectedTargetId}
              onChange={(e) => {
                setSelectedTargetId(e.target.value);
                if (user?.id) {
                  localStorage.setItem(`commission_selected_target_${user.id}`, e.target.value);
                }
              }}
              className="w-full px-3 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {targets.length > 0 ? (
                targets.map((target) => (
                  <option key={target.id} value={String(target.id)}>
                    {target.name} - {target.metric === 'profit' ? 'TSh' : ''} {target.metric === 'profit' ? formatCurrency(target.target_value) : target.target_value} {target.metric === 'items_sold' ? 'items' : ''} ({target.period})
                  </option>
                ))
              ) : (
                <option value="">No targets available</option>
              )}
            </select>
          </div>
        </div>
      </div>

      {/* Current Period Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Current {periodType === 'monthly' ? 'Month' : 'Week'} Progress
          </h2>
          <div className="text-center sm:text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Target: {selectedTarget?.metric === 'profit' ? 'TSh ' + formatCurrency(selectedTarget.target_value) : selectedTarget?.target_value + ' items'}
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
            <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
              {performanceStats.currentPeriodProgress.toFixed(1)}% Complete
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4">
            <div
              className={`h-3 sm:h-4 rounded-full transition-all duration-300 ${
                performanceStats.currentPeriodProgress >= 100 ? 'bg-green-500' :
                performanceStats.currentPeriodProgress >= 75 ? 'bg-blue-500' :
                performanceStats.currentPeriodProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(performanceStats.currentPeriodProgress, 100)}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm space-y-1 sm:space-y-0">
            <span className="text-gray-600 dark:text-gray-400">
              Current: {selectedTarget?.metric === 'profit' 
                ? `TSh ${formatCurrency(performanceStats.currentPeriodProgress * (selectedTarget?.target_value || 200000) / 100)}`
                : `${Math.round(performanceStats.currentPeriodProgress * (selectedTarget?.target_value || 200000) / 100)} items`
              }
            </span>
            <span className={`font-medium ${
              performanceStats.currentPeriodProgress >= 100 ? 'text-green-600' :
              performanceStats.currentPeriodProgress >= 75 ? 'text-blue-600' :
              performanceStats.currentPeriodProgress >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {selectedTarget?.metric === 'profit'
                ? `TSh ${formatCurrency(Math.max(0, (selectedTarget?.target_value || 200000) - (performanceStats.currentPeriodProgress * (selectedTarget?.target_value || 200000) / 100)))} remaining`
                : `${Math.max(0, Math.round((selectedTarget?.target_value || 200000) - (performanceStats.currentPeriodProgress * (selectedTarget?.target_value || 200000) / 100)))} items remaining`
              }
            </span>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                TSh {formatCurrency(performanceStats.totalGanji)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Sales Revenue</p>
              <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                TSh {formatCurrency(performanceStats.totalSales)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <BarChart3 className="h-4 w-4 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Items Sold</p>
              <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                {performanceStats.totalItems}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
              <Target className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Avg Profit</p>
              <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                TSh {formatCurrency(performanceStats.averageGanji)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Profit Flow Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedYear} Monthly Profit Flow
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
              Target Levels: 250K • 500K • 750K • 1M 
            </div>
          </div>
          <div className="h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={periodData} margin={{ top: 20, right: 20, left: 20, bottom: 60 }}>
                <defs>
                  <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#17946aff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                />
                <YAxis
                  tickFormatter={(value: number) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                  ticks={[250000, 500000, 750000, 1000000, 1250000, 1500000]}
                  domain={[0, 1500000]}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <Tooltip
                  formatter={(value: number) => [`TSh ${formatCurrency(value)}`, 'Monthly Profit']}
                  labelFormatter={(label) => `${label} ${selectedYear}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ganji"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#profitGradient)"
                  dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }}
                />
                {/* Target reference lines */}
                <Line
                  type="monotone"
                  dataKey={() => 250000}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey={() => 500000}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey={() => 750000}
                  stroke="#3b82f6"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey={() => 1000000}
                  stroke="#8b5cf6"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey={() => 1250000}
                  stroke="#ec4899"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  legendType="none"
                />
                <Line
                  type="monotone"
                  dataKey={() => 1500000}
                  stroke="#06b6d4"
                  strokeDasharray="5 5"
                  strokeWidth={1}
                  dot={false}
                  legendType="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">Monthly Profit</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-red-500 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">250K Target</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-yellow-500 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">500K Target</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-blue-500 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">750K Target</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-0.5 bg-purple-500 mr-2"></div>
              <span className="text-gray-600 dark:text-gray-400">1M Target</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          {periodType === 'monthly' ? 'Monthly' : 'Weekly'} Performance Details
        </h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading your commission data...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>
        ) : periodData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white">Period</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white">Profit</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Revenue</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden md:table-cell">Items</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden lg:table-cell">Transactions</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden xl:table-cell">Avg Profit</th>
                </tr>
              </thead>
              <tbody>
                {periodData.map((period) => (
                  <tr key={period.period} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-900 dark:text-white font-medium">
                      {period.period}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-green-600 dark:text-green-400 font-semibold font-mono">
                      TSh {formatCurrency(period.ganji)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 dark:text-white font-mono hidden sm:table-cell">
                      TSh {formatCurrency(period.sales)}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 dark:text-white hidden md:table-cell">
                      {period.items}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 dark:text-white hidden lg:table-cell">
                      {period.transactions}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-blue-600 dark:text-blue-400 font-mono hidden xl:table-cell">
                      TSh {formatCurrency(period.transactions > 0 ? period.ganji / period.transactions : 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No commission data available for the selected period
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Try selecting a different year or check if you have sales data
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionTracking;
