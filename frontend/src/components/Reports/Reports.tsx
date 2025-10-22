import React, { useState, useEffect } from 'react';
import { Download, FileText, BarChart3, TrendingUp, Calendar, Filter, Wrench } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';

const Reports: React.FC = () => {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('30');
  const [reportType, setReportType] = useState('sales');
  const [sales, setSales] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, servicesResponse] = await Promise.all([
          fetch(`${BASE_URL}/sales?salesman_id=${user?.id || 1}`),
          fetch(`${BASE_URL}/services?salesman_id=${user?.id || 1}`)
        ]);

        if (salesResponse.ok) {
          const salesData = await salesResponse.json();
          setSales(salesData?.data?.data ?? []);
        }

        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData?.data?.data ?? []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Mock products data (since we don't have a products API yet)
  const products: any[] = [];

  // Calculations
  const totalSales = sales.reduce((sum: number, sale: any) => sum + (parseFloat(sale.total_amount) || 0), 0);
  const totalServiceGanji = services.reduce((sum: number, service: any) => sum + (parseFloat(service.ganji) || 0), 0);
  const totalGanji = sales.reduce((sum: number, sale: any) => sum + (parseFloat(sale.ganji) || 0), 0) + totalServiceGanji;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p: any) => p.stock_quantity <= p.min_stock_level).length;
  const recentSales = sales.slice(0, 10);

  const generateCSV = (data: any[], filename: string) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => row[header]).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadSalesReport = () => {
    const salesData = sales.map(sale => {
      const product = products.find(p => p.id === sale.product_id);
      return {
        'Sale ID': sale.id,
        'Product': product?.name || 'Unknown',
        'Customer': sale.customer_name,
        'Quantity': sale.quantity,
        'Unit Price': sale.unit_price,
        'Total Amount': sale.total_amount,
        'Warranty Months': sale.warranty_months,
        'Sale Date': sale.sale_date
      };
    });
    generateCSV(salesData, `sales-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadInventoryReport = () => {
    const inventoryData = products.map(product => ({
      'Product ID': product.id,
      'Name': product.name,
      'Stock Quantity': product.stock_quantity,
      'Min Stock Level': product.min_stock_level,
      'Price': product.price,
      'Status': product.stock_quantity <= product.min_stock_level ? 'Low Stock' : 'In Stock'
    }));
    generateCSV(inventoryData, `inventory-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadServicesReport = () => {
    const servicesData = services.map((service: any) => ({
      'Service ID': service.id,
      'Service Date': service.service_date,
      'Device Name': service.device_name,
      'Issue': service.issue,
      'Customer Name': service.customer_name,
      'Store Name': service.store_name,
      'Issue Price': service.issue_price,
      'Service Price': service.service_price,
      'Final Price': service.final_price,
      'Cost Price': service.cost_price,
      'Ganji': service.ganji,
      'Created At': service.created_at
    }));
    generateCSV(servicesData, `services-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const downloadWarrantyReport = () => {
    const warrantyData = sales.filter((sale: any) => sale.warranty_months > 0).map((sale: any) => ({
      'Sale ID': sale.id,
      'Product': sale.product_name || 'Unknown',
      'Customer': sale.customer_name,
      'Warranty Months': sale.warranty_months,
      'Sale Date': sale.sale_date,
      'Expiry Date': sale.warranty_details?.expiry_date || 'N/A'
    }));
    generateCSV(warrantyData, `warranty-report-${new Date().toISOString().split('T')[0]}.csv`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate and download detailed reports
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Filter className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          <span className="font-medium text-gray-900 dark:text-white">Filters</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="sales">Sales Report</option>
              <option value="services">Services Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="warranty">Warranty Report</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sales</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Ganji (Sales + Services)</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {totalGanji.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Warranties</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{sales.filter(s => s.warranty_months > 0).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Wrench className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Service Ganji</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {totalServiceGanji.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Download Reports */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Download Reports
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={downloadSalesReport}
            className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Sales Report
          </button>

          <button
            onClick={downloadServicesReport}
            className="p-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Services Report
          </button>

          <button
            onClick={downloadInventoryReport}
            className="p-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Inventory Report
          </button>

          <button
            onClick={downloadWarrantyReport}
            className="p-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg hover:from-yellow-600 hover:to-orange-700 transition-all duration-200 flex items-center justify-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Warranty Report
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Recent Sales Activity
        </h2>

        <div className="space-y-4">
          {recentSales.map((sale) => {
            const product = products.find(p => p.id === sale.product_id);
            return (
              <div key={sale.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {sale.customer_name} • Qty: {sale.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    TSh {sale.total_amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Reports;
