import React from 'react';
import { X, Smartphone, Headphones, Laptop } from 'lucide-react';

interface Category {
  id: number;
  name: string;
  description?: string;
}

interface CategorySelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory: (category: Category) => void;
  categories: Category[];
}

const CategorySelectionModal: React.FC<CategorySelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
  categories,
}) => {
  if (!isOpen) return null;

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('phone')) return Smartphone;
    if (name.includes('computer') || name.includes('laptop')) return Laptop;
    return Headphones;
  };

  const getCategoryColor = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('phone')) return 'from-blue-500 to-blue-600';
    if (name.includes('computer') || name.includes('laptop')) return 'from-purple-500 to-purple-600';
    return 'from-green-500 to-green-600';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Select Product Category
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                Choose the category for your new product
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Category Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              const colorClass = getCategoryColor(category.name);
              
              return (
                <button
                  key={category.id}
                  onClick={() => onSelectCategory(category)}
                  className="group relative bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl p-6 hover:border-[#1973AE] dark:hover:border-[#5da3d5] transition-all duration-200 hover:shadow-xl transform hover:-translate-y-1"
                >
                  <div className={`w-16 h-16 mx-auto bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">
                    {category.name}
                  </h3>
                  {category.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                      {category.description}
                    </p>
                  )}
                </button>
              );
            })}
          </div>

          {/* Cancel Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySelectionModal;
