import React, { useEffect, useState, useRef } from 'react';
import { X, Save, Image as ImageIcon, Smartphone, Laptop, Headphones } from 'lucide-react';
import { BASE_URL } from '../../api/api';
import { showSuccessToast, showErrorToast } from '../../../lib/toast';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  selectedCategory: Category;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  selectedCategory,
}) => {
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    category_id: selectedCategory.id.toString(),
    description: '',
    stock_quantity: 0,
    min_stock_level: 5,
    cost_price: 0,
    price: 0,
    image_url: '',
    source: '',
    imei: '',
    ram: '',
    color: '',
    storage: '',
  });

  const categoryName = selectedCategory.name.toLowerCase();
  const isPhones = categoryName.includes('phone');
  const isComputers = categoryName.includes('computer') || categoryName.includes('laptop');
  // const isAccessories = !isPhones && !isComputers; // reserved for future use

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        category_id: selectedCategory.id.toString(),
        description: '',
        stock_quantity: 0,
        min_stock_level: 5,
        cost_price: 0,
        price: 0,
        image_url: '',
        source: '',
        imei: '',
        ram: '',
        color: '',
        storage: '',
      });
      setImagePreview('');
    }
  }, [isOpen, selectedCategory.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        category_id: parseInt(formData.category_id),
        stock_quantity: parseInt(formData.stock_quantity.toString()),
        min_stock_level: parseInt(formData.min_stock_level.toString()),
        cost_price: parseFloat(formData.cost_price.toString()),
        price: parseFloat(formData.price.toString()),
      };

      const response = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create product');
      }

      showSuccessToast('Product created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        category_id: selectedCategory.id.toString(),
        description: '',
        stock_quantity: 0,
        min_stock_level: 5,
        cost_price: 0,
        price: 0,
        image_url: '',
        source: '',
        imei: '',
        ram: '',
        color: '',
        storage: '',
      });
      setImagePreview('');
      
      onSuccess();
    } catch (err) {
      console.error('Error creating product:', err);
      showErrorToast(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData({ ...formData, image_url: `uploaded_${file.name}` });
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: '',
        category_id: selectedCategory.id.toString(),
        description: '',
        stock_quantity: 0,
        min_stock_level: 5,
        cost_price: 0,
        price: 0,
        image_url: '',
        source: '',
        imei: '',
        ram: '',
        color: '',
        storage: '',
      });
      setImagePreview('');
      onClose();
    }
  };

  const getCategoryIcon = () => {
    if (isPhones) return Smartphone;
    if (isComputers) return Laptop;
    return Headphones;
  };

  const getCategoryColor = () => {
    if (isPhones) return 'from-blue-500 to-blue-600';
    if (isComputers) return 'from-purple-500 to-purple-600';
    return 'from-green-500 to-green-600';
  };

  const Icon = getCategoryIcon();
  const colorClass = getCategoryColor();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-4">
          {/* Header with Category Banner */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center flex-1">
              <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center mr-3`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  New {selectedCategory.name} Product
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-xs">
                  Add to inventory
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
              disabled={loading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Product Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Product Name */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={loading}
                placeholder={isPhones ? "e.g., iPhone 15 Pro" : isComputers ? "e.g., HP Laptop 15s" : "e.g., Phone Case"}
              />
            </div>

            {/* Source (optional for all) */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Source (Optional)
              </label>
              <input
                type="text"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
                placeholder="e.g., Supplier name, Store location"
              />
            </div>

            {/* Category-Specific Fields */}
            {isPhones && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700/50 space-y-3">
                <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Phone Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      IMEI <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.imei}
                      onChange={(e) => setFormData({ ...formData, imei: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={isPhones}
                      disabled={loading}
                      placeholder="123456789012345"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={isPhones}
                      disabled={loading}
                      placeholder="e.g., Space Black"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Storage <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={isPhones}
                      disabled={loading}
                    >
                      <option value="">Select storage...</option>
                      <option value="64GB">64GB</option>
                      <option value="128GB">128GB</option>
                      <option value="256GB">256GB</option>
                      <option value="512GB">512GB</option>
                      <option value="1TB">1TB</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {isComputers && (
              <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700/50 space-y-3">
                <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100 flex items-center">
                  <Laptop className="h-4 w-4 mr-2" />
                  Computer/Laptop Details
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      RAM <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.ram}
                      onChange={(e) => setFormData({ ...formData, ram: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={isComputers}
                      disabled={loading}
                    >
                      <option value="">Select RAM...</option>
                      <option value="4GB">4GB</option>
                      <option value="8GB">8GB</option>
                      <option value="16GB">16GB</option>
                      <option value="32GB">32GB</option>
                      <option value="64GB">64GB</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Color <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={isComputers}
                      disabled={loading}
                      placeholder="e.g., Silver"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Storage <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.storage}
                      onChange={(e) => setFormData({ ...formData, storage: e.target.value })}
                      className="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      required={isComputers}
                      disabled={loading}
                    >
                      <option value="">Select storage...</option>
                      <option value="128GB SSD">128GB SSD</option>
                      <option value="256GB SSD">256GB SSD</option>
                      <option value="512GB SSD">512GB SSD</option>
                      <option value="1TB SSD">1TB SSD</option>
                      <option value="2TB SSD">2TB SSD</option>
                      <option value="500GB HDD">500GB HDD</option>
                      <option value="1TB HDD">1TB HDD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            {/* <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                disabled={loading}
                placeholder="Additional details about the product"
                rows={2}
              />
            </div> */}

            {/* Stock Quantity and Min Level - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Qty <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Min Level <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={formData.min_stock_level}
                  onChange={(e) => setFormData({ ...formData, min_stock_level: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Cost Price and Selling Price - 2 columns */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Cost Price (TSh)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.cost_price}
                  onChange={(e) => setFormData({ ...formData, cost_price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Selling Price (TSh) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-[#1973AE] focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Profit Margin Display */}
            {formData.cost_price > 0 && formData.price > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-700 dark:text-green-300 font-medium">Profit Margin:</span>
                  <span className="text-green-800 dark:text-green-200 font-bold">
                    TSh {new Intl.NumberFormat('en-TZ').format(formData.price - formData.cost_price)}
                    {' '}
                    ({(((formData.price - formData.cost_price) / formData.cost_price) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            )}

         
              {/* <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center"
                disabled={loading}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {imagePreview || formData.image_url ? 'Change Image' : 'Select Image'}
              </button>
               */}
              {/* Image Preview */}

            {/* Actions */}
            <div className="flex space-x-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors text-sm"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm"
              >
                {loading ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
