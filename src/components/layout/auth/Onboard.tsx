'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import QuestionnairesStepper from '@/components/QuestionnairesStepper';
import { questionnaires } from '@/lib/questionnaires';
import { useSession } from 'next-auth/react';

export type SelectedAnswer = {
  question: string;
  answers: string[];
};

export default function Onboard() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const hasToasted = useRef(false);

  useEffect(() => {
    // Redirect unauthenticated users to login page
    if (!session?.user?.role && !hasToasted.current) {
      toast.error('You are not logged in yet!');
      hasToasted.current = true;
      router.push('/login');
    }

    // Redirect authenticated users with completed questionnaires
    if (session?.user?.role && session?.user?.hasAnswers) {
      router.push(`/customer/dashboard`);
    }
  }, [router, session]);

  if (!session?.user?.role) {
    return null;
  }

  console.log('session from onboarding', session);
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
