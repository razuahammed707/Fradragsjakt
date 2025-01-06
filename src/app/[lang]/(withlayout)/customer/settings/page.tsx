import CustomerSettings from '@/components/layout/customer/Settings';
import React from 'react';
export const metadata = {
  title: 'Skattepluss | Settings',
  description: 'Manage and explore settings efficiently in Skattepluss',
};

function Settings() {
  return (
    <>
      <CustomerSettings />
    </>
  );
}

export default Settings;
