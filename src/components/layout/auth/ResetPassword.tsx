import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import CompanyLogo from '@/components/CompanyLogo';

const ResetPassword = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <div className="mb-6">
        <CompanyLogo color="#5B52F9" height="32" width="152" />
      </div>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form>
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block text-sm font-medium text-gray-700"
            >
              New password
            </label>
            <Input
              id="new-password"
              type="password"
              placeholder="type here"
              className="mt-1"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="confirm-password"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm new password
            </label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="type here"
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            className="w-full text-white py-2"
            variant={'purple'}
          >
            Reset password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
