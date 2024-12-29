import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CompanyLogo from '@/components/CompanyLogo';

const ForgotPassword = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      {/* Company Logo */}
      <div className="mb-6">
        <CompanyLogo color="#5B52F9" height="32" width="152" />
      </div>
      {/* Form Card */}
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Forgot Password?
        </h2>
        <p className="text-sm text-gray-600 text-center mb-4">
          Enter your email address, and we’ll send you a link to reset your
          password.
        </p>
        <form>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="example@domain.com"
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white py-2"
            variant={'purple'}
          >
            Send reset link
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
