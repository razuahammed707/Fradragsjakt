import mongoose, { Schema } from 'mongoose';
import { DeductionStatus, ExpenseType, IExpense } from '../interfaces/expense';

const ExpenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    expense_type: {
      type: String,
      enum: Object.values(ExpenseType),
      default: ExpenseType.unknown,
    },
    amount: {
      type: Number,
      required: true,
    },
    deduction_status: {
      type: String,
      enum: Object.values(DeductionStatus),
      default: DeductionStatus.non_deductible,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    rule: {
      type: Schema.Types.ObjectId,
      ref: 'rule',
      //required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ExpenseModel =
  mongoose.models.expense || mongoose.model<IExpense>('expense', ExpenseSchema);

export default ExpenseModel;
