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
  const { data: user, status } = useSession();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const hasToasted = useRef(false);

  const { data: fetcheduser } = trpc.users.getUserByEmail.useQuery();

  useEffect(() => {
    if (status === 'unauthenticated' && !hasToasted.current) {
      toast.error('You are not logged in yet!');
      hasToasted.current = true;
      router.push('/login');
    }
    if (
      status === 'authenticated' &&
      user?.user.role &&
      fetcheduser?.questionnaires.length > 0
    ) {
      router.push(`/${user?.user.role}/dashboard`);
    }
  }, [status, user, router, fetcheduser?.questionnaires]);

  return (
    <>
      {status !== 'authenticated' ? (
        <Loading />
      ) : (
        <div className="min-h-screen ">
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
      )}
    </>
  );
}
