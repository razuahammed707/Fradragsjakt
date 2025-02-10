import { z } from 'zod';

export const RuleFormSchema = z
  .object({
    description_contains: z
      .string()
      .min(1, { message: 'Description is required' }),
    expense_type: z.enum(['business', 'personal'], {
      errorMap: () => ({
        message: 'Expense type must be either business or personal',
      }),
    }),
    category: z.string().min(1, { message: 'Category is required' }),
    sub_category: z.string().optional(),
    tag_category: z.string().optional(),
  })
  .refine((data) => data.sub_category || data.tag_category, {
    message: 'Tag category is required when no sub-category is selected',
    path: ['tag_category'],
  });

export type RuleFormData = z.infer<typeof RuleFormSchema>;
