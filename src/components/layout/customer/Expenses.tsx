'use client';

import React, { useState } from 'react';

import ProtectedLayout from '../ProtectedLayout';
import ExpenseTopSection from './components/expenses/ExpenseTopSection';
import ExpenseOverviewSection from './components/expenses/ExpenseOverviewSection';
import { trpc } from '@/utils/trpc';

const CustomerExpenses: React.FC = () => {
  const [filterString, setFilterString] = useState<string>('');
  const { data: analytics } =
    trpc.expenses.getBusinessAndPersonalExpenseAnalytics.useQuery({
      expense_type: '',
      filterString,
    });

  console.log('analytics', analytics);
  return (
    <ProtectedLayout>
      <ExpenseTopSection filterString={filterString} />
      <ExpenseOverviewSection
        filterString={filterString}
        setFilterString={setFilterString}
      />
    </ProtectedLayout>
  );
};

export default CustomerExpenses;
