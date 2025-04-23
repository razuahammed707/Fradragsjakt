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
  selectedOptions: string[];
  dependentsCount: string | null;
  occupations: string[];
  startDate: string;
  hasTravel: boolean | null;
  hasMeals: boolean | null;
  hasDriving: boolean | null;
  hasWorkspace: boolean | null;
  hasBankConnected: boolean | null;
  hasStatementsUploaded: boolean | null;
};
