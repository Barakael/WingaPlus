import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import ShopOwnerDashboard from './ShopOwnerDashboard';
import SalesmanDashboard from './SalesmanDashboard';
import StorekeeperDashboard from './StorekeeperDashboard';

interface DashboardProps {
  onTabChange?: (tab: string) => void;
}

interface ExtendedDashboardProps extends DashboardProps {
  activeTab?: string;
}

const Dashboard: React.FC<ExtendedDashboardProps> = ({ onTabChange, activeTab }) => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'shop_owner':
      return <ShopOwnerDashboard activeTab={activeTab} onTabChange={onTabChange} />;
    case 'salesman':
      return <SalesmanDashboard onTabChange={onTabChange} />;
    case 'storekeeper':
      return <StorekeeperDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
};

export default Dashboard;
