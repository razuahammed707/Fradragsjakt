import { z } from 'zod';

const subAnswerSchema = z.record(z.string());

const answerSchema = z.record(z.array(subAnswerSchema));
const userQuestionnaireSchema = z.object({
  question: z.string(),
  answers: z.array(answerSchema),
});

// Schema for bulk update
export const userBulkQuestionnaireSchema = z.object({
  questionnaires: z.array(
    z.object({
      question: z.string(),
      answers: z.array(
        z.record(z.string(), z.array(z.record(z.string(), z.string())))
      ),
    })
  ),
});

const userSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string().optional(),
  provider: z.enum(['credentials', 'google']).optional(),
  role: z.enum(['admin', 'auditor', 'customer']).optional(),
  image: z.string().optional(),
  profile: z.array(z.string()).optional(),
  questionnaires: z
    .array(
      z.object({
        question: z.string(),
        answers: z.array(z.string()),
      })
    )
    .optional(),
  isVerified: z.boolean().optional(),
});
const updateUserSchema = z.object({
  profile: z.array(z.string()).optional(),
  questionnaires: z
    .object({
      children_under_12: z.any().nullable(),
      occupations: z.array(z.string()),
      start_date: z.string().optional(),
      has_travel: z.boolean(),
      has_meals: z.boolean(),
      has_driving: z.boolean(),
      has_workspace: z.boolean(),
      has_special_care_children: z.boolean().nullable(),
      has_parental_allowance: z.boolean().nullable(),
    })
    .optional(),
  isSawInstructions: z.boolean().optional(),
});
const updateUserPasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6, 'Password must be at least 6 characters long'),
});
const updateUserPersonalInfoSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  profile: z.array(z.string()),
});
const updateUserAvatarSchema = z.object({
  image: z.string(),
});
export const userValidation = {
  userSchema,
  updateUserSchema,
  userQuestionnaireSchema,
  userBulkQuestionnaireSchema,
  answerSchema,
  updateUserPasswordSchema,
  updateUserPersonalInfoSchema,
  updateUserAvatarSchema,
};
