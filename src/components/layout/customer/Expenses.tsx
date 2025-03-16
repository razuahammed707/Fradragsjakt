import React from 'react';
import ProtectedLayout from '../ProtectedLayout';
import ExpenseOverviewSection from './components/expenses/ExpenseOverviewSection';

const CustomerExpenses: React.FC = () => {
  return (
    <ProtectedLayout>
      <ExpenseOverviewSection />
    </ProtectedLayout>
  );
};

export default CustomerExpenses;
