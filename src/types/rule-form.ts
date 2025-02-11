import { DependantKeys } from '@/utils/constants/DependantKeys';
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
    sub_category_dependant: z.string().optional(),
  })
  .refine((data) => data.sub_category || data.tag_category, {
    message: 'Tag category is required when no sub-category is selected',
    path: ['tag_category'],
  })
  .refine(
    (data) => {
      if (data.sub_category && DependantKeys[data.sub_category]) {
        return (
          !!data.sub_category_dependant &&
          data.sub_category_dependant.trim() !== ''
        );
      }
      return true;
    },
    {
      message: 'Additional information is required for this sub-category',
      path: ['sub_category_dependant'],
    }
  );

export type RuleFormData = z.infer<typeof RuleFormSchema>;
