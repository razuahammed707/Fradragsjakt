/* eslint-disable @typescript-eslint/no-explicit-any */
import User from '@/server/db/models/user';
import httpStatus from 'http-status';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { userValidation } from './users.validation';
import { z } from 'zod';
import { errorHandler } from '@/server/middlewares/error-handler';
import { ApiError } from '@/lib/exceptions';
import bcrypt from 'bcrypt';
import { ApiResponse } from '@/server/db/types';
import { UserHelpers } from '@/server/helpers/user';

type Answer = z.infer<typeof userValidation.answerSchema>;
type QuestionnaireItem = z.infer<typeof userValidation.userQuestionnaireSchema>;

export const userRouter = router({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const loggedUser = ctx.user as JwtPayload;
    const users = await User.find({});

    return {
      users,
      loggedUser,
    };
  }),

  getUserByEmail: protectedProcedure.query(async ({ ctx }) => {
    try {
      const sessionUser = ctx.user as JwtPayload;

      if (!sessionUser || !sessionUser.id) {
        throw new Error('You must be logged in to access this data.');
      }

      const user = await User.findOne({
        $or: [{ _id: sessionUser.id }, { email: sessionUser.email }],
      });

      if (!user) {
        throw new Error('User not found');
      }

      return sessionUser?.audit_for ? { ...user._doc, role: 'auditor' } : user;
    } catch (error) {
      console.log('error from get user by email', error);
      const { message } = errorHandler(error);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  }),
  updateUserAvatar: protectedProcedure
    .input(userValidation.updateUserAvatarSchema)
    .mutation(async ({ ctx, input }) => {
      const { image } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error('You must be logged in to update your avatar.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      user.image = image;
      await user.save();

      return user;
    }),
  updateUser: protectedProcedure
    .input(userValidation.updateUserSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        questionnaires = [],
        isSawInstructions = false,
        profile = [],
      } = input;

      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error('You must be logged in to update this data.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        {
          questionnaires,
          isStepperSkippedOrCompleted: true,
          isSawInstructions,
          profile,
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('User update failed');
      }

      return updatedUser;
    }),
  updateUserPersonalInfo: protectedProcedure
    .input(userValidation.updateUserPersonalInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const { firstName, lastName, profile } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error(
          'You must be logged in to update your personal information.'
        );
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      user.firstName = firstName;
      user.lastName = lastName;
      user.profile = profile;
      await user.save();

      return user;
    }),
  updateUserPassword: protectedProcedure
    .input(userValidation.updateUserPasswordSchema)
    .mutation(async ({ ctx, input }) => {
      const { oldPassword, newPassword } = input;
      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error('You must be logged in to update your password.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error('Current password you provided is incorrect!');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      return { message: 'Password updated successfully.' };
    }),
  updateUserQuestionnaires: protectedProcedure
    .input(userValidation.userQuestionnaireSchema)
    .mutation(async ({ ctx, input }) => {
      const { question, answers } = input;

      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser?.email) {
        throw new Error('You must be logged in to update questionnaires.');
      }

      const user = await User.findOne({ email: sessionUser.email });
      if (!user) {
        throw new Error('User not found.');
      }
      const mergeAnswers = (
        existingAnswers: (string | Answer)[],
        newAnswers: Answer[]
      ): Answer[] => {
        const mergedMap = new Map<string, Map<string, string>>();

        existingAnswers.forEach((answer) => {
          if (typeof answer === 'string') {
            mergedMap.set(answer, new Map());
          } else {
            const [key, fields] = Object.entries(answer)[0];
            const fieldMap = new Map(
              fields.map((field) => Object.entries(field)[0])
            );
            mergedMap.set(key, fieldMap);
          }
        });

        newAnswers.forEach((answer) => {
          const [key, fields] = Object.entries(answer)[0];
          if (!mergedMap.has(key)) {
            mergedMap.set(
              key,
              new Map(fields.map((field) => Object.entries(field)[0]))
            );
          } else {
            const existingFieldMap = mergedMap.get(key)!;
            fields.forEach((field) => {
              const [fieldKey, fieldValue] = Object.entries(field)[0];
              existingFieldMap.set(fieldKey, fieldValue);
            });
          }
        });

        return Array.from(mergedMap.entries()).map(([key, fieldsMap]) => ({
          [key]: Array.from(fieldsMap.entries()).map(
            ([fieldKey, fieldValue]) => ({
              [fieldKey]: fieldValue,
            })
          ),
        }));
      };

      const questionnaires = user.questionnaires || [];
      const existingIndex = questionnaires.findIndex(
        (item: QuestionnaireItem) => item.question === question
      );

      if (existingIndex !== -1) {
        const existingQuestionnaire = questionnaires[existingIndex];
        questionnaires[existingIndex] = {
          question: existingQuestionnaire.question,
          answers: mergeAnswers(existingQuestionnaire.answers, answers),
        };
      } else {
        questionnaires.push({ question, answers });
      }
      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { questionnaires },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('Failed to update user questionnaires.');
      }

      return updatedUser;
    }),
  updateBulkQuestionnaires: protectedProcedure
    .input(userValidation.userBulkQuestionnaireSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { questionnaires } = input;

        const updatedQuestionnaires =
          await UserHelpers.updateBulkQuestionnaires(
            loggedUser.id,
            questionnaires
          );

        return {
          status: 200,
          message: 'Questionnaires updated successfully',
          data: updatedQuestionnaires,
        } as ApiResponse<typeof updatedQuestionnaires>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
