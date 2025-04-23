import { Controller } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import QuestionnairesLastStep from '@/components/QuestionnairesLastStep';
import { steps } from '@/utils/constants/onboarding-steps';
import { MultiSelectFormInput } from '@/components/forms/MultiSelectFormInput';
import { SelectFormInput } from '@/components/forms/SelectFormInput';
import { YesNoInput } from '@/components/forms/YesNoInput';
import { getDateOptions } from '@/utils/constants/stepper-month-options';

interface StepContentProps {
  currentStep: number;
  selectedOptions: string[];
  dependentsCount: string | null;
  occupations: string[];
  startDate: string;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (show: boolean) => void;
  selectedDay: number | null;
  setSelectedDay: (day: number | null) => void;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
  control: any;
  watch: any;
  setValue: any;
  handleSelectionChange: (id: string) => void;
  handleDependentCountSelect: (count: string) => void;
  handleOccupationSelect: (occupation: string) => void;
  handleRemoveOccupation: (occupation: string) => void;
  handleDateSelect: () => void;
}

interface StepContentReturn {
  header: JSX.Element;
  content: JSX.Element | null;
}

export const renderStepContent = ({
  currentStep,
  selectedOptions,
  dependentsCount,
  searchTerm,
  control,
  watch,
  setValue,
  handleSelectionChange,
  handleDependentCountSelect,
  handleOccupationSelect,
}: StepContentProps): StepContentReturn => {
  const step = steps[currentStep];
  const dateOptions = getDateOptions();
  console.log('Current step:', currentStep, 'Step:', step);

  const dynamicTitle =
    typeof step.title === 'function' ? step.title(selectedOptions) : step.title;

  console.log('Rendered title:', dynamicTitle);

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
            name="selectedOptions"
            control={control}
            render={() => (
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
            )}
          />

          {currentStep === 0 && selectedOptions.includes('family') && (
            <>
              <Controller
                name="dependentsCount"
                control={control}
                render={() => (
                  <div className="mt-8">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
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
                              dependentsCount === num
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
                <div className="flex items-center space-x-3">
                  <span className="text-base font-semibold text-gray-900">
                    Do you have children with special care needs?
                  </span>
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => setValue('hasSpecialCareChildren', false)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm
                        ${
                          watch('hasSpecialCareChildren') === false
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600  ring-indigo-500'
                            : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('hasSpecialCareChildren', true)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm
                        ${
                          watch('hasSpecialCareChildren') === true
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600  ring-indigo-500'
                            : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                        }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-base font-semibold text-gray-900">
                    Do you receive parental allowance?
                  </span>
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      onClick={() => setValue('hasParentalAllowance', false)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm
                        ${
                          watch('hasParentalAllowance') === false
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600   ring-indigo-500'
                            : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                        }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('hasParentalAllowance', true)}
                      className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all shadow-sm
                        ${
                          watch('hasParentalAllowance') === true
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-600   ring-indigo-500'
                            : 'border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50/60'
                        }`}
                    >
                      Yes
                    </button>
                  </div>
                </div>
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
            customClassName="h-12"
          />

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
                    type="button"
                    className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50"
                    onClick={() => handleOccupationSelect(job)}
                  >
                    {job}
                  </button>
                ))}
            </div>
          )}
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
            name="startDate"
            placeholder="Select a month"
            options={dateOptions}
            customClassName="h-12"
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
    let fieldName: 'hasTravel' | 'hasMeals' | 'hasDriving' | 'hasWorkspace';
    let yesText = '';

    switch (currentStep) {
      case 3:
        fieldName = 'hasTravel';
        yesText = 'Yes, I travel for graphic design';
        break;
      case 4:
        fieldName = 'hasMeals';
        yesText = 'Yes, I get business meals';
        break;
      case 5:
        fieldName = 'hasDriving';
        yesText = 'Yes, I drive for graphic design';
        break;
      case 6:
        fieldName = 'hasWorkspace';
        yesText = 'Yes, I have a home workspace';
        break;
      default:
        fieldName = 'hasTravel';
        yesText = 'Yes';
    }

    const currentValue = watch(fieldName);

    return {
      header: renderTitleAndSubtitle(),
      content: (
        <div className="w-[740px] mx-auto mt-6">
          <YesNoInput
            control={control}
            name={fieldName}
            yesText={yesText}
            helpText={step.helpText}
            hasHelpLink={step.hasHelpLink}
            onChange={(value) => {
              if (currentValue !== value) {
                setValue(fieldName, value, {
                  shouldValidate: true,
                  shouldDirty: true,
                  shouldTouch: true,
                });
              }
            }}
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
