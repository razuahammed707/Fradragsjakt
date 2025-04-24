import { Step } from '@/types/onboarding-stepper';
import { getStepDynamicTitle } from '../helpers/getStepDynamicTitle';

export const steps: Step[] = [
  {
    title: "Let's get to know you!",
    subtitle:
      'Select all that apply so we can find you eligible credits and deductions.',
    type: 'selection',
    multiSelect: true,
    options: [
      {
        id: 'organization',
        label: 'Organization',
        icon: (
          <div className="flex items-center justify-center w-10 h-10 text-2xl">
            👫
          </div>
        ),
      },
      {
        id: 'family',
        label: 'Family',
        icon: (
          <div className="flex items-center justify-center w-10 h-10 text-2xl">
            👨‍👩‍👧
          </div>
        ),
      },
      {
        id: 'employee',
        label: 'Employee',
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
    title: (selectedOptions: string[]) =>
      getStepDynamicTitle('What do you do for', selectedOptions),
    subtitle: "Select any jobs that you've done this year.",
    type: 'search',
  },
  {
    title: (selectedOptions: string[]) =>
      getStepDynamicTitle('When did you start working as', selectedOptions),
    subtitle:
      "This info allows us to find tax deductions for the months you've been working.",
    type: 'date',
  },
  {
    title: (selectedOptions: string[]) =>
      getStepDynamicTitle(
        'Do you travel out of town for work as',
        selectedOptions
      ),
    subtitle:
      'E.g. attending an out-of-town networking event, attending a conference, meeting with an out-of-town client',
    type: 'boolean',
    helpText:
      'Support! Business trip expenses - like flights, lodging, and meals - are tax deductible.',
    hasHelpLink: true,
  },
  {
    title: (selectedOptions: string[]) =>
      getStepDynamicTitle('Do you go out to eat with', selectedOptions),
    subtitle: 'Any meaningful work conversation counts.',
    type: 'boolean',
    helpText:
      "Makes sense. We'll help you claim business meal deductions when applicable.",
    hasHelpLink: true,
  },
  {
    title: (selectedOptions: string[]) =>
      getStepDynamicTitle('Do you drive for your work as', selectedOptions),
    subtitle:
      'E.g. attending an out-of-town networking event, attending a conference, meeting with an out-of-town client',
    type: 'boolean',
    helpText:
      'Great! This means you can deduct part of your car-related expenses such as gas, insurance, and DMV fees.',
    hasHelpLink: true,
  },
  {
    title: (selectedOptions: string[]) =>
      getStepDynamicTitle('Do you have a home workspace for', selectedOptions),
    subtitle:
      'e.g. managing finances and paperwork, creating designs for clients, client development, marketing and advertising',
    type: 'boolean',
    helpText:
      'Great! You can deduct part of your home-related expenses like utilities, wifi, and home maintenance.',
    hasHelpLink: true,
  },
  {
    title: 'Connect your bank or upload statements',
    subtitle:
      'This helps us find eligible tax deductions from your transactions.',
    type: 'bankStatement',
  },
];
