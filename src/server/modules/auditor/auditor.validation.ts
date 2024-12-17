import { z } from 'zod';

const auditorSchema = z.object({
  customer: z.string({
    required_error: 'Customer ID is required',
  }),
  auditor: z.string({
    required_error: 'Auditor ID is required',
  }),
  status: z.enum(['invited', 'verified']).optional(),
});
const updateAuditorSchema = z.object({
  status: z.enum(['invited', 'verified']).optional(),
});

export const auditorValidation = {
  auditorSchema,
  updateAuditorSchema,
};
