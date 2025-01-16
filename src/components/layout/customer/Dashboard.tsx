import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import DashboardSummarySection from './components/dashboard/DashboardSummarySection';
import DashboardIncomeSummary from './components/dashboard/DashboardIncomeSummary';
import DashboardOverviewSection from './components/dashboard/DashboardOverviewSection';
import DashboardWelcomeModal from './components/dashboard/DashboardWelcomeModal';

const CustomerDashboard: React.FC = () => {
  return (
    <ProtectedLayout>
      <DashboardWelcomeModal />
      <DashboardSummarySection />
      <DashboardOverviewSection />
      <DashboardIncomeSummary />
    </ProtectedLayout>
  );
};

export default CustomerDashboard;
