'use client';

import { useState, useEffect } from 'react';
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

export default function Onboard() {
  const { status } = useSession();

  const {
    control,
    watch,
    setValue,
    getValues,
    formState: {},
  } = useForm<StepperFormData>({
    defaultValues: {
      selectedOptions: [],
      dependentsCount: null,
      occupations: [],
      startDate: '',
      hasTravel: false,
      hasMeals: false,
      hasDriving: false,
      hasWorkspace: false,
      hasBankConnected: false,
      hasStatementsUploaded: false,
    },
    mode: 'onChange',
    shouldUnregister: false,
  });

  const [currentStep, setCurrentStep] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Create a persistent reference to prevent form reset
  const [formInitialized, setFormInitialized] = useState(false);

  // Watch form values for conditional rendering
  const selectedOptions = watch('selectedOptions');
  const dependentsCount = watch('dependentsCount');
  const occupations = watch('occupations');
  const startDate = watch('startDate');

  // Ensure form remains initialized throughout component lifecycle
  useEffect(() => {
    if (!formInitialized) {
      setFormInitialized(true);
    }
  }, [formInitialized]);

  // Removed the reset effect to preserve boolean values between steps

  const handleSelectionChange = (id: string) => {
    const currentSelections = [...selectedOptions];

    if (currentSelections.includes(id)) {
      setValue(
        'selectedOptions',
        currentSelections.filter((option) => option !== id),
        { shouldValidate: true }
      );

      // Reset dependents count if family is unselected
      if (id === 'family') {
        setValue('dependentsCount', null, { shouldValidate: true });
      }
    } else {
      setValue('selectedOptions', [...currentSelections, id], {
        shouldValidate: true,
      });
    }
  };

  const handleDependentCountSelect = (count: string) => {
    setValue('dependentsCount', count, { shouldValidate: true });
  };

  const handleOccupationSelect = (occupation: string) => {
    if (!occupations.includes(occupation)) {
      setValue('occupations', [...occupations, occupation], {
        shouldValidate: true,
      });
    }
    setSearchTerm('');
  };

  const handleRemoveOccupation = (occupation: string) => {
    setValue(
      'occupations',
      occupations.filter((o) => o !== occupation),
      { shouldValidate: true }
    );
  };

  const handleDateSelect = () => {
    if (selectedDay && selectedMonth && selectedYear) {
      const formattedDate = `${selectedDay} ${selectedMonth} ${selectedYear}`;
      setValue('startDate', formattedDate, { shouldValidate: true });
      setShowDatePicker(false);
    }
  };

  const handleNext = () => {
    // Ensure validation before proceeding
    if (isNextDisabled(currentStep, getValues())) return;

    // If we're on the first step and moving to the next
    if (currentStep === 0) {
      const values = getValues();
      const hasEmployee = values.selectedOptions.includes('employee');
      const hasBusinessTypes = values.selectedOptions.some((opt) =>
        ['freelance', 'business', 'organization'].includes(opt)
      );

      // If only employee is selected or employee with non-business types
      if (hasEmployee && !hasBusinessTypes) {
        // Skip to the last step (bank statement step)
        setCurrentStep(steps.length - 1);
        return;
      }

      // Otherwise go to the occupation step
      setCurrentStep(1);
      return;
    }

    // For other steps, just increment normally
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Submit the form when all steps are complete
      handleSubmitForm();
    }
  };

  const handleSubmitForm = async () => {
    try {
      const formData = getValues();

      // Ensure all required fields have values
      const validatedData = {
        ...formData,
        hasTravel: formData.hasTravel ?? false,
        hasMeals: formData.hasMeals ?? false,
        hasDriving: formData.hasDriving ?? false,
        hasWorkspace: formData.hasWorkspace ?? false,
        hasBankConnected: formData.hasBankConnected ?? false,
        hasStatementsUploaded: formData.hasStatementsUploaded ?? false,
      };

      console.log('Submitting form data:', validatedData);
      toast.success('Onboarding completed successfully!');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    }
  };

  const handleBack = () => {
    if (currentStep === steps.length - 1) {
      const values = getValues();
      const hasEmployee = values.selectedOptions.includes('employee');
      const hasBusinessTypes = values.selectedOptions.some((opt) =>
        ['freelance', 'business', 'organization'].includes(opt)
      );

      // If only employee is selected or employee with non-business types
      if (hasEmployee && !hasBusinessTypes) {
        // Go back to first step
        setCurrentStep(0);
        return;
      }
    }

    // For other cases, just decrement normally
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => {
    return <StepIndicator currentStep={currentStep} steps={steps} />;
  };

  const renderInfoText = () => {
    return <InfoText selectedOptions={selectedOptions} />;
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
      selectedOptions,
      dependentsCount,
      occupations,
      startDate,
      searchTerm,
      setSearchTerm,
      showDatePicker,
      setShowDatePicker,
      selectedDay,
      setSelectedDay,
      selectedMonth,
      setSelectedMonth,
      selectedYear,
      setSelectedYear,
      control,
      watch,
      setValue,
      handleSelectionChange,
      handleDependentCountSelect,
      handleOccupationSelect,
      handleRemoveOccupation,
      handleDateSelect,
    });

    return stepContent;
  };

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
