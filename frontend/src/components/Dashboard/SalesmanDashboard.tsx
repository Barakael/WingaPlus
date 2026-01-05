import React, { useEffect, useState, useCallback } from 'react';
import { Target, TrendingUp, Clock, Wrench, ShoppingCart, Wallet, FileText, FileSpreadsheet, Printer, ChevronDown, ChevronUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listSales, listTargets, Target as TargetType } from '../../services/sales';
import { listExpenditures, Expenditure } from '../../services/expenditures';
import { BASE_URL } from '../../components/api/api';
import { Sale } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

interface SalesmanDashboardProps {
  onTabChange?: (tab: string) => void;
}

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

const SalesmanDashboard: React.FC<SalesmanDashboardProps> = ({ onTabChange }) => {
  const { user } = useAuth();
  const [mySales, setMySales] = useState<Sale[]>([]);
  const [myServices, setMyServices] = useState<any[]>([]);
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [selectedTargetId, setSelectedTargetId] = useState<string>('');
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
  const [showPrintMenu, setShowPrintMenu] = useState(false);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);
  
  const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Load targets data
  const loadTargetsData = useCallback(async () => {
    if (!user) return;

    try {
      const data = await listTargets({ salesman_id: String(user.id) });
      setTargets(data);
      if (!selectedTargetId && data.length > 0) {
        const savedTargetId = localStorage.getItem(`commission_selected_target_${user.id}`);
        if (savedTargetId && data.find(t => String(t.id) === savedTargetId)) {
          setSelectedTargetId(savedTargetId);
        } else {
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

  // Load sales data
  const loadSalesData = useCallback(async () => {
      if (!user) return;

      try {
        setLoading(true);
        const [salesData, servicesResponse, expendituresData] = await Promise.all([
          listSales({ salesman_id: String(user.id) }),
          fetch(`${BASE_URL}/api/services?salesman_id=${user.id}`),
          listExpenditures({ salesman_id: String(user.id) })
        ]);

        setMySales(salesData);
        setExpenditures(expendituresData);

        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setMyServices(servicesData?.data?.data ?? []);
        }
    } catch (e) {
        console.error('Failed to load data:', e);
      } finally {
        setLoading(false);
      }
  }, [user]);

  // Calculate period data
  const calculatePeriodData = useCallback(() => {
    const selectedTarget = targets.find(target => String(target.id) === selectedTargetId);
    const targetValue = selectedTarget ? selectedTarget.target_value : 200000;
    const targetMetric = selectedTarget?.metric || 'profit';
    const periodType = 'monthly';

    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const periods: Record<string, PeriodData> = {};

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

    mySales.forEach(sale => {
      const saleDate = new Date(sale.sale_date || '');
      if (saleDate.getFullYear() !== selectedYear) return;

      const monthName = saleDate.toLocaleDateString('en-US', { month: 'long' });
      const periodKey = `${monthName} ${saleDate.getFullYear()}`;

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
      periods[periodKey].ganji += (ganji - offers);
      periods[periodKey].sales += (Number(sale.total_amount) - offers);
      periods[periodKey].items += Number(sale.quantity);
      periods[periodKey].transactions += 1;
    });

    myServices.forEach(service => {
      const serviceDate = new Date(service.created_at || service.date || '');
      if (serviceDate.getFullYear() !== selectedYear) return;

      const monthName = serviceDate.toLocaleDateString('en-US', { month: 'long' });
      const periodKey = `${monthName} ${serviceDate.getFullYear()}`;

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

    expenditures.forEach(expenditure => {
      const expenditureDate = new Date(expenditure.expenditure_date || '');
      if (expenditureDate.getFullYear() !== selectedYear) return;

      const monthName = expenditureDate.toLocaleDateString('en-US', { month: 'long' });
      const periodKey = `${monthName} ${expenditureDate.getFullYear()}`;

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

    Object.keys(periods).forEach(periodKey => {
      periods[periodKey].totalGanji = periods[periodKey].ganji + periods[periodKey].services;
      periods[periodKey].netCommission = periods[periodKey].totalGanji - periods[periodKey].expenditures;
      periods[periodKey].totalTransactions = periods[periodKey].transactions + (periods[periodKey].totalTransactions - periods[periodKey].transactions);
    });

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    const periodArray = months.map((month, index) => {
      const monthData = periods[`${month} ${selectedYear}`];
      if (selectedYear < currentYear) {
        return monthData;
      } else if (selectedYear === currentYear) {
        return index <= currentMonth ? monthData : { ...monthData, ganji: 0, sales: 0, services: 0, totalGanji: 0, expenditures: 0, netCommission: 0, items: 0, transactions: 0, totalTransactions: 0 };
      } else {
        return { ...monthData, ganji: 0, sales: 0, services: 0, totalGanji: 0, expenditures: 0, netCommission: 0, items: 0, transactions: 0, totalTransactions: 0 };
      }
    });

    setPeriodData(periodArray);

    const totalGanji = periodArray.reduce((sum, p) => sum + p.ganji, 0);
    const totalTransactions = periodArray.reduce((sum, p) => sum + p.transactions, 0);
    const totalExpenditures = periodArray.reduce((sum, p) => sum + p.expenditures, 0);

    const servicesGanji = myServices.reduce((sum, service) => sum + (parseFloat(service.ganji) || 0), 0);
    const salesGanji = totalGanji;
    const combinedGanji = salesGanji + servicesGanji;
    const netCommission = combinedGanji - totalExpenditures;
    
    const isNegative = netCommission < 0 || (totalExpenditures > 0 && totalExpenditures / combinedGanji > 0.8);

    const bestPeriod = periodArray.reduce((best, current) =>
      current.ganji > best.ganji ? current : best, periodArray[0] || { period: '' }
    );

    const currentMonthName = currentDate.toLocaleDateString('en-US', { month: 'long' });
    const currentPeriodKey = `${currentMonthName} ${currentDate.getFullYear()}`;
    const currentPeriodData = periods[currentPeriodKey];
    const currentPeriodProfit = currentPeriodData ? currentPeriodData.netCommission : 0;
    const currentPeriodItems = currentPeriodData ? currentPeriodData.items : 0;
    const currentPeriodValue = targetMetric === 'profit' ? currentPeriodProfit : currentPeriodItems;
    const currentPeriodProgress = targetValue > 0 ? (currentPeriodValue / targetValue) * 100 : 0;

    setPerformanceStats({
      totalGanji: combinedGanji,
      totalSales: salesGanji,
      totalExpenditures,
      netCommission,
      totalTransactions,
      averageGanji: totalTransactions > 0 ? totalGanji / totalTransactions : 0,
      bestPeriod: bestPeriod?.period || '',
      currentPeriodProgress,
      periodType,
      targetMetric,
      servicesGanji,
      currentPeriodProfit,
      currentPeriodItems,
      isNegative,
    });
  }, [mySales, targets, selectedTargetId, selectedYear, myServices, expenditures]);

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

      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Monthly Performance Report', 105, 20, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Salesman: ${user?.name || 'Unknown'}`, 20, 35);
      doc.text(`Year: ${selectedYear}`, 20, 42);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 49);

      let yPosition = 65;

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Performance Summary', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Profit (Sales + Services): ${formatCurrency(performanceStats.totalGanji)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Expenditures: ${formatCurrency(performanceStats.totalExpenditures)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Net Commission: ${formatCurrency(performanceStats.netCommission)}`, 25, yPosition);
      yPosition += 6;
      doc.text(`Total Transactions: ${performanceStats.totalTransactions}`, 25, yPosition);
      yPosition += 15;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Monthly Performance', 20, yPosition);
      yPosition += 10;

      doc.setFontSize(9);
      const headers = ['Month', 'Net Profit', 'Expenditures', 'Transactions'];
      const colWidths = [50, 40, 40, 30];
      let xPos = 20;

      headers.forEach((header, index) => {
        doc.text(header, xPos, yPosition);
        xPos += colWidths[index];
      });

      yPosition += 8;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;

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
          formatCurrency(period.netCommission),
          formatCurrency(period.expenditures),
          period.totalTransactions.toString()
        ];

        rowData.forEach((cell, index) => {
          doc.text(cell, xPos, yPosition);
          xPos += colWidths[index];
        });

        yPosition += 6;
      });

      doc.save(`performance-report-${user?.name || 'salesman'}-${new Date().toISOString().split('T')[0]}.pdf`);
      setShowPrintMenu(false);
    } catch (error) {
      alert(`Failed to export PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const exportToExcel = () => {
    const excelData = periodData.map(period => ({
      'Month': period.period,
      'Net Profit': period.netCommission,
      'Expenditures': period.expenditures,
      'Transactions': period.totalTransactions
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Monthly Data');

    const summaryData = [{
      'Metric': 'Total Profit (Sales + Services)',
      'Value': performanceStats.totalGanji
    }, {
      'Metric': 'Total Expenditures',
      'Value': performanceStats.totalExpenditures
    }, {
      'Metric': 'Net Commission',
      'Value': performanceStats.netCommission
    }, {
      'Metric': 'Total Transactions',
      'Value': performanceStats.totalTransactions
    }];

    const wsSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, wsSummary, 'Summary');

    XLSX.writeFile(wb, `performance-report-${user?.name || 'salesman'}-${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowPrintMenu(false);
  };

  const handlePrint = () => {
    window.print();
    setShowPrintMenu(false);
  };

  // Calculate stats
  const totalItems = mySales.reduce((sum, sale) => sum + Number(sale.quantity), 0);

  return (
    <div className="space-y-6 pb-16">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {user?.name}'s Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
            Track your sales performance 
          </p>
        </div>
        {/* <div className="flex items-center gap-2">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
          >
            {Array.from({ length: 5 }, (_, i) => (
              <option key={new Date().getFullYear() - i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>
        </div> */}
      </div>

      {/* Stats Cards - Now 4 cards including expenditures */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 shadow-xl dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="h-5 w-5 md:h-6 md:w-6 text-[#1973AE] dark:text-[#04BCF2]" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Profit</p>
              <p className="text-md md:text-2xl font-bold text-gray-900 dark:text-white">TSh {formatCurrency(performanceStats.totalGanji)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wallet className="h-5 w-5 md:h-6 md:w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Matumizi</p>
              <p className="text-md md:text-2xl font-bold text-red-900 dark:text-red-400">TSh {formatCurrency(performanceStats.totalExpenditures)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="h-5 w-5 md:h-6 md:w-6 text-[#1973AE] dark:text-[#04BCF2]" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Items Sold</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-6">
          <div className="flex items-center">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
              <Wrench className="h-5 w-5 md:h-6 md:w-6 text-[#1973AE] dark:text-[#04BCF2]" />
            </div>
            <div className="ml-3 md:ml-4 min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Services Done</p>
              <p className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">{myServices.length}</p>
            </div>
          </div>
        </div>

       
      </div>

      {/* Current Period Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Target className="h-5 w-5 mr-2" />
            Current Month Progress
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                Select Target:
              </label>
              <select
                value={selectedTargetId || ''}
                onChange={(e) => {
                  setSelectedTargetId(e.target.value);
                  if (user?.id) {
                    localStorage.setItem(`commission_selected_target_${user.id}`, e.target.value);
                  }
                }}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm min-w-0 max-w-[200px] sm:min-w-[200px] truncate"
                disabled={loading}
              >
                {targets.length > 0 ? (
                  targets.map((target) => (
                    <option key={target.id} value={String(target.id)} className="truncate">
                      {target.name}
                    </option>
                  ))
                ) : (
                  <option value="">{loading ? 'Loading targets...' : 'No targets available'}</option>
                )}
              </select>
            </div>
            {selectedTarget && (
              <div className="text-center sm:text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Target: {selectedTarget.metric === 'profit' ? 'TSh ' + formatCurrency(selectedTarget.target_value) : selectedTarget.target_value + ' items'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Progress</span>
              <span className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white">
                {(performanceStats.currentPeriodProgress || 0).toFixed(1)}% Complete
              </span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 sm:h-4">
              <div
                className={`h-3 sm:h-4 rounded-full transition-all duration-300 ${
                  (performanceStats.currentPeriodProgress || 0) >= 100 ? 'bg-[#1973AE]' :
                  (performanceStats.currentPeriodProgress || 0) >= 75 ? 'bg-red-500' :
                  (performanceStats.currentPeriodProgress || 0) >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(performanceStats.currentPeriodProgress || 0, 100)}%` }}
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
                    ? 'text-[#1973AE]'
                    : performanceStats.currentPeriodProgress >= 75
                    ? 'text-[#1973AE]'
                    : performanceStats.currentPeriodProgress >= 50
                    ? 'text-yellow-600'
                    : 'text-red-600'
                }`}
              >
                {selectedTarget && selectedTarget.metric === 'items_sold'
                  ? `${Math.max(0, Math.round(selectedTarget.target_value - performanceStats.currentPeriodItems))} items remaining`
                  : `TSh ${formatCurrency(Math.max(0, Math.round((selectedTarget?.target_value || 200000) - performanceStats.currentPeriodProfit)))} remaining`}
              </span>
            </div>
          </div>
        </div>

   {/* Recent Sales */}
   <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          My Recent Sales
        </h2>
        <div className="space-y-2">
          {loading ? (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">Loading sales...</div>
          ) : mySales.slice(0, 2).map((sale: any) => {
            const costPrice = Number(sale.cost_price) || 0;
            const sellingPrice = Number(sale.unit_price) || 0;
            const quantity = Number(sale.quantity) || 1;
            const offers = Number(sale.offers) || 0;
            const profit = (sellingPrice - costPrice) * quantity - offers;
            
            return (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl shadow-2xl">
                <div className="flex items-center">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                      {sale.product_name || sale.product_id}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-300">
                      {sale.customer_name || 'Customer'} • Qty: {sale.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-600 dark:text-gray-300 text-xs">
                    TSh {formatCurrency(profit)}
                  </p>
                  <p className="text-xs text-green-500 dark:text-green-300">Profit (Ganji)</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 flex items-center justify-end">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Net Commission Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {selectedYear} Monthly Net Commission Chart
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-0">
            Net Commission = Profit - Expenditures
          </div>
        </div>
        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={periodData} margin={{ top: 20, right: 10, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="period"
                tick={{ fontSize: 11, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                height={50}
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
                formatter={(value: number) => [`TSh ${formatCurrency(value)}`, 'Net Commission']}
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


   
    
     

      {/* Floating Print Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          <button
            onClick={() => setShowPrintMenu(!showPrintMenu)}
            className="bg-[#1973AE] text-white p-4 rounded-full shadow-lg hover:bg-[#0d5a8a] transition-all duration-200 flex items-center justify-center"
            aria-label="Print options"
          >
            <Printer className="h-6 w-6" />
          </button>

          {showPrintMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPrintMenu(false)}
              ></div>
              <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 min-w-[180px] z-50">
             
                <button
                  onClick={exportToPDF}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={exportToExcel}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
                >
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Export Excel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesmanDashboard;
