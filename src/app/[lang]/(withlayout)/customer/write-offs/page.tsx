import CustomerWriteOffs from '@/components/layout/customer/WriteOffs';

import React from 'react';
export const metadata = {
  title: 'Skattepluss | Write-Offs',
  description:
    'Manage and explore various write-offs efficiently in Skattepluss. Add, edit, and track write-offs with ease.',
};

function WriteOffs() {
  return (
    <>
      <CustomerWriteOffs />
    </>
  );
}

export default WriteOffs;
