import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { salesOrders } from '../../database';

interface SalesOrdersProps {
  openSaleForm?: (prefill?: any, onComplete?: () => void) => void;
}

const SalesOrders: React.FC<SalesOrdersProps> = ({ openSaleForm }) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<'all' | 'draft' | 'quoted' | 'confirmed' | 'completed' | 'cancelled'>('all');

  const filteredOrders = salesOrders.filter(order =>
    filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'quoted': return 'bg-red-100 text-[#0d5a8a]';
      case 'confirmed': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'quoted': return <FileText className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Sales Orders & Quotes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 ">
            Manage draft orders, quotes, and convert them to sales
          </p>
        </div>
        {openSaleForm && (
          <button
            onClick={() => openSaleForm && openSaleForm()}
            className="bg-gradient-to-r from-[#1973AE] to-[#0d5a8a] text-sm md:text-xl  text-white px-3 py-2 rounded-lg font-medium hover:from-[#0d5a8a] hover:to-[#094a73] transition-all duration-200 flex items-center"
          >
            <Plus className="h-5 w-8 mr-2" />
            New Sale
          </button>
        )}
      </div>

      {/* Status Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Orders' },
            { key: 'draft', label: 'Drafts' },
            { key: 'quoted', label: 'Quoted' },
            { key: 'confirmed', label: 'Confirmed' },
            { key: 'completed', label: 'Completed' },
            { key: 'cancelled', label: 'Cancelled' }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterStatus(filter.key as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                filterStatus === filter.key
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Orders ({filteredOrders.length})
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Order Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        Order #{order.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                      {order.valid_until && (
                        <div className="text-xs text-gray-400">
                          Valid until: {new Date(order.valid_until).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {order.customer_name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {order.customer_phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    TSh {order.total_amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#1973AE] hover:text-[#094a73] dark:text-[#5da3d5] dark:hover:text-[#7db3d9]"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {(order.status === 'draft' || order.status === 'quoted') && (
                        <>
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {filterStatus === 'all'
                ? 'Get started by creating your first sales order.'
                : `No ${filterStatus} orders found.`
              }
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order #{selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Order Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer</h3>
                    <p className="text-gray-700 dark:text-gray-300">{selectedOrder.customer_name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{selectedOrder.customer_phone}</p>
                    {selectedOrder.customer_email && (
                      <p className="text-gray-500 dark:text-gray-400">{selectedOrder.customer_email}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusIcon(selectedOrder.status)}
                      <span className="ml-1 capitalize">{selectedOrder.status}</span>
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Item {index + 1}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Quantity: {item.quantity} × TSh {item.unit_price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          TSh {item.total_amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Totals */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="text-gray-900 dark:text-white">TSh {selectedOrder.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                      <span className="text-gray-900 dark:text-white">TSh {selectedOrder.tax_amount.toLocaleString()}</span>
                    </div>
                    {selectedOrder.discount_amount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                        <span className="text-red-600 dark:text-red-400">-TSh {selectedOrder.discount_amount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-700 pt-2">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-gray-900 dark:text-white">TSh {selectedOrder.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h3>
                    <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {selectedOrder.notes}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {(selectedOrder.status === 'draft' || selectedOrder.status === 'quoted') && (
                    <>
                      <button className="px-4 py-2 bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors">
                        Edit Order
                      </button>
                      <button className="px-4 py-2 bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors">
                        Convert to Sale
                      </button>
                      <button className="px-4 py-2 bg-[#1973AE] text-white rounded-lg hover:bg-[#0d5a8a] transition-colors">
                        Cancel Order
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesOrders;
