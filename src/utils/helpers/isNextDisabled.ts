import { StepperFormData } from '@/types/onboarding-stepper';

export function isNextDisabled(currentStep: number, values: StepperFormData) {
  console.log({ values });

  switch (currentStep) {
    case 0:
      if (
        values.selectedOptions.includes('family') &&
        !values.dependentsCount
      ) {
        return true;
      }
      const businessTypes = [
        'freelance',
        'business',
        'organization',
        'employee',
      ];
      const hasBusinessType = values.selectedOptions.some((opt) =>
        businessTypes.includes(opt)
      );
      return !hasBusinessType;
    case 1:
      return values.occupations.length === 0;
    case 2:
      return !values.startDate;
    /*   case 3:
      return values.hasTravel === null;
    case 4:
      return values.hasMeals === null;
    case 5:
      return values.hasDriving === null;
    case 6:
      return values.hasWorkspace === null; */
    case 7:
      return !(values.hasBankConnected || values.hasStatementsUploaded);
    default:
      return false;
  }
}
