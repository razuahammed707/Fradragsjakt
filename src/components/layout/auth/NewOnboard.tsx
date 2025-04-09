'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type SelectionOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type Step = {
  title: string;
  subtitle: string;
  options?: SelectionOption[];
  type: 'selection' | 'input' | 'number' | 'search' | 'boolean';
  multiSelect?: boolean;
  helpText?: string;
  hasHelpLink?: boolean;
};

export default function NewOnboard() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: session, status } = useSession();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedDependentsCount, setSelectedDependentsCount] = useState<
    string | null
  >(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOccupations, setSelectedOccupations] = useState<string[]>([]);
  const [hasDriving, setHasDriving] = useState<boolean | null>(null);
  const [hasWorkspace, setHasWorkspace] = useState<boolean | null>(null);
  const [hasMeals, setHasMeals] = useState<boolean | null>(null);
  const [hasTravel, setHasTravel] = useState<boolean | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedDate, setSelectedDate] = useState('2024 - July');
  const [showDependentsModal, setShowDependentsModal] = useState(false);

  const steps: Step[] = [
    {
      title: "Let's get to know you!",
      subtitle:
        'Select all that apply so we can find you eligible credits and deductions.',
      type: 'selection',
      multiSelect: true,
      options: [
        {
          id: 'married',
          label: 'Married',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              💍
            </div>
          ),
        },
        {
          id: 'dependents',
          label: 'Dependents',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              👨‍👩‍👧
            </div>
          ),
        },
        {
          id: 'employee',
          label: 'Employee (W-2)',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              💼
            </div>
          ),
        },
        {
          id: 'freelance',
          label: 'Freelance (1099)',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              🖋️
            </div>
          ),
        },
        {
          id: 'business',
          label: 'Business owner',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              🏢
            </div>
          ),
        },
        {
          id: 'student',
          label: 'Student loans',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              🎓
            </div>
          ),
        },
        {
          id: 'homeowner',
          label: 'Homeowner',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              🏠
            </div>
          ),
        },
        {
          id: 'renter',
          label: 'Renter',
          icon: (
            <div className="flex items-center justify-center w-10 h-10 text-2xl">
              🔑
            </div>
          ),
        },
      ],
    },

    {
      title: 'What do you or your spouse do for business?',
      subtitle: "Select any jobs that you've done this year.",
      type: 'search',
    },
    {
      title:
        'When did you or your spouse first start working as a graphic designer?',
      subtitle:
        "This info allows us to find tax deductions for the months you've been working.",
      type: 'input',
    },
    {
      title:
        'Do you or your spouse travel out of town for your work as a graphic designer?',
      subtitle:
        'E.g. attending an out-of-town networking event, attending a conference, meeting with an out-of-town client',
      type: 'boolean',
      helpText:
        'Support! Business trip expenses - like flights, lodging, and meals - are tax deductible.',
      hasHelpLink: true,
    },
    {
      title:
        'Do you or your spouse ever go out to eat with graphic design clients or other graphic designers?',
      subtitle: 'Any meaningful work conversation counts.',
      type: 'boolean',
      helpText:
        "Makes sense. We'll help you claim business meal deductions when applicable.",
      hasHelpLink: true,
    },
    {
      title: 'Do you or your spouse drive for your work as a graphic designer?',
      subtitle:
        'E.g. attending an out-of-town networking event, attending a conference, meeting with an out-of-town client',
      type: 'boolean',
      helpText:
        'Great! This means you can deduct part of your car-related expenses such as gas, insurance, and DMV fees.',
      hasHelpLink: true,
    },
    {
      title: 'Do you or your spouse have a home workspace for graphic design?',
      subtitle:
        'e.g. managing finances and paperwork, creating designs for clients, client development, marketing and advertising',
      type: 'boolean',
      helpText:
        'Great! You can deduct part of your home-related expenses like utilities, wifi, and home maintenance.',
      hasHelpLink: true,
    },
  ];

  const handleSelectionChange = (id: string) => {
    if (id === 'dependents') {
      if (!selectedOptions.includes(id)) {
        setSelectedOptions([...selectedOptions, id]);
        //setShowDependentsStep(true);
      } else {
        setSelectedOptions(selectedOptions.filter((option) => option !== id));
        //setShowDependentsStep(false);
        setSelectedDependentsCount(null);
      }
      return;
    }

    if (selectedOptions.includes(id)) {
      setSelectedOptions(selectedOptions.filter((option) => option !== id));
    } else {
      setSelectedOptions([...selectedOptions, id]);
    }
  };

  const handleDependentCountSelect = (count: string) => {
    setSelectedDependentsCount(count);
  };

  const handleOccupationSelect = (occupation: string) => {
    if (!selectedOccupations.includes(occupation)) {
      setSelectedOccupations([...selectedOccupations, occupation]);
    }
    setSearchTerm('');
  };

  const handleRemoveOccupation = (occupation: string) => {
    setSelectedOccupations(selectedOccupations.filter((o) => o !== occupation));
  };

  const handleBooleanSelect = (value: boolean) => {
    const stepIndex = currentStep;
    if (stepIndex === 3) {
      setHasTravel(value);
    } else if (stepIndex === 4) {
      setHasMeals(value);
    } else if (stepIndex === 5) {
      setHasDriving(value);
    } else if (stepIndex === 6) {
      setHasWorkspace(value);
    }
  };

  const handleNext = () => {
    // If we're on the first step and moving to the next
    if (currentStep === 0) {
      // Go directly to the occupation step (now index 1)
      setCurrentStep(1);
      return;
    }

    // For other steps, just increment normally
    if (currentStep + 1 < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle completion
      toast.success('Onboarding completed!');
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 0:
        // Require dependents count if dependents is selected
        if (
          selectedOptions.includes('dependents') &&
          !selectedDependentsCount
        ) {
          return true;
        }
        return selectedOptions.length === 0;
      case 1:
        return selectedOccupations.length === 0;
      case 2:
        return !selectedDate;
      case 3:
        return hasTravel === null;
      case 4:
        return hasMeals === null;
      case 5:
        return hasDriving === null;
      case 6:
        return hasWorkspace === null;
      default:
        return false;
    }
  };

  // Change the main container width from 800px to 640px
  const renderStepIndicator = () => {
    return (
      <Tabs value={currentStep.toString()} className="w-[740px] mx-auto mb-8">
        <TabsList className="w-full grid grid-cols-7 gap-2 bg-transparent p-0">
          {steps.map((_, index) => (
            <TabsTrigger
              key={index}
              value={index.toString()}
              className={`h-2 data-[state=active]:bg-green-500 rounded-full border-none ${
                index <= currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
              disabled
            />
          ))}
        </TabsList>
      </Tabs>
    );
  };

  if (status !== 'authenticated') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">Wait a sec...</p>
      </div>
    );
  }

  const DependentsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">
          How many dependents do you have?
        </h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {['1', '2', '3', '4', '5', '6+'].map((num) => (
            <button
              key={num}
              onClick={() => {
                setSelectedDependentsCount(num);
                setShowDependentsModal(false);
              }}
              className={`p-4 border-2 rounded-lg ${
                selectedDependentsCount === num
                  ? 'border-[#5B52F9] bg-[#F0EFFE]'
                  : 'border-[#EEF0F4]'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Update content widths and make inputs full width
  const renderStepContent = () => {
    const step = steps[currentStep];

    if (step.type === 'selection') {
      return (
        <div className="w-[740px] mx-auto mt-6">
          <div className="grid grid-cols-2 gap-4">
            {step.options?.map((option) => {
              const isSelected = selectedOptions.includes(option.id);
              return (
                <Card
                  key={option.id}
                  className={`p-3 cursor-pointer border hover:border-[#5B52F9] transition-all ${isSelected ? 'border-[#5B52F9] bg-[#F0EFFE]' : 'border-[#EEF0F4]'}`}
                  onClick={() => handleSelectionChange(option.id)}
                >
                  <div className="flex flex-col items-center justify-center py-2">
                    {option.icon}
                    <span className="mt-1 text-sm font-medium">
                      {option.label}
                    </span>
                  </div>
                </Card>
              );
            })}
          </div>

          {currentStep === 0 && selectedOptions.includes('dependents') && (
            <div className="mt-6">
              <h3 className="text-sm font-medium mb-3">
                How many dependents do you have?
              </h3>
              <div className="grid grid-cols-6 gap-2">
                {['1', '2', '3', '4', '5', '6+'].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDependentCountSelect(num)}
                    className={`p-2 border rounded-md ${selectedDependentsCount === num ? 'border-[#5B52F9] bg-[#F0EFFE]' : 'border-[#EEF0F4]'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    if (step.type === 'number') {
      return (
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-6">
          {step.options?.map((option) => {
            const isSelected = selectedDependentsCount === option.id;

            return (
              <Card
                key={option.id}
                className={`p-4 cursor-pointer border-2 hover:border-[#5B52F9] transition-all ${isSelected ? 'border-[#5B52F9] bg-[#F0EFFE]' : 'border-[#EEF0F4]'}`}
                onClick={() => handleDependentCountSelect(option.id)}
              >
                <div className="flex flex-col items-center justify-center py-4">
                  {option.icon}
                </div>
              </Card>
            );
          })}
        </div>
      );
    }

    if (step.type === 'search') {
      return (
        <div className="w-[740px] mx-auto mt-6">
          {selectedOccupations.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedOccupations.map((occupation) => (
                <div
                  key={occupation}
                  className="inline-flex items-center bg-[#F0EFFE] rounded-md px-3 py-1.5"
                >
                  <span className="text-sm text-[#0F172A]">{occupation}</span>
                  <button
                    className="ml-2 text-[#94A3B8] hover:text-[#475569]"
                    onClick={() => handleRemoveOccupation(occupation)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5 17.5L12.5 12.5M14.1667 8.33333C14.1667 11.555 11.555 14.1667 8.33333 14.1667C5.11167 14.1667 2.5 11.555 2.5 8.33333C2.5 5.11167 5.11167 2.5 8.33333 2.5C11.555 2.5 14.1667 5.11167 14.1667 8.33333Z"
                  stroke="#94A3B8"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#5B52F9] text-sm"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </div>

          <p className="text-xs text-[#64748B] mt-2">
            e.g. &ldquo;healthcare professional&rdquo; or
            &ldquo;consultant&rdquo;
          </p>

          {searchTerm && (
            <div className="absolute w-[740px] mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto z-50">
              {[
                'Graphic Designer',
                'Web Designer',
                'UI/UX Designer',
                'Art Director',
                'Brand Designer',
                'Motion Designer',
              ]
                .filter((job) =>
                  job.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((job) => (
                  <button
                    key={job}
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    onClick={() => handleOccupationSelect(job)}
                  >
                    {job}
                  </button>
                ))}
            </div>
          )}
        </div>
      );
    }

    if (step.type === 'input') {
      return (
        <div className="w-[740px] mx-auto mt-6">
          <div className="relative">
            <div className="w-full p-3 border border-gray-300 rounded-md flex justify-between items-center cursor-pointer">
              <span>{selectedDate}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="#94A3B8"
                  strokeWidth="1.66667"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            This info allows us to find tax deductions for the months
            you&apos;ve been working.
          </p>
        </div>
      );
    }

    if (step.type === 'boolean') {
      let value: boolean | null = null;
      let yesText = '';

      if (currentStep === 3) {
        value = hasTravel;
        yesText = 'Yes, I / my spouse travel for graphic design';
      } else if (currentStep === 4) {
        value = hasMeals;
        yesText = 'Yes, I / my spouse get business meals';
      } else if (currentStep === 5) {
        value = hasDriving;
        yesText = 'Yes, I / my spouse drive for graphic design';
      } else if (currentStep === 6) {
        value = hasWorkspace;
        yesText = 'Yes, I / my spouse have a home workspace';
      }

      return (
        <div className="w-[740px] mx-auto mt-6">
          <div className="flex flex-col gap-2">
            <button
              className={`w-full p-4 text-left border-2 rounded-lg hover:border-[#5B52F9] transition-all ${
                value === true
                  ? 'border-[#5B52F9] bg-[#F0EFFE]'
                  : 'border-[#EEF0F4]'
              }`}
              onClick={() => handleBooleanSelect(true)}
            >
              {yesText}
            </button>
            <button
              className={`w-full p-4 text-left border-2 rounded-lg hover:border-[#5B52F9] transition-all ${
                value === false
                  ? 'border-[#5B52F9] bg-[#F0EFFE]'
                  : 'border-[#EEF0F4]'
              }`}
              onClick={() => handleBooleanSelect(false)}
            >
              No
            </button>
          </div>

          {step.helpText && value === true && (
            <div className="mt-4 p-4 bg-[#F0EFFE] rounded-lg flex items-start gap-2">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 13.3333V10"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10 6.66667H10.0083"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm text-gray-700">{step.helpText}</p>
            </div>
          )}

          {step.hasHelpLink && (
            <button className="text-sm text-[#5B52F9] mt-2 hover:underline">
              Help me decide
            </button>
          )}
        </div>
      );
    }

    return null;
  };

  const renderInfoText = () => {
    if (
      currentStep === 0 &&
      selectedOptions.some((type) => ['freelance', 'business'].includes(type))
    ) {
      return (
        <div className="w-[800px] mx-auto mt-8">
          <div className="p-4 bg-[#F0EFFE] rounded-lg border border-[#E2E0FF]">
            <div className="flex items-start">
              <div className="mr-2 mt-1">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 13.3333V10"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10 6.66667H10.0083"
                    stroke="#475569"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">
                    Perfect! Keeper is especially great for business owners.
                  </span>
                  <br />
                  Let&apos;s start by uncovering the deductions that being a
                  business owner make you eligible for!
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Update the main container and title section width
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="w-[740px] mx-auto">
        {renderStepIndicator()}

        <div className="mb-8">
          <h1 className="text-2xl font-bold">{steps[currentStep].title}</h1>
          {steps[currentStep].subtitle && (
            <p className="text-gray-600 mt-2">{steps[currentStep].subtitle}</p>
          )}
        </div>

        {renderStepContent()}
        {renderInfoText()}

        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="w-[740px] mx-auto py-4 flex gap-3 justify-end">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center justify-center w-10 h-10 border border-gray-300 rounded-md p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}

            <Button
              onClick={handleNext}
              disabled={isNextDisabled()}
              className="bg-[#0F172A] text-white px-8 rounded-md"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {showDependentsModal && <DependentsModal />}
    </div>
  );
}
