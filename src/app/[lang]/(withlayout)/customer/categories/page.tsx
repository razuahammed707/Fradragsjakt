import CustomerCategories from '@/components/layout/customer/Categories';

import React from 'react';

export const metadata = {
  title: 'Skattepluss | Categories',
  description:
    'Manage and explore various categories efficiently in Skattepluss. Add, edit, and track categories with ease.',
};

function Categories() {
  return (
    <>
      <CustomerCategories />
    </>
  );
}

export default Categories;
