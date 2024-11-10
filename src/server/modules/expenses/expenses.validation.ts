import { z } from 'zod';

const createExpenseSchema = z.object({
  description: z.string({
    required_error: 'Description is required',
  }),
  expense_type: z.enum(['personal', 'business', 'unknown'], {
    required_error: 'Expense type is required',
  }),
  category: z.string({
    required_error: 'Category is required',
  }),
  amount: z.number({
    required_error: 'Amount is required',
  }),
});
const createBulkExpenseSchema = z.array(
  z.object({
    description: z.string({
      required_error: 'Description is required',
    }),
    amount: z.number({
      required_error: 'Amount is required',
    }),
  })
);

export const expenseValidation = {
  createExpenseSchema,
  createBulkExpenseSchema,
};
