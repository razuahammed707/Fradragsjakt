'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import CompanyLogo from '@/components/CompanyLogo';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import { trpc } from '@/utils/trpc';

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const mutation = trpc.auth.resetPassword.useMutation({
    onSuccess: (success) => {
      toast.success(success.message, { duration: 2000 });
      setIsSubmitting(false);
      router.push('/login');
    },
    onError: (error) => {
      toast.error(error.message, { duration: 4000 });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        setIsSubmitting(false);
        return;
      }

      if (!token) {
        toast.error('Reset token is missing');
        setIsSubmitting(false);
        return;
      }

      mutation.mutate({ password, token });
    } catch (error) {
      console.error('Error resetting password:', error);
      setIsSubmitting(false);
    }
  };

  const isButtonDisabled = !password || !confirmPassword || isSubmitting;
  const passwordMinLength = 6;
  const isPasswordLongEnough = password.length >= passwordMinLength;
  const doPasswordsMatch = password === confirmPassword;
  const shouldShowMatchIndicator =
    password.length > 0 && confirmPassword.length > 0;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="mb-6">
        <CompanyLogo color="#5B52F9" height="32" width="152" />
      </div>
      <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-md">
        <h2 className="text-2xl font-bold text-center mb-6">Reset Password</h2>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="relative">
            <Label
              htmlFor="password"
              className="block mb-2 text-xs font-medium"
            >
              Create new password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="relative">
            <Label
              htmlFor="confirmPassword"
              className="block mb-2 text-xs font-medium"
            >
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-1 text-xs text-gray-500">
            <h3 className="font-medium">
              Password must meet the following criteria:
            </h3>
            <ul className="list-disc pl-5">
              <li
                className={
                  isPasswordLongEnough ? 'text-green-600' : 'text-red-600'
                }
              >
                At least {passwordMinLength} characters
              </li>
            </ul>
          </div>

          {shouldShowMatchIndicator && (
            <div className="mt-2 text-xs">
              <p
                className={doPasswordsMatch ? 'text-green-600' : 'text-red-600'}
              >
                {doPasswordsMatch
                  ? 'Passwords match'
                  : 'Passwords do not match'}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isButtonDisabled || !doPasswordsMatch}
            className="w-full"
            variant="purple"
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
