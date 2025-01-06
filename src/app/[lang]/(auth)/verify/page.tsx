import VerifyEmail from '@/components/layout/auth/VerifyEmail';
import React from 'react';
export const metadata = {
  title: 'Skattepluss | Verify Email ',
  description:
    'Verify your email to access Skattepluss, the best tax management platform',
};
const EmailVerificationPage = () => {
  return (
    <>
      <VerifyEmail />
    </>
  );
};

export default EmailVerificationPage;
