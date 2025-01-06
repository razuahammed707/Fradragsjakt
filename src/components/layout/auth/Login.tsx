'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import CompanyLogo from '@/components/CompanyLogo';
import { useTranslation } from '@/lib/TranslationProvider';

// Type definitions for better type safety
interface LoginFormState {
  email: string;
  password: string;
  isSubmitting: boolean;
}

const INITIAL_FORM_STATE: LoginFormState = {
  email: '',
  password: '',
  isSubmitting: false,
};

export default function Login() {
  const [formState, setFormState] =
    useState<LoginFormState>(INITIAL_FORM_STATE);
  const { data: session, status } = useSession();
  const router = useRouter();
  const { translate } = useTranslation();

  const isLoading =
    status === 'loading' || (status === 'authenticated' && session?.user);

  // Memoized route calculation
  const getTargetRoute = (role: string, hasAnswers: boolean): string => {
    if (!role) return '/login';

    if (role === 'customer') {
      return hasAnswers ? '/customer/dashboard' : '/onboard';
    }
    return role === 'auditor' ? '/auditor/dashboard' : `/${role}/dashboard`;
  };

  // Form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.isSubmitting) return;

    setFormState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: formState.email,
        password: formState.password,
      });

      if (result?.error) {
        toast.error(result.error, { duration: 4000 });
      }
    } catch (error) {
      toast.error(`An unexpected error occurred: ${error}`, { duration: 4000 });
    } finally {
      setFormState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // Navigation effect
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      const { role, hasAnswers } = session.user;
      const targetRoute = getTargetRoute(role, hasAnswers);

      const timer = setTimeout(() => {
        router.replace(targetRoute);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [session, status, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec..</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-8 items-center text-black justify-center h-screen bg-gray-100">
      <CompanyLogo color="#5B52F9" height="32" width="152" />
      <div className="w-full max-w-md p-8 space-y-6 text-center bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="text-[28px] font-semibold">
            {translate('page.login.welcome_back')}
          </h2>
          <p className="text-sm">
            {translate('page.login.log_in_to_continue')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            type="email"
            name="email"
            value={formState.email}
            onChange={handleInputChange}
            placeholder={translate('page.login.email')}
            className="w-full"
            required
          />
          <Input
            type="password"
            name="password"
            value={formState.password}
            onChange={handleInputChange}
            placeholder={translate('page.login.password')}
            className="w-full"
            required
          />
          <Button
            disabled={formState.isSubmitting}
            type="submit"
            className="w-full text-white"
          >
            {formState.isSubmitting && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {translate('page.login.sign_in')}
          </Button>
        </form>

        <div className="flex justify-between text-[#71717A]">
          <div className="flex items-center space-x-2">
            <Checkbox id="remember" />
            <label htmlFor="remember" className="text-sm font-medium">
              {translate('page.login.remember_me')}
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-[#00104B]"
          >
            {translate('page.login.forgot_password')}
          </Link>
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-gray-500">
              {translate('page.login.continue_with')}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          onClick={() => signIn('google')}
          className="w-full flex items-center justify-center"
        >
          <FcGoogle className="text-lg" />
          <span className="flex-1 text-center ms-[-16px] text-[#1B1B28] font-medium">
            {translate('page.login.google')}
          </span>
        </Button>

        <p className="text-sm text-[#71717A] font-medium">
          {translate('page.login.no_account')}{' '}
          <Link href="/signup" className="text-[#00104B]">
            {translate('page.login.sign_up')}
          </Link>
        </p>
      </div>
    </div>
  );
}
