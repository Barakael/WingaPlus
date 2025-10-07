import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/Auth/LoginForm';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
// QR-related components removed (scanner, generator, product selection) as sales no longer depend on QR codes
import SaleForm from './components/Sales/SaleForm';
import SalesReport from './components/Sales/SalesReport';
import WarrantyFiling from './components/Warranties/WarrantyFiling';
import WarrantyView from './components/Warranties/WarrantyView';
import Reports from './components/Reports/Reports';
import SalesmanSales from './components/Sales/SalesmanSales';
import ProductManagement from './components/Products/ProductManagement';
import SalesOrders from './components/Sales/SalesOrders';
import CommissionTracking from './components/Sales/CommissionTracking';
import TargetManagement from './components/Sales/TargetManagement';
import Settings from './components/Common/Settings';

// Placeholder components for missing pages
const ShopsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Shops Management</h1><p>Coming soon...</p></div>;
const UsersPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p>Coming soon...</p></div>;
const StaffPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Staff Management</h1><p>Coming soon...</p></div>;
const InventoryPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1><p>Coming soon...</p></div>;
const StockMovementsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Stock Movements</h1><p>Coming soon...</p></div>;

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  // Generic Sale Form control (decoupled from QR scanning)
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [salePrefill, setSalePrefill] = useState<any>(null);

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
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onTabChange={setActiveTab} />;
      // 'qr-scanner' route removed
      case 'shops':
        return <ShopsPage />;
      case 'users':
        return <UsersPage />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <div className="p-6"><h1 className="text-2xl font-bold">Categories (QR Disabled)</h1><p>QR generation has been disabled.</p></div>;
      case 'sales':
        return <SalesReport />;
      case 'staff':
        return <StaffPage />;
      case 'warranties':
        return <WarrantyView onFileWarranty={() => setActiveTab('file-warranty')} openSaleForm={openSaleForm} />;
      case 'file-warranty':
        return <WarrantyFiling onBack={() => setActiveTab('warranties')} />;
      case 'reports':
        return <Reports />;
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
      case 'targets':
        return <TargetManagement />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
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
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;