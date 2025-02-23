import { z } from 'zod';

export const RuleFormSchema = z.object({
  description_contains: z
    .string()
    .min(1, { message: 'Description is required' }),
  expense_type: z.enum(['business', 'personal'], {
    errorMap: () => ({
      message: 'Expense type must be either business or personal',
    }),
  }),
  category: z.string().min(1, { message: 'Category is required' }),
});

export type RuleFormData = z.infer<typeof RuleFormSchema>;
