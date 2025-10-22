import React, { useState } from 'react';
import { Wrench, RefreshCw, Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { BASE_URL } from '../api/api';
import ViewServiceModal from './ViewServiceModal';
import EditServiceModal from './EditServiceModal';

interface ServiceViewProps {
  onFileService: () => void;
  openSaleForm?: (prefill?: any, onComplete?: () => void) => void;
}

const ServiceView: React.FC<ServiceViewProps> = ({ onFileService }) => {
  const { user } = useAuth();
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);

  // Fetch services
  const fetchServices = async () => {
    try {
      const salesmanId = user?.id;
      const url = salesmanId
        ? `${BASE_URL}/services?salesman_id=${salesmanId}`
        : `${BASE_URL}/services`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        // Our API wraps responses as { success, data: { data: [...], total: ... }, message }
        const servicesData = data?.data?.data ?? [];

        console.log('Fetched services:', servicesData);
        setServices(servicesData);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoadingServices(false);
    }
  };

  // Fetch services on component mount
  React.useEffect(() => {
    fetchServices();
  }, [user]); // Added user as dependency since it's used in fetchServices

  // Pagination logic
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedServices = services.slice(startIndex, endIndex);

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

  // Action handlers
  const handleViewService = (service: any) => {
    setSelectedService(service);
    setViewModalOpen(true);
  };

  const handleEditService = (service: any) => {
    setSelectedService(service);
    setEditModalOpen(true);
  };

  const handleDeleteService = async (service: any) => {
    if (!confirm(`Are you sure you want to delete the service for "${service.device_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/services/${service.id}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh services list
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Failed to delete service. Please try again.');
    }
  };

  // Modal handlers
  const handleCloseViewModal = () => {
    setViewModalOpen(false);
    setSelectedService(null);
  };

  const handleCloseEditModal = () => {
    setEditModalOpen(false);
    setSelectedService(null);
  };

  const calculateGanji = (service: any) => {
    return parseFloat(service.ganji) || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Service Management
          </h1>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mt-1">
            View and track device services
          </p>
        </div>
        <button
          onClick={onFileService}
          className="md:text-base text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center"
        >
          <Wrench className="h-4 w-4 mr-2" />
          File New Service
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 mb-4">
          <h2 className="md:text-lg font-bold text-gray-900 dark:text-white flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Service Records
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={fetchServices}
              disabled={loadingServices}
              className="flex items-center px-3 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${loadingServices ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Service Table */}
        <div>
          {loadingServices ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 text-sm">Loading services...</div>
          ) : services.length > 0 ? (
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-1 px-1 sm:py-2 sm:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px]">Date</th>
                  <th className="text-left py-1 px-1 sm:py-2 sm:px-2 font-semibold text-gray-900 dark:text-white min-w-[100px]">Device</th>
                  <th className="text-left py-1 px-1 sm:py-2 sm:px-2 font-semibold text-gray-900 dark:text-white min-w-[80px]">Ganji</th>
                  <th className="text-center py-1 px-1 sm:py-2 sm:px-2 font-semibold text-gray-900 dark:text-white min-w-[50px]">Actions</th>
                  <th className="text-left py-1 px-1 sm:py-2 sm:px-2 font-semibold text-gray-900 dark:text-white hidden sm:table-cell min-w-[80px]">Issue</th>
                  <th className="text-left py-1 px-1 sm:py-2 sm:px-2 font-semibold text-gray-900 dark:text-white hidden md:table-cell min-w-[70px]">Final Price</th>
                </tr>
              </thead>
              <tbody>
                {paginatedServices.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer transition-colors"
                    onClick={() => handleViewService(service)}
                  >
                    <td className="py-1 px-1 sm:py-2 sm:px-2 text-gray-900 dark:text-white">
                      <div className="text-xs sm:text-sm font-medium">
                        {service.service_date ? new Date(service.service_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="py-1 px-1 sm:py-2 sm:px-2 text-gray-900 dark:text-white">
                      <div className="font-medium text-xs sm:text-sm">{service.device_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {service.issue || 'No issue specified'}
                      </div>
                    </td>
                    <td className="py-1 px-1 sm:py-2 sm:px-2 text-gray-900 dark:text-white">
                      <div className={`text-xs sm:text-sm font-medium ${calculateGanji(service) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                         {calculateGanji(service).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-1 px-1 sm:py-2 sm:px-2 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditService(service);
                          }}
                          className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                          title="Edit Service"
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteService(service);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-1 px-1 sm:py-2 sm:px-2 text-gray-900 dark:text-white hidden sm:table-cell">
                      <div className="text-xs sm:text-sm truncate max-w-[120px]" title={service.issue}>
                        {service.issue || 'N/A'}
                      </div>
                    </td>
                    <td className="py-1 px-1 sm:py-2 sm:px-2 text-gray-900 dark:text-white hidden md:table-cell">
                      <div className="text-xs sm:text-sm font-medium">
                        TSh {(parseFloat(service.final_price) || 0).toLocaleString()}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No services filed yet
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                Start by filing your first service
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {services.length > 0 && totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(endIndex, services.length)} of {services.length} services
              </div>
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
                          ? 'bg-blue-500 text-white'
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
      <ViewServiceModal
        service={selectedService}
        isOpen={viewModalOpen}
        onClose={handleCloseViewModal}
      />
      <EditServiceModal
        service={selectedService}
        isOpen={editModalOpen}
        onClose={handleCloseEditModal}
        onUpdate={fetchServices}
      />
    </div>
  );
};

export default ServiceView;