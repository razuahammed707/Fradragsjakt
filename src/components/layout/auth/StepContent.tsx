import { Controller } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import QuestionnairesLastStep from '@/components/QuestionnairesLastStep';
import { steps } from '@/utils/constants/onboarding-steps';
import { MultiSelectFormInput } from '@/components/forms/MultiSelectFormInput';
import { SelectFormInput } from '@/components/forms/SelectFormInput';
import { YesNoInput } from '@/components/forms/YesNoInput';
import {
  defaultMonthValue,
  getDateOptions,
} from '@/utils/constants/stepper-month-options';
import { stepperOccupationOptions } from '@/utils/constants/stepper-occupation-options';

interface StepContentProps {
  currentStep: number;
  selected_profiles: string[];
  children_under_12: string | null;
  control: any;
  watch: any;
  setValue: any;
  handleSelectionChange: (id: string) => void;
  handleDependentCountSelect: (count: string) => void;
}

interface StepContentReturn {
  header: JSX.Element;
  content: JSX.Element | null;
}

export const renderStepContent = ({
  currentStep,
  selected_profiles,
  children_under_12,
  control,
  watch,
  setValue,
  handleSelectionChange,
  handleDependentCountSelect,
}: StepContentProps): StepContentReturn => {
  const step = steps[currentStep];
  const dateOptions = getDateOptions();

  const dynamicTitle =
    typeof step.title === 'function'
      ? step.title(selected_profiles)
      : step.title;

  const renderTitleAndSubtitle = () => (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">{dynamicTitle}</h1>
      {step.subtitle && <p className="text-gray-600 mt-2">{step.subtitle}</p>}
    </div>
  );

  if (step.type === 'bankStatement') {
    return {
      header: renderTitleAndSubtitle(),
      content: (
        <div className="w-[740px] mx-auto mt-6">
          <QuestionnairesLastStep />
        </div>
      ),
    };
  }

  if (step.type === 'selection') {
    return {
      header: renderTitleAndSubtitle(),
      content: (
        <div className="w-[740px] mx-auto mt-6">
          <Controller
            name="selected_profiles"
            control={control}
            render={() => (
              <div className="grid grid-cols-2 gap-4">
                {step.options?.map((option) => {
                  const isSelected = selected_profiles.includes(option.id);
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
            )}
          />

          {currentStep === 0 && selected_profiles.includes('family') && (
            <>
              <Controller
                name="children_under_12"
                control={control}
                render={() => (
                  <div className="mt-8">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                      How many children do you have under the age of 12?
                    </h3>
                    <div className="grid grid-cols-7 gap-2">
                      {['0', '1', '2', '3', '4', '5', '6+'].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => handleDependentCountSelect(num)}
                          className={`p-3 border rounded-lg text-sm font-medium transition-all shadow-sm
                            ${
                              children_under_12 === num
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-600  ring-indigo-500'
                                : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                            }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              />

              <div className="mt-8 space-y-6">
                <YesNoInput
                  label="Do you have children with special care needs?"
                  value={watch('has_special_care_children')}
                  name={'has_special_care_children'}
                  setValue={setValue}
                  singleLine
                />
                <YesNoInput
                  label="Do you receive parental allowance?"
                  value={watch('has_parental_allowance')}
                  name={'has_parental_allowance'}
                  setValue={setValue}
                  singleLine
                />
              </div>
            </>
          )}
        </div>
      ),
    };
  }

  if (step.type === 'search') {
    return {
      header: renderTitleAndSubtitle(),
      content: (
        <div className="w-[740px] mx-auto mt-6">
          <MultiSelectFormInput
            control={control}
            name="occupations"
            placeholder="Select occupations"
            useBadgeLayout
            options={stepperOccupationOptions}
            customClassName="h-12"
          />

          <p className="text-xs text-[#64748B] mt-2">
            e.g. &ldquo;healthcare professional&rdquo; or
            &ldquo;consultant&rdquo;
          </p>
        </div>
      ),
    };
  }

  if (step.type === 'date') {
    return {
      header: renderTitleAndSubtitle(),
      content: (
        <div className="w-[740px] mx-auto mt-6">
          <SelectFormInput
            control={control}
            name="start_date"
            placeholder="Select a month"
            options={dateOptions}
            customClassName="h-12"
            defaultValue={defaultMonthValue}
          />
          <p className="text-sm text-gray-500 mt-2">
            This info allows us to find tax deductions for the months
            you&apos;ve been working.
          </p>
        </div>
      ),
    };
  }

  if (step.type === 'boolean') {
    let fieldName: 'has_travel' | 'has_meals' | 'has_driving' | 'has_workspace';
    let yesText = '';

    switch (currentStep) {
      case 3:
        fieldName = 'has_travel';
        yesText = 'Yes, I travel for work';
        break;
      case 4:
        fieldName = 'has_meals';
        yesText = 'Yes, I get business meals';
        break;
      case 5:
        fieldName = 'has_driving';
        yesText = 'Yes, I drive for work';
        break;
      case 6:
        fieldName = 'has_workspace';
        yesText = 'Yes, I have a home workspace';
        break;
      default:
        fieldName = 'has_travel';
        yesText = 'Yes';
    }

    return {
      header: renderTitleAndSubtitle(),
      content: (
        <div className="w-[740px] mx-auto mt-6">
          <YesNoInput
            value={watch(fieldName)}
            name={fieldName}
            setValue={setValue}
            yesText={yesText}
            helpText={step.helpText}
            hasHelpLink={step.hasHelpLink}
          />
        </div>
      ),
    };
  }

  return {
    header: renderTitleAndSubtitle(),
    content: null,
  };
};
