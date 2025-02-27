import { Date, Document, Types } from 'mongoose';

export enum ExpenseType {
  business = 'business',
  personal = 'personal',
  unknown = 'unknown',
}
export interface IExpense extends Document {
  description: string;
  transaction_date: Date;
  amount: number;
  category: string;
  expense_type?: ExpenseType;
  note?: string;
  receipt?: {
    link: string;
    mimeType: string;
  };
  rule: Types.ObjectId;
  user: Types.ObjectId;
}
export interface IExpenseUpdate extends Document {
  id: string;
  description: string;
  transaction_date: Date;
  amount: number;
  category: string;
  expense_type?: ExpenseType;
  note?: string;
  receipt?: {
    link: string;
    mimeType: string;
  };
  rule: Types.ObjectId;
  user: Types.ObjectId;
}
