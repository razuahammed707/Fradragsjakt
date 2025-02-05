import { z } from 'zod';

const createExpenseSchema = z.object({
  id: z.string({}).optional(),
  description: z.string({
    required_error: 'Description is required',
  }),
  expense_type: z.enum(['personal', 'business', 'unknown'], {
    required_error: 'Expense type is required',
  }),
  category: z.string({
    required_error: 'Category is required',
  }),
  sub_category: z.string().optional(),
  tag_category: z.string().optional(),
  amount: z.number({
    required_error: 'Amount is required',
  }),
  receipt: z
    .object({
      link: z.string(),
      mimeType: z.string(),
    })
    .optional(),
});
const createBulkExpenseSchema = z.array(
  z.object({
    description: z.string({
      required_error: 'Description is required',
    }),
    amount: z.number({
      required_error: 'Amount is required',
    }),
    transaction_date: z.any().optional(),
  })
);

const expenseUpdatePayloadSchema = z.object({
  rule: z.string(),
  category: z.string(),
  expense_type: z.string(),
  sub_category: z.string().optional(),
  tag_category: z.string().optional(),
});
const populateStatementSchema = z.array(
  z.object({
    description: z.string({
      required_error: 'Description is required',
    }),
    withdrawal: z.number(),
    deposit: z.number(),
    transaction_date: z.any(),
  })
);

const updateBulkExpenseSchema = z.object({
  expenses: z.array(
    z.object({
      expenseUpdatePayload: expenseUpdatePayloadSchema,
      _id: z.string(),
    })
  ),
});

export const expenseValidation = {
  createExpenseSchema,
  createBulkExpenseSchema,
  updateBulkExpenseSchema,
  populateStatementSchema,
};
