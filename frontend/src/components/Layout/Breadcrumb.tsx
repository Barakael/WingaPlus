import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (path: string) => void;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, onNavigate }) => {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center space-x-2 text-sm">
        {/* Home Icon */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center text-gray-500 hover:text-[#1973AE] dark:text-gray-400 dark:hover:text-[#5da3d5] transition-colors"
          aria-label="Go to dashboard"
        >
          <Home className="h-4 w-4" />
        </button>

        {/* Breadcrumb Items */}
        {items.map((item, index) => (
          <React.Fragment key={item.path}>
            <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            {index === items.length - 1 ? (
              // Current page - not clickable
              <span className="font-medium text-[#1973AE] dark:text-[#5da3d5]">
                {item.label}
              </span>
            ) : (
              // Previous pages - clickable
              <button
                onClick={() => onNavigate(item.path)}
                className="text-gray-600 hover:text-[#1973AE] dark:text-gray-400 dark:hover:text-[#5da3d5] transition-colors"
              >
                {item.label}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
};

export default Breadcrumb;
