import { z } from 'zod';

export const ExpenseFormSchema = z.object({
  description: z.string().min(1, { message: 'Description is required' }),
  transaction_date: z.coerce.date({ message: 'Date is required' }),
  amount: z.string().min(1, { message: 'Amount is required' }),
  category: z.string().min(1, { message: 'Category is required' }),
  note: z.string().optional(),
  receipt: z
    .object({
      link: z.string(),
      mimeType: z.string(),
    })
    .nullable()
    .optional(),
  expense_type: z.enum(['business', 'personal', 'unknown'], {
    required_error: 'Status is required',
  }),
});

export type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
