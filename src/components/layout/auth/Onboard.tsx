'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StepperFormData } from '@/types/onboarding-stepper';
import { steps } from '@/utils/constants/onboarding-steps';
import { renderStepContent as renderStepContentComponent } from './StepContent';
import { StepIndicator } from '@/components/layout/auth/StepIndicator';
import { InfoText } from './InfoText';
import { isNextDisabled } from '@/utils/helpers/isNextDisabled';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';

export default function Onboard() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: session, status } = useSession();
  const hasToasted = useRef(false);
  const [loading, setLoading] = useState(false);

  const updateQuestionnaires = trpc.users.updateUser.useMutation({
    onSuccess: () => {
      toast.success('Congrats! you have successfully onboarded');
      setLoading(false);
      utils.users.getUserByEmail.invalidate();
      router.push(`/${session?.user.role}/expenses`);
    },
    onError: (error) => {
      console.error('Failed to update questionnaires:', error);
    },
  });

  const {
    control,
    watch,
    setValue,
    getValues,
    formState: {},
  } = useForm<StepperFormData>({
    defaultValues: {
      selected_profiles: [],
      children_under_12: null,
      occupations: [],
      start_date: '',
      has_travel: false,
      has_meals: false,
      has_driving: false,
      has_workspace: false,
      has_special_care_children: false,
      has_parental_allowance: false,
    },
    mode: 'onChange',
    shouldUnregister: false,
  });

  const [currentStep, setCurrentStep] = useState(0);
  const selected_profiles = watch('selected_profiles');
  const children_under_12 = watch('children_under_12');
  watch(['occupations', 'start_date']);

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
      user?.isStepperSkippedOrCompleted
    ) {
      router.push(`/${session.user.role}/expenses`);
    }
  }, [status, session, router, user?.isStepperSkippedOrCompleted]);

  const handleSelectionChange = (id: string) => {
    const currentSelections = [...selected_profiles];

    if (currentSelections.includes(id)) {
      setValue(
        'selected_profiles',
        currentSelections.filter((option) => option !== id),
        { shouldValidate: true }
      );

      if (id === 'family') {
        setValue('children_under_12', null, { shouldValidate: true });
      }
    } else {
      setValue('selected_profiles', [...currentSelections, id], {
        shouldValidate: true,
      });
    }
  };

  const handleDependentCountSelect = (count: string) => {
    setValue('children_under_12', count, { shouldValidate: true });
  };

  const handleNext = () => {
    if (isNextDisabled(currentStep, getValues())) return;

    if (currentStep === 0) {
      const values = getValues();
      const hasEmployee = values.selected_profiles.includes('employee');
      const hasBusinessTypes = values.selected_profiles.some((opt) =>
        ['freelance', 'business', 'organization'].includes(opt)
      );

      if (hasEmployee && !hasBusinessTypes) {
        setCurrentStep(steps.length - 1);
        return;
      }

      setCurrentStep(1);
      return;
    }

    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmitForm();
    }
  };

  const handleSubmitForm = async () => {
    try {
      setLoading(true);
      const formData = getValues();
      const validatedData = {
        profile: formData.selected_profiles,
        questionnaires: {
          ...(() => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { selected_profiles, ...rest } = formData;
            return rest;
          })(),
          has_travel: formData.has_travel ?? false,
          has_meals: formData.has_meals ?? false,
          has_driving: formData.has_driving ?? false,
          has_workspace: formData.has_workspace ?? false,
        },
      };
      updateQuestionnaires.mutate({ ...validatedData });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  const handleBack = () => {
    if (currentStep === steps.length - 1) {
      const values = getValues();
      const hasEmployee = values.selected_profiles.includes('employee');
      const hasBusinessTypes = values.selected_profiles.some((opt) =>
        ['freelance', 'business', 'organization'].includes(opt)
      );

      if (hasEmployee && !hasBusinessTypes) {
        setCurrentStep(0);
        return;
      }
    }

    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    return <StepIndicator currentStep={currentStep} steps={steps} />;
  };

  const renderInfoText = () => {
    return <InfoText selectedOptions={selected_profiles} />;
  };

  if (status !== 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
  }

  const renderStepContent = () => {
    const stepContent = renderStepContentComponent({
      currentStep,
      selected_profiles: selected_profiles,
      children_under_12: children_under_12,
      control,
      watch,
      setValue,
      handleSelectionChange,
      handleDependentCountSelect,
    });

    return stepContent;
  };

  if (status !== 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-[740px] space-y-5 mx-auto">
        <div className="sticky top-0 z-10 bg-white">
          <div className="w-[740px] mx-auto">
            {renderStepIndicator()}
            {renderStepContent().header}
          </div>
        </div>

        <div className="overflow-visible overflow-y-auto max-h-[calc(100vh-300px)] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {renderStepContent().content}
          {renderInfoText()}
        </div>

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="w-[740px] mx-auto py-4 flex gap-3 justify-end">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center justify-center w-10 border border-gray-300 rounded-md p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <Button
              onClick={
                currentStep === steps.length - 1 ? handleSubmitForm : handleNext
              }
              disabled={
                currentStep !== steps.length - 1
                  ? isNextDisabled(currentStep, getValues())
                  : false
              }
              className="bg-[#0F172A] text-white px-8 rounded-md"
              type="button"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {currentStep === steps.length - 1
                ? 'Continue to dashboard'
                : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
