import SignUp from '@/components/layout/auth/SignUp';
import React from 'react';
export const metadata = {
  title: 'Skattepluss Sign Up Page',
};

const ProtectedPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default ProtectedPage;
