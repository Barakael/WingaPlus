import React, { useEffect, useState, useCallback } from 'react';
import { TrendingUp, DollarSign, Target, Calendar, FileText, FileSpreadsheet, RefreshCw, BarChart3, Wrench, AlertTriangle, Wallet } from 'lucide-react';
import { listSales, listTargets, Target as TargetType } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';
import { Sale } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { BASE_URL } from '../../components/api/api';
import { listExpenditures, Expenditure } from '../../services/expenditures';

interface PeriodData {
  period: string;
  ganji: number;
  sales: number;
  services: number;
  totalGanji: number;
  expenditures: number;
  netCommission: number;
  items: number;
  transactions: number;
  totalTransactions: number;
}

interface PerformanceStats {
  totalGanji: number;
  totalSales: number;
  totalExpenditures: number;
  netCommission: number;
  totalTransactions: number;
  averageGanji: number;
  bestPeriod: string;
  currentPeriodProgress: number;
  periodType: 'weekly' | 'monthly';
  targetMetric: string;
  servicesGanji?: number;
  currentPeriodProfit: number;
  currentPeriodItems: number;
  isNegative: boolean;
}

const CommissionTracking: React.FC = () => {
  const { user } = useAuth();
  const [sales, setSales] = useState<Sale[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
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
    totalExpenditures: 0,
    netCommission: 0,
    totalTransactions: 0,
    averageGanji: 0,
    bestPeriod: '',
    currentPeriodProgress: 0,
    periodType: 'monthly',
    targetMetric: 'profit',
    servicesGanji: 0,
    currentPeriodProfit: 0,
    currentPeriodItems: 0,
    isNegative: false,
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
      const [salesData, servicesResponse, expendituresData] = await Promise.all([
        listSales({ salesman_id: String(user.id) }),
        fetch(`${BASE_URL}/api/services?salesman_id=${user.id}`),
        listExpenditures({ salesman_id: String(user.id) })
      ]);

      setSales(salesData);
      setExpenditures(expendituresData);

      if (servicesResponse.ok) {
        const servicesData = await servicesResponse.json();
        setServices(servicesData?.data?.data ?? []);
      }
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
        services: 0,
        totalGanji: 0,
        expenditures: 0,
        netCommission: 0,
        items: 0,
        transactions: 0,
        totalTransactions: 0
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
          services: 0,
          totalGanji: 0,
          expenditures: 0,
          netCommission: 0,
          items: 0,
          transactions: 0,
          totalTransactions: 0,
        };
      }

      const ganji = (Number(sale.unit_price) - Number(sale.cost_price || 0)) * Number(sale.quantity);
      const offers = Number(sale.offers) || 0;
      periods[periodKey].ganji += (ganji - offers); // Subtract offers from ganji
      periods[periodKey].sales += (Number(sale.total_amount) - offers); // Subtract offers from sales
      periods[periodKey].items += Number(sale.quantity);
      periods[periodKey].transactions += 1;
    });

    // Process services data
    services.forEach(service => {
      const serviceDate = new Date(service.created_at || service.date || '');
      if (serviceDate.getFullYear() !== selectedYear) return; // Only include services from selected year

      let periodKey: string;

      if (periodType === 'weekly') {
        // Get week number and year
        const startOfYear = new Date(serviceDate.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((serviceDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        periodKey = `Week ${weekNumber}, ${serviceDate.getFullYear()}`;
      } else {
        // Monthly
        const monthName = serviceDate.toLocaleDateString('en-US', { month: 'long' });
        periodKey = `${monthName} ${serviceDate.getFullYear()}`;
      }

      if (!periods[periodKey]) {
        periods[periodKey] = {
          period: periodKey,
          ganji: 0,
          sales: 0,
          services: 0,
          totalGanji: 0,
          expenditures: 0,
          netCommission: 0,
          items: 0,
          transactions: 0,
          totalTransactions: 0
        };
      }

      const serviceGanji = parseFloat(service.ganji) || 0;
      periods[periodKey].services += serviceGanji;
      periods[periodKey].totalTransactions += 1;
    });

    // Process expenditures data
    expenditures.forEach(expenditure => {
      const expenditureDate = new Date(expenditure.expenditure_date || '');
      if (expenditureDate.getFullYear() !== selectedYear) return; // Only include expenditures from selected year

      let periodKey: string;

      if (periodType === 'weekly') {
        // Get week number and year
        const startOfYear = new Date(expenditureDate.getFullYear(), 0, 1);
        const weekNumber = Math.ceil(((expenditureDate.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        periodKey = `Week ${weekNumber}, ${expenditureDate.getFullYear()}`;
      } else {
        // Monthly
        const monthName = expenditureDate.toLocaleDateString('en-US', { month: 'long' });
        periodKey = `${monthName} ${expenditureDate.getFullYear()}`;
      }

      if (!periods[periodKey]) {
        periods[periodKey] = {
          period: periodKey,
          ganji: 0,
          sales: 0,
          services: 0,
          totalGanji: 0,
          expenditures: 0,
          netCommission: 0,
          items: 0,
          transactions: 0,
          totalTransactions: 0
        };
      }

      const expenditureAmount = parseFloat(String(expenditure.amount)) || 0;
      periods[periodKey].expenditures += expenditureAmount;
    });

    // Calculate total ganji and net commission for each period
    Object.keys(periods).forEach(periodKey => {
      periods[periodKey].totalGanji = periods[periodKey].ganji + periods[periodKey].services;
      periods[periodKey].netCommission = periods[periodKey].totalGanji - periods[periodKey].expenditures;
      periods[periodKey].totalTransactions = periods[periodKey].transactions + (periods[periodKey].totalTransactions - periods[periodKey].transactions);
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
          return index <= currentMonth ? monthData : { ...monthData, ganji: 0, sales: 0, services: 0, totalGanji: 0, expenditures: 0, netCommission: 0, items: 0, transactions: 0, totalTransactions: 0 };
        } else {
          // Future years - show all as zero
          return { ...monthData, ganji: 0, sales: 0, services: 0, totalGanji: 0, expenditures: 0, netCommission: 0, items: 0, transactions: 0, totalTransactions: 0 };
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
    const totalTransactions = filteredPeriodArray.reduce((sum, p) => sum + p.transactions, 0);
    const totalExpenditures = filteredPeriodArray.reduce((sum, p) => sum + p.expenditures, 0);

    // Calculate services ganji
    const servicesGanji = services.reduce((sum, service) => sum + (parseFloat(service.ganji) || 0), 0);
    const salesGanji = totalGanji; // Rename for clarity
    const combinedGanji = salesGanji + servicesGanji;
    const netCommission = combinedGanji - totalExpenditures;
    
    // Check if expenditures significantly exceed profit (more than 80% or negative)
    const isNegative = netCommission < 0 || (totalExpenditures > 0 && totalExpenditures / combinedGanji > 0.8);

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
    const currentPeriodProfit = currentPeriodData ? currentPeriodData.netCommission : 0;
    const currentPeriodItems = currentPeriodData ? currentPeriodData.items : 0;
    if (currentPeriodData) {
      currentPeriodValue = targetMetric === 'profit' ? currentPeriodProfit : currentPeriodItems;
    }

    const currentPeriodProgress = targetValue > 0 ?
      (currentPeriodValue / targetValue) * 100 : 0;

    setPerformanceStats({
      totalGanji: combinedGanji, // Now includes both sales and services
      totalSales: salesGanji, // This is now sales ganji only
      totalExpenditures,
      netCommission,
      totalTransactions,
      averageGanji: totalTransactions > 0 ? totalGanji / totalTransactions : 0,
      bestPeriod: bestPeriod?.period || '',
      currentPeriodProgress,
      periodType,
      targetMetric,
      servicesGanji, // Add services ganji to stats
      currentPeriodProfit,
      currentPeriodItems,
      isNegative,
    });
  }, [sales, periodType, targets, selectedTargetId, selectedYear, services, expenditures]);

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
      doc.text(`Total Profit (Sales + Services): ${formatCurrency(performanceStats.totalGanji)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Sales Ganji: ${formatCurrency(performanceStats.totalSales)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Services Ganji: ${formatCurrency(performanceStats.servicesGanji || 0)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Expenditures: ${formatCurrency(performanceStats.totalExpenditures)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Net Commission (Profit - Expenditures): ${formatCurrency(performanceStats.netCommission)}`, 25, yPosition);
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
      const headers = ['Period', 'Total Profit', 'Expenditures', 'Net Commission', 'Transactions'];
      const colWidths = [50, 30, 30, 35, 25];
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
          formatCurrency(period.totalGanji),
          formatCurrency(period.expenditures),
          formatCurrency(period.netCommission),
          period.totalTransactions.toString()
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
      'Total Profit': period.totalGanji,
      'Expenditures': period.expenditures,
      'Net Commission': period.netCommission,
      'Transactions': period.totalTransactions
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${periodType === 'monthly' ? 'Monthly' : 'Weekly'} Data`);

    // Summary sheet
    const summaryData = [{
      'Metric': 'Total Profit (Sales + Services)',
      'Value': performanceStats.totalGanji
    }, {
      'Metric': 'Sales Ganji',
      'Value': performanceStats.totalSales
    }, {
      'Metric': 'Services Ganji',
      'Value': performanceStats.servicesGanji || 0
    }, {
      'Metric': 'Total Expenditures',
      'Value': performanceStats.totalExpenditures
    }, {
      'Metric': 'Net Commission (Profit - Expenditures)',
      'Value': performanceStats.netCommission
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
            Ganji Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track your profit "ganji" performance over time
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={loadSalesData}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] disabled:bg-[#1973AE]/50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={exportToPDF}
            className="flex items-center px-3 py-2 text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors"
          >
            <FileText className="h-4 w-4 mr-1" />
            PDF
          </button>
          <button
            onClick={exportToExcel}
            className="flex items-center px-3 py-2 text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors"
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-1">
              Period Type
            </label>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as 'weekly' | 'monthly')}
              className="w-full px-3 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div> */}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 md:mb-1">
              Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="w-full px-3 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
              className="w-full px-3 py-1 md:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {targets.length > 0 ? (
                targets.map((target) => (
                  <option key={target.id} value={String(target.id)}>
                    {target.name}  ({target.period})
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
                performanceStats.currentPeriodProgress >= 75 ? 'bg-red-500' :
                performanceStats.currentPeriodProgress >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(performanceStats.currentPeriodProgress, 100)}%` }}
            ></div>
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm space-y-1 sm:space-y-0">
            <span className="text-gray-600 dark:text-gray-400">
              Current Net Profit:{' '}
              {selectedTarget && selectedTarget.metric === 'items_sold'
                ? `${performanceStats.currentPeriodItems} items`
                : `TSh ${formatCurrency(performanceStats.currentPeriodProfit)}`}
            </span>
            <span
              className={`font-medium ${
                performanceStats.currentPeriodProgress >= 100
                  ? 'text-green-600'
                  : performanceStats.currentPeriodProgress >= 75
                  ? 'text-[#1973AE]'
                  : performanceStats.currentPeriodProgress >= 50
                  ? 'text-yellow-600'
                  : 'text-red-600'
              }`}
            >
              {selectedTarget && selectedTarget.metric === 'items_sold'
                ? `${Math.max(
                    0,
                    Math.round(selectedTarget.target_value - performanceStats.currentPeriodItems),
                  )} items remaining`
                : `TSh ${formatCurrency(
                    Math.max(
                      0,
                      Math.round(
                        (selectedTarget?.target_value || 0) - performanceStats.currentPeriodProfit,
                      ),
                    ),
                  )} remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* Negative Commission Warning */}
      {performanceStats.isNegative && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg p-4 sm:p-6">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm sm:text-base font-bold text-red-800 dark:text-red-300 mb-2">
                ⚠️ Negative Commission Alert
              </h3>
              <p className="text-xs sm:text-sm text-red-700 dark:text-red-400 mb-2">
                Your expenditures ({formatCurrency(performanceStats.totalExpenditures)}) are significantly impacting your commission.
              </p>
              <div className="text-xs sm:text-sm text-red-700 dark:text-red-400 space-y-1">
                <p><strong>Total Profit:</strong> TSh {formatCurrency(performanceStats.totalGanji)}</p>
                <p><strong>Total Expenditures:</strong> TSh {formatCurrency(performanceStats.totalExpenditures)}</p>
                <p className="font-bold">
                  <strong>Net Commission:</strong> TSh {formatCurrency(performanceStats.netCommission)}
                  {performanceStats.netCommission < 0 && ' (NEGATIVE)'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-[#1973AE] dark:text-[#5da3d5]" />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Sales Ganji</p>
              <p className="text-sm sm:text-xl font-bold text-gray-900 dark:text-white">
                TSh {formatCurrency(performanceStats.totalSales)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <Wallet className="h-4 w-4 sm:h-6 sm:w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenditures</p>
              <p className="text-sm sm:text-xl font-bold text-red-600 dark:text-red-400">
                TSh {formatCurrency(performanceStats.totalExpenditures)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
          <div className="flex items-center">
            <div className={`p-2 sm:p-3 rounded-lg ${performanceStats.netCommission < 0 ? 'bg-red-100 dark:bg-red-900/20' : 'bg-orange-100 dark:bg-orange-900/20'}`}>
              <Wrench className={`h-4 w-4 sm:h-6 sm:w-6 ${performanceStats.netCommission < 0 ? 'text-red-600 dark:text-red-400' : 'text-orange-600 dark:text-orange-400'}`} />
            </div>
            <div className="ml-1 sm:ml-1">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">Net Commission</p>
              <p className={`text-sm sm:text-xl font-bold ${performanceStats.netCommission < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                TSh {formatCurrency(performanceStats.netCommission)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6">
        {/* Monthly Net Commission Bar Chart with dynamic scaling */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              {selectedYear} Monthly Net Commission Chart
            </h2>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
              Net Commission = Profit - Expenditures
            </div>
          </div>
          <div className="h-80 sm:h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={periodData} margin={{ top: 20, right: 10, left: 0, bottom: 60 }}>
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
                  domain={['auto', 'auto']}
                  tickFormatter={(value: number) => {
                    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                    if (value <= -1000000) return `-${(Math.abs(value) / 1000000).toFixed(1)}M`;
                    if (value <= -1000) return `-${(Math.abs(value) / 1000).toFixed(0)}K`;
                    return value.toString();
                  }}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                />
                <Tooltip
                  formatter={(value: number, name: string) => {
                    if (name === 'netCommission') {
                      return [`TSh ${formatCurrency(value)}`, 'Net Commission'];
                    }
                    if (name === 'totalGanji') {
                      return [`TSh ${formatCurrency(value)}`, 'Total Profit'];
                    }
                    if (name === 'expenditures') {
                      return [`TSh ${formatCurrency(value)}`, 'Expenditures'];
                    }
                    return [`TSh ${formatCurrency(value)}`, name];
                  }}
                  labelFormatter={(label) => `${label} ${selectedYear}`}
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f9fafb'
                  }}
                />
                <Bar dataKey="netCommission" radius={[4, 4, 0, 0]}>
                  {periodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.netCommission < 0 ? '#ef4444' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
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
                  <th className="text-left py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white">Month</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white">Net Profit</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden sm:table-cell">Expenditures</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden md:table-cell">Net Commission</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden lg:table-cell">Transactions</th>
                  <th className="text-right py-2 sm:py-3 px-2 sm:px-4 font-semibold text-gray-900 dark:text-white hidden xl:table-cell">Avg Net Profit</th>
                </tr>
              </thead>
              <tbody>
                {periodData.map((period) => (
                  <tr key={period.period} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-left text-gray-900 dark:text-white font-semibold">
                      {period.period.split(' ')[0]}
                    </td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold font-mono ${period.netCommission < 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                      TSh {Math.round(period.netCommission).toLocaleString()}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-red-600 dark:text-red-400 font-mono hidden sm:table-cell">
                      TSh {Math.round(period.expenditures).toLocaleString()}
                    </td>
                    <td className={`py-2 sm:py-3 px-2 sm:px-4 text-right font-semibold font-mono hidden md:table-cell ${period.netCommission < 0 ? 'text-red-600 dark:text-red-400' : 'text-[#1973AE] dark:text-[#5da3d5]'}`}>
                      TSh {Math.round(period.netCommission).toLocaleString()}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-gray-900 dark:text-white hidden lg:table-cell">
                      {period.totalTransactions}
                    </td>
                    <td className="py-2 sm:py-3 px-2 sm:px-4 text-right text-[#1973AE] dark:text-[#5da3d5] font-mono hidden xl:table-cell">
                      TSh {period.totalTransactions > 0 ? Math.round(period.netCommission / period.totalTransactions).toLocaleString() : '0'}
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
