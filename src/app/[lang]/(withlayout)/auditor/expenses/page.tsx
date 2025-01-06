import React from 'react';
import CustomerExpenses from '@/components/layout/customer/Expenses';
export const metadata = {
  title: 'Skattepluss | Expense ',
  description:
    'Manage and explore various expenses efficiently in Skattepluss. Audit expenses with ease.',
};
function ExpensePage() {
  return <CustomerExpenses />;
}

export default ExpensePage;
