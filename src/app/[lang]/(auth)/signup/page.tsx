import SignUp from '@/components/layout/auth/SignUp';
import React from 'react';
export const metadata = {
  title: 'Skattepluss | Sign Up ',
  description: 'Sign up to Skattepluss, the best tax management platform',
};

const ProtectedPage = () => {
  return (
    <>
      <SignUp />
    </>
  );
};

export default ProtectedPage;
