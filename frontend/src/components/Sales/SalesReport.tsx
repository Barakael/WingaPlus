import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Calculator,
  Filter,
  Search,
  Download,
  Eye,
  Package,
  User,
  Receipt,
  Percent,
  Minus,
  Plus
} from 'lucide-react';
import { sales, products } from '../../database';
import { useAuth } from '../../contexts/AuthContext';

// Enhanced sales data with expenses and offers
const enhancedSales = sales.map(sale => {
  const product = products.find(p => p.id === sale.product_id);
  const expenses = Math.random() * 500000 + 10000; // Mock expenses between TSh 50,000-150,000
  const offers = Math.random() * 5000; // Mock offers/discounts up to TSh 50,000
  const sellingPrice = sale.total_amount;
  const unitPrice = sale.unit_price;
  const profit = sellingPrice - unitPrice - expenses - offers;

  return {
    ...sale,
    product_name: product?.name || 'Unknown Product',
    expenses: expenses,
    offers: offers,
    selling_price: sellingPrice,
    profit: profit,
    profit_margin: ((profit / sellingPrice) * 100)
  };
});

const SalesReport: React.FC = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'profit' | 'amount' | 'product'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterBy, setFilterBy] = useState<'all' | 'profitable' | 'loss'>('all');

  // Filter sales based on user role and search
  const filteredSales = useMemo(() => {
    let filtered = enhancedSales;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(sale =>
        sale.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by profit/loss
    if (filterBy === 'profitable') {
      filtered = filtered.filter(sale => sale.profit > 0);
    } else if (filterBy === 'loss') {
      filtered = filtered.filter(sale => sale.profit <= 0);
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.sale_date).getTime();
          bValue = new Date(b.sale_date).getTime();
          break;
        case 'profit':
          aValue = a.profit;
          bValue = b.profit;
          break;
        case 'amount':
          aValue = a.selling_price;
          bValue = b.selling_price;
          break;
        case 'product':
          aValue = a.product_name;
          bValue = b.product_name;
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [searchTerm, sortBy, sortOrder, filterBy]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.selling_price, 0);
    const totalExpenses = filteredSales.reduce((sum, sale) => sum + sale.expenses, 0);
    const totalOffers = filteredSales.reduce((sum, sale) => sum + sale.offers, 0);
    const totalProfit = filteredSales.reduce((sum, sale) => sum + sale.profit, 0);
    const averageProfitMargin = filteredSales.length > 0
      ? filteredSales.reduce((sum, sale) => sum + sale.profit_margin, 0) / filteredSales.length
      : 0;

    return {
      totalRevenue,
      totalExpenses,
      totalOffers,
      totalProfit,
      averageProfitMargin,
      totalSales: filteredSales.length
    };
  }, [filteredSales]);

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? <Plus className="h-4 w-4" /> : <Minus className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Sales Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Detailed analysis of all sales with profit calculations
          </p>
        </div>
        <button className="bg-gradient-to-r from-[#800000] to-[#600000] text-white px-4 py-2 rounded-lg hover:from-[#600000] hover:to-[#400000] transition-colors flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                TSh {summary.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <Calculator className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                TSh {summary.totalExpenses.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Percent className="h-6 w-6 text-[#800000] dark:text-[#A00000]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Offers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                TSh {summary.totalOffers.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Discounts and promotional offers
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-[#800000] dark:text-[#A00000]" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Net Profit</p>
              <p className={`text-2xl font-bold ${summary.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                TSh {summary.totalProfit.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Total Sales</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{summary.totalSales}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Avg Profit Margin</p>
            <p className={`text-3xl font-bold ${summary.averageProfitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {summary.averageProfitMargin.toFixed(1)}%
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Profitability Rate</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              {summary.totalSales > 0 ? ((filteredSales.filter(s => s.profit > 0).length / summary.totalSales) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by product or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as typeof filterBy)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#800000] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Sales</option>
              <option value="profitable">Profitable Only</option>
              <option value="loss">Loss Making</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
            <button
              onClick={() => handleSort('date')}
              className={`px-3 py-1 rounded text-sm ${sortBy === 'date' ? 'bg-red-100 dark:bg-blue-900 text-[#800000] dark:text-[#A00000]' : 'text-gray-600 dark:text-gray-400'}`}
            >
              Date {getSortIcon('date')}
            </button>
            <button
              onClick={() => handleSort('profit')}
              className={`px-3 py-1 rounded text-sm ${sortBy === 'profit' ? 'bg-red-100 dark:bg-blue-900 text-[#800000] dark:text-[#A00000]' : 'text-gray-600 dark:text-gray-400'}`}
            >
              Profit {getSortIcon('profit')}
            </button>
            <button
              onClick={() => handleSort('amount')}
              className={`px-3 py-1 rounded text-sm ${sortBy === 'amount' ? 'bg-red-100 dark:bg-blue-900 text-[#800000] dark:text-[#A00000]' : 'text-gray-600 dark:text-gray-400'}`}
            >
              Amount {getSortIcon('amount')}
            </button>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Sales Details
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Product & Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Zoezi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Selling Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Expenses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Offers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Profit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Margin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <div className="w-10 h-10 bg-gradient-to-r from-[#800000] to-[#600000] rounded-full flex items-center justify-center">
                          <Package className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {sale.product_name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {sale.customer_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    TSh {sale.unit_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                    TSh {sale.selling_price.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 dark:text-red-400">
                    TSh {sale.expenses.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#800000] dark:text-[#A00000]">
                    TSh {sale.offers.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={sale.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                      TSh {sale.profit.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      sale.profit_margin >= 10 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      sale.profit_margin >= 0 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {sale.profit_margin.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(sale.sale_date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredSales.length === 0 && (
          <div className="text-center py-12">
            <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No sales found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {searchTerm || filterBy !== 'all' ? 'Try adjusting your search or filters' : 'No sales data available'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesReport;
