import React from 'react';
import { Store, Users } from 'lucide-react';

interface DashboardTabSwitcherProps {
  activeMode: 'shop' | 'salesman';
  onModeChange: (mode: 'shop' | 'salesman') => void;
}

const DashboardTabSwitcher: React.FC<DashboardTabSwitcherProps> = ({ activeMode, onModeChange }) => {
  return (
    <div className="flex items-center gap-2 px-2 sm:px-4 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-md">
      {/* Shop Button */}
      <button
        onClick={() => onModeChange('shop')}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
          activeMode === 'shop'
            ? 'bg-[#1973AE] text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
        }`}
        title="Shop Dashboard"
      >
        <Store className="h-4 w-4 flex-shrink-0" />
        <span className="hidden sm:inline">Shop</span>
      </button>

      {/* Winga Button */}
      <button
        onClick={() => onModeChange('salesman')}
        className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm ${
          activeMode === 'salesman'
            ? 'bg-[#1973AE] text-white shadow-lg'
            : 'bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
        }`}
        title="Winga Dashboard"
      >
        <Users className="h-4 w-4 flex-shrink-0" />
        <span className="hidden sm:inline">Winga</span>
      </button>
    </div>
  );
};

export default DashboardTabSwitcher;
