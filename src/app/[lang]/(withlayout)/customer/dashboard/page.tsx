import CustomerDashboard from '@/components/layout/customer/Dashboard';
import React from 'react';
export const metadata = {
  title: 'Skattepluss |  Dashboard',
  description: 'Manage and explore dashboard efficiently in Skattepluss',
};

function Dashboard() {
  return (
    <>
      <CustomerDashboard />
    </>
  );
}

export default Dashboard;
