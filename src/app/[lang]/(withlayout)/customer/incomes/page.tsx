import React from 'react';
import CustomerIncomes from '@/components/layout/customer/Incomes';
export const metadata = {
  title: 'Skattepluss | Income',
  description:
    'Manage and explore various incomes efficiently in Skattepluss. Add, edit, and track income with ease.',
};
function ExpensePage() {
  return <CustomerIncomes />;
}

export default ExpensePage;
