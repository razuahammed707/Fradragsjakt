/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '@/lib/exceptions';
import httpStatus from 'http-status';
import { errorHandler } from '@/server/middlewares/error-handler';
import User from '@/server/db/models/user';
import { userValidation } from '../modules/users/users.validation';
import { z } from 'zod';

type BulkQuestionnaireInput = z.infer<
  typeof userValidation.userBulkQuestionnaireSchema
>;

export const filterAndUpdateQuestionnaires = (
  existingQuestionnaires: any[],
  newQuestionnaires: any[]
) => {
  const updatedQuestionnaires = newQuestionnaires.map((newQ) => {
    const existingQ = existingQuestionnaires.find(
      (q) => q.question === newQ.question
    );

    if (existingQ) {
      const mergedAnswers = [
        ...existingQ.answers.filter(
          (existingAnswer: any) =>
            !newQ.answers.some((newAnswer: any) =>
              typeof existingAnswer === 'string'
                ? existingAnswer === newAnswer
                : Object.keys(existingAnswer)[0] === Object.keys(newAnswer)[0]
            )
        ),
        ...newQ.answers,
      ];

      return { ...existingQ, answers: mergedAnswers };
    }

    return newQ;
  });

  const preservedQuestionnaires = existingQuestionnaires.filter(
    (existingQ) =>
      !newQuestionnaires.some((newQ) => newQ.question === existingQ.question)
  );

  return [...updatedQuestionnaires, ...preservedQuestionnaires];
};

async function updateBulkQuestionnaires(
  userId: string,
  questionnaires: BulkQuestionnaireInput['questionnaires']
) {
  console.log({ questionnaires });

  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const updatedQuestionnaires = filterAndUpdateQuestionnaires(
      user.questionnaires || [],
      questionnaires
    );

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        questionnaires: updatedQuestionnaires,
        isStepperSkippedOrCompleted: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('Failed to update user questionnaires');
    }

    return updatedUser.questionnaires;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

export const UserHelpers = {
  filterAndUpdateQuestionnaires,
  updateBulkQuestionnaires,
};
