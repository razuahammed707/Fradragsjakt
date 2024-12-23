'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { trpc } from '@/utils/trpc';
import QuestionnairesStepper from '@/components/QuestionnairesStepper';
import { useSession } from 'next-auth/react';
import Loading from '@/app/[lang]/loading';
import { questionnaires } from '@/lib/questionnaires';

export type SelectedAnswer = {
  question: string;
  answers: string[];
};

export default function Onboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Use ref to track mount state and toast display
  const isMounted = useRef(false);
  const hasToasted = useRef(false);

  // Fetch user data
  const { data: fetchedUser, isLoading: isUserLoading } =
    trpc.users.getUserByEmail.useQuery(undefined, {
      // Disable query if not authenticated
      enabled: status === 'authenticated',
      // Retry only a few times to avoid infinite loops
      retry: 3,
      onError: (error) => {
        toast.error('Failed to fetch user data: ' + error.message);
      },
    });

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const handleAuthentication = async () => {
      // Prevent running during SSR
      if (!isMounted.current) return;

      // Handle unauthenticated state
      if (status === 'unauthenticated') {
        if (!hasToasted.current) {
          toast.error('Please log in to continue');
          hasToasted.current = true;
        }
        setIsRedirecting(true);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay for toast
        router.push('/login');
        return;
      }

      // Handle authenticated state with completed questionnaires
      if (
        status === 'authenticated' &&
        session?.user?.role &&
        fetchedUser?.questionnaires?.length > 0 &&
        !isRedirecting
      ) {
        setIsRedirecting(true);
        toast.success('Redirecting to dashboard');
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Small delay for toast
        router.push(`/${session.user.role}/dashboard`);
        return;
      }
    };

    handleAuthentication();
  }, [status, session, router, fetchedUser, isRedirecting]);

  // Handle loading states
  if (status === 'loading' || isUserLoading || !isMounted.current) {
    return <Loading />;
  }

  // Handle redirecting state
  if (isRedirecting) {
    return <Loading />;
  }

  // Handle unauthenticated state
  if (status === 'unauthenticated') {
    return null; // Return null as we're redirecting anyway
  }

  return (
    <div className="min-h-screen">
      <div className="py-4 px-12">
        <span className="text-sm text-[#71717A] font-medium">
          Step {currentStepIndex + 1}/{questionnaires.length}
        </span>
      </div>
      <div className="flex h-[calc(100vh-64px)] justify-center items-center">
        <QuestionnairesStepper
          currentStepIndex={currentStepIndex}
          setCurrentStepIndex={setCurrentStepIndex}
        />
      </div>
    </div>
  );
}
