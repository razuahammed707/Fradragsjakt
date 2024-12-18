import { z } from 'zod';

const auditorSchema = z.object({
  auditor_email: z.string({
    required_error: 'Auditor Email is required',
  }),
  message: z.string({}).optional(),
});
const updateAuditorSchema = z.object({
  status: z.enum(['invited', 'verified']).optional(),
});

export const auditorValidation = {
  auditorSchema,
  updateAuditorSchema,
};
