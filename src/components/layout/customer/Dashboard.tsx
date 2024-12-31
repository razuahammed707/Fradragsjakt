import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import DashboardSummarySection from './components/dashboard/DashboardSummarySection';
import DashboardIncomeSummary from './components/dashboard/DashboardIncomeSummary';
import DashboardOverviewSection from './components/dashboard/DashboardOverviewSection';

const CustomerDashboard: React.FC = () => {
  return (
    <ProtectedLayout>
      <DashboardSummarySection />
      <DashboardOverviewSection />
      <DashboardIncomeSummary />
    </ProtectedLayout>
  );
};

export default CustomerDashboard;
