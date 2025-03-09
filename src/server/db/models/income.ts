import mongoose, { Schema } from 'mongoose';
import { IIncome, IncomeType } from '../interfaces/income';

const incomeSchema = new Schema(
  {
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    income_type: {
      type: String,
      enum: Object.values(IncomeType),
      default: IncomeType.unknown,
    },
    amount: { type: Number, required: true },
    receipt: { link: String, mimeType: String },
    transaction_date: { type: Date },
    user: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    rule: { type: Schema.Types.ObjectId, ref: 'rule' },
  },
  { timestamps: true }
);

incomeSchema.index({ description: 1 });
incomeSchema.index({ category: 1 });
incomeSchema.index({ sub_category: 1 });
incomeSchema.index({ tag_category: 1 });
incomeSchema.index({ income_type: 1 });

const IncomeModel =
  mongoose.models.income || mongoose.model<IIncome>('income', incomeSchema);

export default IncomeModel;
