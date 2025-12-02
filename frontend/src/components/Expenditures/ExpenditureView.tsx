import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, Search, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { listExpenditures, deleteExpenditure, Expenditure } from '../../services/expenditures';
import ViewExpenditureModal from './ViewExpenditureModal';
import EditExpenditureModal from './EditExpenditureModal';
import ExpenditureFiling from './ExpenditureFiling';
import { showSuccessToast, showErrorToast } from '../../lib/toast';

const ExpenditureView: React.FC = () => {
  const { user } = useAuth();
  const [expenditures, setExpenditures] = useState<Expenditure[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilingModal, setShowFilingModal] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedExpenditure, setSelectedExpenditure] = useState<Expenditure | null>(null);

  // Helper function to format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-TZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Fetch expenditures
  const fetchExpenditures = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await listExpenditures({ salesman_id: String(user.id) });
      setExpenditures(data);
    } catch (error) {
      console.error('Error fetching expenditures:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch expenditures on component mount
  useEffect(() => {
    fetchExpenditures();
  }, [user]);

  // Filter expenditures based on search query
  const filteredExpenditures = expenditures.filter(expenditure => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      expenditure.name?.toLowerCase().includes(query) ||
      expenditure.notes?.toLowerCase().includes(query) ||
      formatCurrency(expenditure.amount).toLowerCase().includes(query)
    );
  });

  // Calculate total expenditures
  const totalExpenditures = filteredExpenditures.reduce((sum, exp) => sum + Number(exp.amount), 0);

  // Pagination logic
  const totalPages = Math.ceil(filteredExpenditures.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedExpenditures = filteredExpenditures.slice(startIndex, endIndex);

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

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Action handlers
  const handleViewExpenditure = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    setViewModalOpen(true);
  };

  const handleEditExpenditure = (expenditure: Expenditure) => {
    setSelectedExpenditure(expenditure);
    setEditModalOpen(true);
  };

  const handleDeleteExpenditure = async (expenditure: Expenditure) => {
    if (window.confirm(`Are you sure you want to delete this expenditure?\n\nName: ${expenditure.name}\nAmount: TSh ${formatCurrency(expenditure.amount)}\nDate: ${new Date(expenditure.expenditure_date).toLocaleDateString()}\n\nThis action cannot be undone.`)) {
      try {
        setLoading(true);
        await deleteExpenditure(expenditure.id);
        
        // Remove the expenditure from local state
        setExpenditures(prev => prev.filter(e => e.id !== expenditure.id));
        
        showSuccessToast('✅ Expenditure deleted successfully!');
      } catch (error) {
        console.error('Error deleting expenditure:', error);
        const technicalError = error instanceof Error ? error.message : '';
        let userMessage = '❌ Could not delete expenditure. Please try again.';
        
        if (technicalError.includes('network') || technicalError.includes('fetch')) {
          userMessage = '📡 Connection problem. Check your internet and try again.';
        } else if (technicalError.includes('not found') || technicalError.includes('404')) {
          userMessage = '⚠️ Expenditure already deleted or not found.';
        }
        
        showErrorToast(userMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedExpenditure(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedExpenditure(null);
  };

  const handleExpenditureUpdated = (updatedExpenditure: Expenditure) => {
    // Update the expenditure in local state
    setExpenditures(prev => prev.map(e => e.id === updatedExpenditure.id ? updatedExpenditure : e));
  };

  const handleFilingSuccess = () => {
    fetchExpenditures();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg md:text-3xl font-bold text-gray-900 dark:text-white">
            Expenditures (Matumizi)
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            Track your spending and expenses
          </p>
        </div>
        <button
          onClick={() => setShowFilingModal(true)}
          className="md:text-sm text-xs bg-[#1973AE] text-white px-2 py-2 rounded-lg font-medium hover:bg-[#0d5a8a] transition-all duration-200 flex items-center"
        >
       
          New Expenditure
        </button>
      </div>

      {/* Total Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Expenditures</p>
            <p className="text-xl font-bold text-red-800 dark:text-red-400">
              TSh {formatCurrency(totalExpenditures)}
            </p>
          </div>
          <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
            <Wallet className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-3 mb-4">
          <h2 className="md:text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            Expenditure Records
          </h2>
          
          {/* Search and Refresh Row */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Bar */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, notes or amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
          </div>
        </div>

        {/* Expenditures Table */}
        <div>
          {loading ? (
            <div className="text-center py-4 lg:py-8 text-gray-500 dark:text-gray-400 text-xs lg:text-sm">Loading expenditures...</div>
          ) : filteredExpenditures.length > 0 ? (
            <table className="w-full text-xs md:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[70px] lg:min-w-[80px]">Date</th>
                  <th className="text-left py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[100px] lg:min-w-[120px]">Name</th>
                  <th className="text-right py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[100px]">Amount</th>
                  <th className="text-center py-2 px-1 lg:py-3 lg:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px] lg:min-w-[80px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedExpenditures.map((expenditure) => (
                  <tr 
                    key={expenditure.id} 
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    onClick={() => handleViewExpenditure(expenditure)}
                  >
                    <td className="py-2 px-1 lg:py-3 lg:px-2 text-gray-900 dark:text-white text-xs">
                      {new Date(expenditure.expenditure_date).toLocaleDateString('en-GB')}
                    </td>
                    <td className="py-2 px-1 lg:py-3 lg:px-2 text-gray-900 dark:text-white">
                      <div className="font-medium text-xs lg:text-sm">{expenditure.name}</div>
                    </td>
                    <td className="py-2 px-1 lg:py-3 lg:px-2 text-right font-semibold text-red-600 dark:text-red-400 font-mono text-xs lg:text-sm">
                      {formatCurrency(expenditure.amount)}
                    </td>
                    <td className="py-2 px-1 lg:py-3 lg:px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditExpenditure(expenditure);
                          }}
                          className="p-1 text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                          title="Edit Expenditure"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteExpenditure(expenditure);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                          title="Delete Expenditure"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <Wallet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'No expenditures found matching your search' : 'No expenditures recorded yet'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                {searchQuery ? 'Try adjusting your search terms' : 'Start by recording your first expenditure'}
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredExpenditures.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              {/* <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredExpenditures.length)} of {filteredExpenditures.length} expenditures
                {searchQuery && ` (filtered from ${expenditures.length} total)`}
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

      {/* Modals */}
      {showFilingModal && (
        <ExpenditureFiling
          onBack={() => setShowFilingModal(false)}
          onSuccess={handleFilingSuccess}
        />
      )}
      <ViewExpenditureModal
        expenditure={selectedExpenditure}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
      <EditExpenditureModal
        expenditure={selectedExpenditure}
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onExpenditureUpdated={handleExpenditureUpdated}
      />
    </div>
  );
};

export default ExpenditureView;


