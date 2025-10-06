import React from 'react';
import { Menu, Moon, Sun, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="bg-gray-200 dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 dark:text-white hover:bg-white/20 lg:text-gray-600 lg:dark:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center ml-4 lg:ml-0">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-gray-300 dark:bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center lg:bg-gradient-to-r lg:from-blue-500 lg:to-purple-600">
                  <span className="text-gray-600 dark:text-white font-bold text-sm lg:text-white">WP</span>
                </div>
              </div>
              <div className="ml-1">
                <h1 className="text-xl font-bold text-gray-600 dark:text-white lg:text-gray-900 lg:dark:text-white">
                  WingaPlus
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-gray-600 dark:text-white hover:bg-white/20 lg:text-gray-600 lg:dark:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700 transition-colors"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <div className="flex items-center space-x-1">
              <div className="hidden sm:flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600 dark:text-white lg:text-gray-600 lg:dark:text-gray-300" />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-white lg:text-gray-900 lg:dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-white/80 lg:text-gray-500 lg:dark:text-gray-400 capitalize">
                    {user?.role && typeof user.role === 'string' ? user.role.replace('_', ' ') : 'Role'}
                  </p>
                </div>
              </div>

              <button
                onClick={logout}
                className="p-2 rounded-md text-gray-700 dark:text-gray-100 hover:bg-white/20 lg:text-gray-600 lg:dark:text-gray-300 lg:hover:bg-gray-100 lg:dark:hover:bg-gray-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;