import { Document, Types } from 'mongoose';

export enum ExpenseType {
  business = 'business',
  personal = 'personal',
  unknown = 'unknown',
}

export enum DeductionStatus {
  deductible = 'deductible',
  non_deductible = 'non_deductible',
}

export interface IExpense extends Document {
  description: string;
  category: string;
  expense_type: ExpenseType;
  amount: number;
  deduction_status: DeductionStatus;
  user: Types.ObjectId;
  rule: Types.ObjectId;
}
