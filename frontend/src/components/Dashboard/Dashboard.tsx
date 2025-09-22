import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import SuperAdminDashboard from './SuperAdminDashboard';
import ShopOwnerDashboard from './ShopOwnerDashboard';
import SalesmanDashboard from './SalesmanDashboard';
import StorekeeperDashboard from './StorekeeperDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'shop_owner':
      return <ShopOwnerDashboard />;
    case 'salesman':
      return <SalesmanDashboard />;
    case 'storekeeper':
      return <StorekeeperDashboard />;
    default:
      return <div>Invalid user role</div>;
  }
};

export default Dashboard;