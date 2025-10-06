import React, { useState } from 'react';
import { DollarSign, TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { commissions, commissionRules } from '../../database';

const CommissionTracking: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | 'this_month' | 'last_month' | 'this_year'>('this_month');

  // Filter commissions based on selected period
  const filteredCommissions = commissions.filter(commission => {
    const commissionDate = new Date(commission.created_at);
    const now = new Date();

    switch (selectedPeriod) {
      case 'this_month':
        return commissionDate.getMonth() === now.getMonth() &&
               commissionDate.getFullYear() === now.getFullYear();
      case 'last_month':
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
        return commissionDate.getMonth() === lastMonth.getMonth() &&
               commissionDate.getFullYear() === lastMonth.getFullYear();
      case 'this_year':
        return commissionDate.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  });

  const totalEarned = filteredCommissions
    .filter(c => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0);

  const pendingAmount = filteredCommissions
    .filter(c => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0);

  const averageRate = filteredCommissions.length > 0
    ? filteredCommissions.reduce((sum, c) => sum + c.rate_percentage, 0) / filteredCommissions.length
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'cancelled': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Commission Tracking
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor your commission earnings and payout status
          </p>
        </div>
      </div>

      {/* Period Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Time' },
            { key: 'this_year', label: 'This Year' },
            { key: 'this_month', label: 'This Month' },
            { key: 'last_month', label: 'Last Month' }
          ].map((period) => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPeriod === period.key
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {totalEarned.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">TSh {pendingAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{averageRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Rules */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Commission Rules
        </h2>
        <div className="space-y-4">
          {commissionRules.map((rule) => (
            <div key={rule.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{rule.name}</h3>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  rule.is_active
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                }`}>
                  {rule.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Type: {rule.type === 'percentage' ? 'Percentage' : rule.type === 'tiered' ? 'Tiered' : 'Fixed'}
              </p>
              {rule.type === 'percentage' && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Base Rate: {rule.base_rate}%
                </p>
              )}
              {rule.type === 'tiered' && rule.tiers && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tiers:</p>
                  <div className="space-y-1">
                    {rule.tiers.map((tier: any, index: number) => (
                      <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                        {tier.min_amount === 0 ? '0' : `TSh ${tier.min_amount.toLocaleString()}`}
                        {tier.max_amount ? ` - TSh ${tier.max_amount.toLocaleString()}` : '+'}
                        : {tier.rate_percentage}%
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Commission History */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Commission History ({filteredCommissions.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Paid Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredCommissions.map((commission) => (
                <tr key={commission.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(commission.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600 dark:text-green-400">
                    TSh {commission.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {commission.rate_percentage}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(commission.status)}`}>
                      {getStatusIcon(commission.status)}
                      <span className="ml-1 capitalize">{commission.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {commission.paid_at ? new Date(commission.paid_at).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCommissions.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No commissions found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedPeriod === 'all'
                ? 'You haven\'t earned any commissions yet.'
                : `No commissions found for the selected period.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommissionTracking;