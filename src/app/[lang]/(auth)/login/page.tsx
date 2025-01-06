import Login from '@/components/layout/auth/Login';
import React from 'react';

export const metadata = {
  title: 'Skattepluss | Login Page',
  description: 'Login to Skattepluss, it is easy and secure',
};
const LoginPage = () => {
  return (
    <>
      <Login />
    </>
  );
};

export default LoginPage;
