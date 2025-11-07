import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Breadcrumb from './Breadcrumb';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  breadcrumbs: Array<{ label: string; path: string }>;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, breadcrumbs }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 right-0 z-30">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
      </div>
      
      <div className="flex pt-16"> {/* Add top padding to account for fixed navbar */}
        <Sidebar 
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeTab={activeTab}
          onTabChange={onTabChange} 
        />
        
        {/* Main Content */}
        <main className="flex-1 lg:ml-64 min-h-screen overflow-y-auto">
          {/* Breadcrumb */}
          {breadcrumbs.length > 0 && (
            <Breadcrumb items={breadcrumbs} onNavigate={onTabChange} />
          )}
          
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
