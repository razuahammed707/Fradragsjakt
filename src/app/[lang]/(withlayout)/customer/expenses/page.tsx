import React from 'react';
import CustomerExpenses from '@/components/layout/customer/Expenses';
export const metadata = {
  title: 'Skattepluss | Expenses',
  description:
    'Manage and explore various expenses efficiently in Skattepluss. Add, edit, and track expenses with ease.',
};
function ExpensePage() {
  return <CustomerExpenses />;
}

export default ExpensePage;
