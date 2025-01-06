import CustomerRules from '@/components/layout/customer/Rules';

import React from 'react';
export const metadata = {
  title: 'Skattepluss | Rules',
  description:
    'Manage and explore various rules efficiently in Skattepluss. Add, edit, and track rules with ease.',
};
function Rules() {
  return (
    <>
      <CustomerRules />
    </>
  );
}

export default Rules;
