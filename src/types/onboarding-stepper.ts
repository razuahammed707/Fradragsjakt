export type SelectionOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

export type Step = {
  title: string | ((selectedOptions: string[]) => string);
  subtitle: string;
  options?: SelectionOption[];
  type: 'selection' | 'input' | 'date' | 'search' | 'boolean' | 'bankStatement';
  multiSelect?: boolean;
  helpText?: string;
  hasHelpLink?: boolean;
};

export type StepperFormData = {
  selected_profiles: string[];
  children_under_12: string | null;
  occupations: string[];
  start_date: string;
  has_travel: boolean | null;
  has_meals: boolean | null;
  has_driving: boolean | null;
  has_workspace: boolean | null;
  has_special_care_children: boolean | null;
  has_parental_allowance: boolean | null;
};
