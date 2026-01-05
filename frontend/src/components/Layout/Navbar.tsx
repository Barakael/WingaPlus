import React from 'react';
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { getRoleDisplayName } from '../../lib/roleMapping';
import DashboardTabSwitcher from './DashboardTabSwitcher';

interface NavbarProps {
  onMenuClick: () => void;
  dashboardMode?: 'shop' | 'salesman';
  onDashboardModeChange?: (mode: 'shop' | 'salesman') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, dashboardMode = 'shop', onDashboardModeChange }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const isShopOwner = user?.role === 'shop_owner';

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-2">
          <div className="flex items-center min-w-0">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 dark:text-white hover:bg-white/20 lg:text-gray-600 lg:dark:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700 flex-shrink-0"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center ml-2 lg:ml-0 flex-shrink-0">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 backdrop-blur-sm rounded-lg flex items-center justify-center bg-[#1973AE]">
                  <span className="text-white dark:text-white font-bold text-sm lg:text-white">WP</span>
                </div>
              </div>
              <div className="ml-1 hidden sm:block">
                <h1 className="text-xl font-bold text-[#1973AE] dark:text-[#1973AE] lg:text-gray-900 lg:dark:text-white whitespace-nowrap">
                  WingaPro
                </h1>
              </div>
            </div>
          </div>

          {/* Dashboard Tab Switcher for Shop Owners - Mobile */}
          {isShopOwner && (
            <div className="md:hidden">
              <DashboardTabSwitcher 
                activeMode={dashboardMode} 
                onModeChange={(mode) => {
                  onDashboardModeChange?.(mode);
                }}
              />
            </div>
          )}

          {/* Dashboard Tab Switcher for Shop Owners - Desktop */}
          {isShopOwner && (
            <div className="hidden md:block flex-shrink-0">
              <DashboardTabSwitcher 
                activeMode={dashboardMode} 
                onModeChange={(mode) => {
                  onDashboardModeChange?.(mode);
                }}
              />
            </div>
          )}

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-white hover:bg-white/20 lg:text-gray-600 lg:dark:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="hidden sm:flex items-center space-x-1 sm:space-x-2">
              <User className="h-5 w-5 text-gray-600 dark:text-white lg:text-gray-600 lg:dark:text-gray-300 flex-shrink-0" />
              <div className="hidden sm:block min-w-0">
                <p className="text-sm font-medium text-white lg:text-gray-900 lg:dark:text-white truncate">
                  {user?.role === 'shop_owner' && user?.owned_shop?.name 
                    ? `${user.owned_shop.name}'s Owner` 
                    : user?.name}
                </p>
                <p className="text-xs text-white/80 lg:text-gray-500 lg:dark:text-gray-400 capitalize">
                  {user?.role && typeof user.role === 'string' ? getRoleDisplayName(user.role) : 'Role'}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-md text-gray-700 dark:text-gray-100 hover:bg-white/20 lg:text-gray-600 lg:dark:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
