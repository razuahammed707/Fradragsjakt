import { Document } from 'mongoose';

export interface IQuestionnaire {
  children_under_12: any | null;
  occupations: string[];
  start_date?: string;
  has_travel: boolean;
  has_meals: boolean;
  has_driving: boolean;
  has_workspace: boolean;
  has_special_care_children: boolean;
  has_parental_allowance: boolean;
}

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: 'admin' | 'auditor' | 'customer';
  profile: string[];
  image: string;
  provider: 'credentials' | 'google';
  questionnaires?: IQuestionnaire;
  isVerified: boolean;
  isStepperSkippedOrCompleted: boolean;
  isSawInstructions: boolean;
}
