import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginForm from './components/Auth/LoginForm';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import QRScanner from './components/QRCode/QRScanner';
import QRCodeGenerator from './components/QRCode/QRCodeGenerator';
import ProductSelectionModal from './components/QRCode/ProductSelectionModal';
import SaleForm from './components/Sales/SaleForm';
import SalesReport from './components/Sales/SalesReport';
import WarrantyFiling from './components/Warranties/WarrantyFiling';
import Reports from './components/Reports/Reports';
import SalesmanSales from './components/Sales/SalesmanSales';
import ProductManagement from './components/Products/ProductManagement';

// Placeholder components for missing pages
const ShopsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Shops Management</h1><p>Coming soon...</p></div>;
const UsersPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Users Management</h1><p>Coming soon...</p></div>;
const StaffPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Staff Management</h1><p>Coming soon...</p></div>;
const InventoryPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1><p>Coming soon...</p></div>;
const StockMovementsPage = () => <div className="p-6"><h1 className="text-2xl font-bold">Stock Movements</h1><p>Coming soon...</p></div>;

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scannedQR, setScannedQR] = useState<string | null>(null);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductSelection, setShowProductSelection] = useState(false);

  const handleQRScan = (qrCode: string) => {
    setScannedQR(qrCode);
    setShowProductSelection(true);
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setShowProductSelection(false);
    setShowSaleForm(true);
  };

  const handleSaleComplete = (saleData: any) => {
    console.log('Sale completed:', saleData);
    setShowSaleForm(false);
    setScannedQR(null);
    // Here you would typically save the sale to your database
    alert('Sale completed successfully!');
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
        return <Dashboard />;
      case 'qr-scanner':
        return <QRScanner onScan={handleQRScan} />;
      case 'shops':
        return <ShopsPage />;
      case 'users':
        return <UsersPage />;
      case 'products':
        return <ProductManagement />;
      case 'categories':
        return <QRCodeGenerator />;
      case 'sales':
        return <SalesReport />;
      case 'staff':
        return <StaffPage />;
      case 'warranties':
        return <WarrantyFiling />;
      case 'reports':
        return <Reports />;
      case 'inventory':
        return <InventoryPage />;
      case 'stock-movements':
        return <StockMovementsPage />;
      case 'my-sales':
        return <SalesmanSales />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
      
      {showSaleForm && scannedQR && selectedProduct && (
        <SaleForm
          qrCode={scannedQR}
          selectedProduct={selectedProduct}
          onClose={() => {
            setShowSaleForm(false);
            setScannedQR(null);
            setSelectedProduct(null);
          }}
          onSale={handleSaleComplete}
        />
      )}

      {showProductSelection && scannedQR && (
        <ProductSelectionModal
          isOpen={showProductSelection}
          qrCode={scannedQR}
          onProductSelect={handleProductSelect}
          onClose={() => {
            setShowProductSelection(false);
            setScannedQR(null);
          }}
        />
      )}
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