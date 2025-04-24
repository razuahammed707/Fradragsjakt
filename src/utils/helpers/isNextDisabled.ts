import { StepperFormData } from '@/types/onboarding-stepper';

export function isNextDisabled(currentStep: number, values: StepperFormData) {
  switch (currentStep) {
    case 0:
      if (
        values.selected_profiles.includes('family') &&
        !values.children_under_12
      ) {
        return true;
      }
      const businessTypes = [
        'freelance',
        'business',
        'organization',
        'employee',
      ];
      const hasBusinessType = values.selected_profiles.some((opt) =>
        businessTypes.includes(opt)
      );
      return !hasBusinessType;
    case 1:
      return values.occupations.length === 0;
    case 2:
      return !values.start_date;
    case 3:
      return values.has_travel === null;
    case 4:
      return values.has_meals === null;
    case 5:
      return values.has_driving === null;
    case 6:
      return values.has_workspace === null;
    default:
      return false;
  }
}
