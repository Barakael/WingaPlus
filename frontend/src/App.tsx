import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/Auth/LoginForm';
import ShopSetup from './components/Shop/ShopSetup';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
// QR-related components removed (scanner, generator, product selection) as sales no longer depend on QR codes
import SaleForm from './components/Sales/SaleForm';
import SalesReport from './components/Sales/SalesReport';
import WarrantyFiling from './components/Warranties/WarrantyFiling';
import WarrantyView from './components/Warranties/WarrantyView';
import ServiceFiling from './components/Services/ServiceFiling';
import ServiceView from './components/Services/ServiceView';
import Reports from './components/Reports/Reports';
import SalesmanSales from './components/Sales/SalesmanSales';
import ProductManagement from './components/Products/ProductManagement';
import SalesOrders from './components/Sales/SalesOrders';
import CommissionTracking from './components/Sales/CommissionTracking';
import TargetManagement from './components/Sales/TargetManagement';
import Settings from './components/Common/Settings';
import ShopsManagement from './components/SuperAdmin/ShopsManagement';
import UsersManagement from './components/SuperAdmin/UsersManagement';
import SystemReports from './components/SuperAdmin/SystemReports';

// Page labels for breadcrumbs
const pageLabels: Record<string, string> = {
  'dashboard': 'Dashboard',
  'shops': 'Shops',
  'users': 'Users',
  'products': 'Products',
  'categories': 'Categories',
  'sales': 'Sales Report',
  'staff': 'Staff',
  'warranties': 'Warranties',
  'file-warranty': 'File Warranty',
  'services': 'Services',
  'file-service': 'File Service',
  'reports': 'Reports',
  'inventory': 'Inventory',
  'stock-movements': 'Stock Movements',
  'my-sales': 'My Sales',
  'sales-orders': 'Sales Orders',
  'commissions': 'Commissions',
  'winga': 'Winga',
  'targets': 'Targets',
  'settings': 'Settings',
};

// Placeholder components for missing pages
const StaffPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Staff Management</h1><p>Coming soon...</p></div>;
const InventoryPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1><p>Coming soon...</p></div>;
const StockMovementsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Stock Movements</h1><p>Coming soon...</p></div>;

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Generic Sale Form control (decoupled from QR scanning)
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [salePrefill, setSalePrefill] = useState<any>(null);

  // Handle browser back/forward navigation
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state?.page) {
        setActiveTab(event.state.page);
      }
    };

    // Initialize history state
    if (!window.history.state) {
      window.history.replaceState({ page: 'dashboard' }, '', '');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Navigate to a new page
  const navigateToPage = (page: string) => {
    // Don't add to history if it's the same page
    if (page === activeTab) return;

    setActiveTab(page);
    
    // Push to browser history
    window.history.pushState({ page }, '', '');
  };

  // Generate breadcrumbs from current page
  const getBreadcrumbs = () => {
    const breadcrumbs: Array<{ label: string; path: string }> = [];
    
    // Don't show breadcrumb on dashboard
    if (activeTab === 'dashboard') {
      return [];
    }

    // Add current page
    breadcrumbs.push({
      label: pageLabels[activeTab] || activeTab,
      path: activeTab
    });

    return breadcrumbs;
  };

  // Removed QR-specific state & handlers

  // New generic opening function to be passed to pages
  const openSaleForm = (prefill?: any, onComplete?: () => void) => {
    setSalePrefill(prefill || null);
    setShowSaleForm(true);
    // Store the completion callback
    (window as any).saleCompleteCallback = onComplete;
  };

  const handleSaleComplete = (saleData: any) => {
    console.log('Sale completed:', saleData);
    setShowSaleForm(false);
    setSalePrefill(null);
    
    // Call the completion callback if provided, otherwise just close the modal
    if ((window as any).saleCompleteCallback) {
      (window as any).saleCompleteCallback();
      (window as any).saleCompleteCallback = null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1973AE] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  // Redirect shop owners without a shop to setup
  const needsShopSetup = user?.role === 'shop_owner' && localStorage.getItem('needs_shop_setup') === 'true';
  if (needsShopSetup && activeTab !== 'shop-setup') {
    // Force wizard page
    return <ShopSetup />;
  }

  const renderContent = () => {
    // Check if this is a shop owner accessing a specific tab
    const shopOwnerTabs = ['dashboard', 'products', 'sales', 'staff', 'warranties', 'reports', 'settings'];
    if (user?.role === 'shop_owner' && shopOwnerTabs.includes(activeTab)) {
      return <Dashboard activeTab={activeTab} onTabChange={navigateToPage} />;
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard activeTab={activeTab} onTabChange={navigateToPage} />;
      case 'shop-setup':
        return <ShopSetup />;
      // 'qr-scanner' route removed
      case 'shops':
        return <ShopsManagement />;
      case 'users':
        return <UsersManagement />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <div className="p-6"><h1 className="text-2xl font-bold">Categories (QR Disabled)</h1><p>QR generation has been disabled.</p></div>;
      case 'sales':
        return <SalesReport />;
      case 'staff':
        return <StaffPage />;
      case 'warranties':
        return <WarrantyView onFileWarranty={() => navigateToPage('file-warranty')} openSaleForm={openSaleForm} />;
      case 'file-warranty':
        return <WarrantyFiling onBack={() => window.history.back()} />;
      case 'services':
        return <ServiceView onFileService={() => navigateToPage('file-service')} />;
      case 'file-service':
        return <ServiceFiling onBack={() => window.history.back()} />;
      case 'reports':
        // Use SystemReports for super_admin, Reports for others
        return user?.role === 'super_admin' ? <SystemReports /> : <Reports />;
      case 'inventory':
        return <InventoryPage />;
      case 'stock-movements':
        return <StockMovementsPage />;
      case 'my-sales':
        return <SalesmanSales openSaleForm={openSaleForm} />;
      case 'sales-orders':
        return <SalesOrders openSaleForm={openSaleForm} />;
      case 'commissions':
        return <CommissionTracking />;
      case 'winga':
        // Shop owner's personal sales tracking and commissions
        return <SalesmanSales openSaleForm={openSaleForm} />;
      case 'targets':
        return <TargetManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard activeTab={activeTab} onTabChange={navigateToPage} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      onTabChange={navigateToPage}
      breadcrumbs={getBreadcrumbs()}
    >
      {renderContent()}
      
      {showSaleForm && (
        <SaleForm
          prefill={salePrefill}
          onClose={() => {
            setShowSaleForm(false);
            setSalePrefill(null);
          }}
          onSale={handleSaleComplete}
        />
      )}

      {/* QR product selection modal removed */}
    </Layout>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Toaster 
          position="top-center"
          reverseOrder={false}
          gutter={8}
          containerStyle={{
            top: 20,
          }}
          toastOptions={{
            // Default options for all toasts
            duration: 4000,
            style: {
              background: '#1973AE',
              color: '#fff',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              boxShadow: '0 10px 25px rgba(25, 115, 174, 0.3)',
              maxWidth: '90vw',
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
