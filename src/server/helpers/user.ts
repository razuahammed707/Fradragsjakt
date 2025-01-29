/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiError } from '@/lib/exceptions';
import httpStatus from 'http-status';
import { errorHandler } from '@/server/middlewares/error-handler';
import User from '@/server/db/models/user';
import { userValidation } from '../modules/users/users.validation';
import { z } from 'zod';
import { QuestionKeysMap } from '@/utils/constants/QuestionKeys';

type QuestionnaireAnswer = {
  [key: string]: Array<{ [key: string]: string }>;
};

type Questionnaire = {
  question: string;
  answers: QuestionnaireAnswer[];
  _id?: string;
};

type BulkQuestionnaireInput = z.infer<
  typeof userValidation.userBulkQuestionnaireSchema
>;

export const filterAndUpdateQuestionnaires = (
  existingQuestionnaires: Questionnaire[],
  newQuestionnaires: Questionnaire[]
): Questionnaire[] => {
  const result = JSON.parse(JSON.stringify(existingQuestionnaires));

  newQuestionnaires.forEach((newQ) => {
    const existingIndex = result.findIndex(
      (q: any) => q.question === newQ.question
    );

    if (existingIndex >= 0) {
      const existingQ = result[existingIndex];

      newQ.answers.forEach((newAnswer) => {
        const subCategory = Object.keys(newAnswer)[0];
        const mappedKey = QuestionKeysMap[subCategory];

        const existingAnswerIndex = existingQ.answers.findIndex(
          (a: any) => Object.keys(a)[0] === subCategory
        );

        if (existingAnswerIndex >= 0) {
          const existingAnswer = existingQ.answers[existingAnswerIndex];
          const existingFields = existingAnswer[subCategory][0];
          const newValue = newAnswer[subCategory][0][mappedKey];

          existingAnswer[subCategory][0] = {
            ...existingFields,
            [mappedKey]: newValue,
          };
        } else {
          existingQ.answers.push({
            [subCategory]: [
              {
                [mappedKey]: newAnswer[subCategory][0][mappedKey],
              },
            ],
          });
        }
      });
    } else {
      result.push({
        question: newQ.question,
        answers: newQ.answers.map((answer) => {
          const subCategory = Object.keys(answer)[0];
          const mappedKey = QuestionKeysMap[subCategory];
          const newValue = answer[subCategory][0][mappedKey];

          return {
            [subCategory]: [
              {
                [mappedKey]: newValue,
              },
            ],
          };
        }),
      });
    }
  });

  return result;
};

async function updateBulkQuestionnaires(
  userId: string,
  questionnaires: BulkQuestionnaireInput['questionnaires']
): Promise<Questionnaire[]> {
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
