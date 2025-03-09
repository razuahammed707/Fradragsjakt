import mongoose, { Schema } from 'mongoose';
import { ExpenseType, IExpense } from '../interfaces/expense';

const expenseSchema = new Schema(
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
    sub_category: {
      type: String,
    },
    tag_category: {
      type: String,
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

expenseSchema.index({ description: 1 });
expenseSchema.index({ category: 1 });
expenseSchema.index({ sub_category: 1 });
expenseSchema.index({ tag_category: 1 });
expenseSchema.index({ expense_type: 1 });

const ExpenseModel =
  mongoose.models.expense || mongoose.model<IExpense>('expense', expenseSchema);

export default ExpenseModel;
