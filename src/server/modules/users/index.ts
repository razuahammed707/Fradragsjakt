import User from '@/server/db/models/user';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { userValidation } from './users.validation';
import { z } from 'zod';

type Answer = z.infer<typeof userValidation.answerSchema>;
type QuestionnaireItem = z.infer<typeof userValidation.userQuestionnaireSchema>;

export const userRouter = router({
  // Get all users and the logged-in user from the session
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const loggedUser = ctx.user as JwtPayload; // Retrieve the logged-in user from context
    const users = await User.find({}); // Fetch all users

    return {
      users,
      loggedUser,
    };
  }),

  getUserByEmail: protectedProcedure.query(async ({ ctx }) => {
    const sessionUser = ctx.user as JwtPayload;

    if (!sessionUser || !sessionUser?.email) {
      throw new Error('You must be logged in to access this data.');
    }
    const user = await User.findOne({ email: sessionUser.email });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }),

  updateUser: protectedProcedure
    .input(userValidation.userSchema)
    .mutation(async ({ ctx, input }) => {
      const { questionnaires } = input;

      const sessionUser = ctx.user as JwtPayload;
      if (!sessionUser || !sessionUser?.email) {
        throw new Error('You must be logged in to update this data.');
      }

      const user = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { questionnaires: questionnaires },
        { new: true } // This option returns the updated document
      );

      if (!user) {
        throw new Error('User not found');
      }

      return user;
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
        throw new Error('User not found');
      }

      // Merge function similar to Redux logic
      const mergeAnswers = (
        existingAnswers: Answer[],
        newAnswers: Answer[]
      ): Answer[] => {
        const mergedAnswers = existingAnswers.map((existingAnswer) => {
          const existingKey = Object.keys(existingAnswer)[0];
          const newAnswer = newAnswers.find(
            (answer) => Object.keys(answer)[0] === existingKey
          );

          if (newAnswer) {
            const mergedFields = [
              ...Object.values(existingAnswer)[0].map((field) => {
                const fieldKey = Object.keys(field)[0];
                const matchingField = Object.values(newAnswer)[0].find(
                  (newField) => Object.keys(newField)[0] === fieldKey
                );
                return matchingField || field;
              }),
              ...Object.values(newAnswer)[0].filter(
                (newField) =>
                  !Object.values(existingAnswer)[0].some(
                    (field) =>
                      Object.keys(field)[0] === Object.keys(newField)[0]
                  )
              ),
            ];
            return { [existingKey]: mergedFields };
          }
          return existingAnswer;
        });

        const newAnswersToAdd = newAnswers.filter(
          (newAnswer) =>
            !existingAnswers.some(
              (existingAnswer) =>
                Object.keys(existingAnswer)[0] === Object.keys(newAnswer)[0]
            )
        );

        return [...mergedAnswers, ...newAnswersToAdd];
      };

      // Get existing questionnaires or initialize empty array
      const questionnaires = user.questionnaires || [];

      // Find existing questionnaire with same question
      const existingIndex = questionnaires.findIndex(
        (item: QuestionnaireItem) => item.question === question
      );

      let updatedQuestionnaires;
      if (existingIndex !== -1) {
        // Update existing questionnaire
        const existingQuestionnaire = questionnaires[existingIndex];
        questionnaires[existingIndex] = {
          ...existingQuestionnaire,
          answers: mergeAnswers(existingQuestionnaire.answers, answers),
        };
        updatedQuestionnaires = questionnaires;
      } else {
        // Add new questionnaire
        updatedQuestionnaires = [...questionnaires, { question, answers }];
      }

      // Update user with merged questionnaires
      const updatedUser = await User.findOneAndUpdate(
        { email: sessionUser.email },
        { questionnaires: updatedQuestionnaires },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error('Failed to update user questionnaires');
      }

      return updatedUser;
    }),
});
