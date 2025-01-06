import React from 'react';
import ResetPasswordComponent from '@/components/layout/auth/ResetPassword';

export const metadata = {
  title: 'Skattepluss | Reset password',
  description: 'Reset your password in Skattepluss, it is easy and secure',
};
export default function ResetPassword() {
  return (
    <div>
      <ResetPasswordComponent />
    </div>
  );
}
