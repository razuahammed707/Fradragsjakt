import { Date, Document, Types } from 'mongoose';

export enum IncomeType {
  business = 'business',
  personal = 'personal',
  unknown = 'unknown',
}

export interface IIncome extends Document {
  description: string;
  transaction_date: Date;
  amount: number;
  category: string;
  income_type?: IncomeType;
  note?: string;
  receipt?: {
    link: string;
    mimeType: string;
  };
  rule: Types.ObjectId;
  user: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIncomeUpdate {
  id: string;
  description: string;
  transaction_date: Date;
  amount: number;
  category: string;
  income_type: 'business' | 'personal' | 'unknown';
}
