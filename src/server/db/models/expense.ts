import mongoose, { Schema } from 'mongoose';
import { ExpenseType, IExpense } from '../interfaces/expense';

const ExpenseSchema = new Schema<IExpense>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    transaction_date: {
      type: Date,
    },
    amount: {
      type: Number,
      required: true,
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
    note: {
      type: String,
    },
    receipt: {
      link: String,
      mimeType: String,
    },
    rule: {
      type: Schema.Types.ObjectId,
      ref: 'rule',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

ExpenseSchema.index({ description: 1 });
ExpenseSchema.index({ category: 1 });
ExpenseSchema.index({ expense_type: 1 });

const ExpenseModel =
  mongoose.models.expense || mongoose.model<IExpense>('expense', ExpenseSchema);

export default ExpenseModel;
