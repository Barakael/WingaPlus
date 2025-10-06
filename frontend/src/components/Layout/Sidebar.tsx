import React from 'react';
import {
  Home,
  Store,
  Users,
  Package,
  ShoppingCart,
  BarChart3,
  Shield,
  Warehouse,
  X,
  FileText,
  DollarSign,
  Target
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeTab, onTabChange }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user?.role) {
      case 'super_admin':
        return [
          ...baseItems,
          { id: 'shops', label: 'Shops', icon: Store },
          { id: 'users', label: 'Users', icon: Users },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
        ];
      case 'shop_owner':
        return [
          ...baseItems,
          { id: 'products', label: 'Products', icon: Package },
          // Categories (QR) removed to decouple sales from QR codes
          { id: 'sales', label: 'Sales', icon: ShoppingCart },
          { id: 'staff', label: 'Staff', icon: Users },
          { id: 'warranties', label: 'Warranties', icon: Shield },
          { id: 'reports', label: 'Reports', icon: BarChart3 },
        ];
      case 'salesman':
        return [
          ...baseItems,
          { id: 'my-sales', label: 'My Sales', icon: ShoppingCart },
          { id: 'sales-orders', label: 'Sales Orders', icon: FileText },
          { id: 'commissions', label: 'Commissions', icon: DollarSign },
          { id: 'targets', label: 'Targets', icon: Target },
          { id: 'warranties', label: 'Warranties', icon: Shield },
        ];
      case 'storekeeper':
        return [
          ...baseItems,
          { id: 'inventory', label: 'Inventory', icon: Warehouse },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'stock-movements', label: 'Stock Movements', icon: BarChart3 },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Overlay only on mobile, below navbar (navbar height ~64px -> top-16) */}
      {isOpen && (
        <div
          className="fixed inset-x-0 top-16 bottom-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container: off-canvas on mobile, fixed on all viewports (desktop keeps it visible) */}
      <aside
        role="navigation"
        aria-label="Sidebar"
        className={`
          fixed top-16 bottom-0 left-0 z-50 w-64 bg-gray-200 dark:bg-gray-800 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col h-[calc(100vh-4rem)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 px-4 overflow-y-auto flex-1 pb-4" aria-label="Main navigation">
          <ul className="space-y-2">
            {menuItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { onTabChange(item.id); onClose(); }}
                    className={`
                      w-full flex items-center px-4 py-3 text-left rounded-lg transition-all duration-200
                      ${isActive ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}
                    `}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;