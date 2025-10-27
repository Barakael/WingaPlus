import React, { useState, useEffect } from 'react';
import { Target, TrendingUp, Calendar, Trophy, AlertTriangle, CheckCircle, Star, Award, Crown, Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { listTargets, createTarget, updateTarget, deleteTarget, Target as TargetType } from '../../services/sales';
import { useAuth } from '../../contexts/AuthContext';

const TargetManagement: React.FC = () => {
  const { user } = useAuth();
  const [targets, setTargets] = useState<TargetType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetType | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    period: 'monthly' as 'monthly' | 'yearly',
    metric: 'profit' as 'profit' | 'items_sold',
    target_value: '',
    bonus_amount: '',
  });

  // Load targets
  const loadTargets = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await listTargets({ salesman_id: String(user.id) });
      setTargets(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load targets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTargets();
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = {
        salesman_id: Number(user.id),
        name: formData.name,
        period: formData.period,
        metric: formData.metric,
        target_value: parseFloat(formData.target_value),
        bonus_amount: formData.bonus_amount ? parseFloat(formData.bonus_amount) : undefined,
      };

      if (editingTarget) {
        await updateTarget(editingTarget.id, payload);
      } else {
        await createTarget(payload);
      }

      await loadTargets();
      setShowCreateModal(false);
      setEditingTarget(null);
      resetForm();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to save target');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      period: 'monthly',
      metric: 'profit',
      target_value: '',
      bonus_amount: '',
    });
  };

  // Handle edit
  const handleEdit = (target: TargetType) => {
    setEditingTarget(target);
    setFormData({
      name: target.name,
      period: target.period,
      metric: target.metric,
      target_value: target.target_value.toString(),
      bonus_amount: target.bonus_amount?.toString() || '',
    });
    setShowCreateModal(true);
  };

  // Handle delete
  const handleDelete = async (target: TargetType) => {
    if (!confirm(`Are you sure you want to delete this ${target.name} target?`)) return;

    try {
      await deleteTarget(target.id);
      await loadTargets();
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Failed to delete target');
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-[#0d5a8a]';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="md:text-3xl text-2xl  font-bold text-gray-900 dark:text-white">
            Target Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage your sales targets
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={loadTargets}
            disabled={loading}
            className="flex items-center px-3 py-2 text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] disabled:bg-[#1973AE]/50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => {
              setEditingTarget(null);
              resetForm();
              setShowCreateModal(true);
            }}
            className="flex items-center px-3 py-2 text-sm bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors"
          >
            <Plus className="h-4 w-4 mr-1" />
            New Target
          </button>
        </div>
      </div>

      {/* Targets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <Target className="h-5 w-5 mr-2" />
          Your Targets
        </h2>

        {loading ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">Loading targets...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-600 dark:text-red-400">{error}</div>
        ) : targets.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Name</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Metric</th>
                  <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Target</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Period</th>
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="text-right py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Bonus</th>
                  <th className="text-center py-2 px-2 sm:py-3 sm:px-4 font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {targets.map((target) => (
                  <tr key={target.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white font-medium">
                      {target.name}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white capitalize">
                      {target.metric.replace('_', ' ')}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-right text-gray-900 dark:text-white font-mono">
                      {target.metric === 'profit' ? 'TSh ' : ''}{formatCurrency(target.target_value)}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white capitalize">
                      {target.period}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(target.status)}`}>
                        {target.status}
                      </span>
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-right text-gray-900 dark:text-white">
                      {target.bonus_amount ? `TSh ${formatCurrency(target.bonus_amount)}` : '-'}
                    </td>
                    <td className="py-2 px-2 sm:py-3 sm:px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleEdit(target)}
                          className="p-1 text-[#1973AE] hover:text-[#0d5a8a] dark:text-[#5da3d5] dark:hover:text-[#7db3d9] transition-colors"
                          title="Edit Target"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(target)}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete Target"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              No targets set yet
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Create your first target to start tracking your performance
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                {editingTarget ? 'Edit Target' : 'Create New Target'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTarget(null);
                  resetForm();
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Award className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter target name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Period
                  </label>
                  <select
                    value={formData.period}
                    onChange={(e) => setFormData(prev => ({ ...prev, period: e.target.value as 'monthly' | 'yearly' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Metric
                  </label>
                  <select
                    value={formData.metric}
                    onChange={(e) => setFormData(prev => ({ ...prev, metric: e.target.value as 'profit' | 'items_sold' }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    required
                  >
                    <option value="profit">Profit (Ganji)</option>
                    <option value="items_sold">Items Sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Value {formData.metric === 'profit' ? '(TSh)' : '(Items)'}
                </label>
                <input
                  type="number"
                  value={formData.target_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_value: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={`Enter target ${formData.metric === 'profit' ? 'amount' : 'quantity'}`}
                  required
                  min="0"
                  step={formData.metric === 'profit' ? '0.01' : '1'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bonus Amount (TSh) - Optional
                </label>
                <input
                  type="number"
                  value={formData.bonus_amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, bonus_amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter bonus amount"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setEditingTarget(null);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors"
                >
                  {editingTarget ? 'Update Target' : 'Create Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TargetManagement;
