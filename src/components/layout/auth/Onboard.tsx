'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import QuestionnairesStepper from '@/components/QuestionnairesStepper';
import { questionnaires } from '@/lib/questionnaires';
import { useQuestionnaireState } from '@/hooks/useQuestionnaireState'; // New custom hook

export type SelectedAnswer = {
  question: string;
  answers: string[];
};

export default function Onboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const hasToasted = useRef(false);
  const { currentStepIndex, setCurrentStepIndex } = useQuestionnaireState();

  const { data: user } = trpc.users.getUserByEmail.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  useEffect(() => {
    if (status === 'unauthenticated' && !hasToasted.current) {
      toast.error('You are not logged in yet!');
      hasToasted.current = true;
      router.push('/login');
      return;
    }

    if (
      status === 'authenticated' &&
      session?.user?.role &&
      user?.questionnaires?.length > 0
    ) {
      router.push(`/${session.user.role}/dashboard`);
    }
  }, [status, session, router, user?.questionnaires]);

  if (status !== 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
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
