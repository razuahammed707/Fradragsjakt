import React from 'react';
import ForgotPasswordComponent from '@/components/layout/auth/ForgotPassword';
export const metadata = {
  title: 'Skattepluss |Forgot Password',
  description: 'Forgot password in Skattepluss? no worries, reset it here',
};
export default function ForgotPassword() {
  return (
    <div>
      <ForgotPasswordComponent />
    </div>
  );
}
