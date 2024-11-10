import { z } from 'zod'; // Import Zod for validation

const ruleSchema = z.object({
  description_contains: z.string().nonempty('Description is required'),
  expense_type: z.enum(['personal', 'business'], {
    required_error: 'Expense type is required',
  }),
  category: z.string({
    required_error: 'Category is required',
  }),
});

const deleteRuleSchema = z.object({
  _id: z.string().min(1, 'Rule ID is required'),
});

export const ruleValidation = { ruleSchema, deleteRuleSchema };
