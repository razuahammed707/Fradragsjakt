import { DependantKeys } from '@/utils/constants/DependantKeys';
import { z } from 'zod';

export const ExpenseFormSchema = z
  .object({
    description: z.string().min(1, { message: 'Description is required' }),
    amount: z.string().min(1, { message: 'Amount is required' }),
    expense_type: z.enum(['business', 'personal'], {
      errorMap: () => ({
        message: 'Expense type must be either business or personal',
      }),
    }),
    category: z.string().min(1, { message: 'Category is required' }),
    sub_category: z.string().optional(),
    tag_category: z.string().optional(),
    sub_category_dependant: z.string().optional(),
    receipt: z
      .object({
        link: z.string().url({ message: 'Invalid URL for receipt link' }),
        mimeType: z.string().min(1, { message: 'MIME type is required' }),
      })
      .optional(),
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

export type ExpenseFormData = z.infer<typeof ExpenseFormSchema>;
