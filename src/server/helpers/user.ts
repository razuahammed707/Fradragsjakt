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
  console.log('Existing questionnaires:', existingQuestionnaires);
  console.log('New questionnaires to merge:', newQuestionnaires);

  // Filter out questionnaires that don't have changes
  const questionnairesToUpdate = newQuestionnaires.filter((newQ) => {
    const existingQ = existingQuestionnaires.find(
      (q) => q.question === newQ.question
    );
    if (!existingQ) return true;

    // Check if there are new answers or different values
    return newQ.answers.some((newAnswer) => {
      const subCategory = Object.keys(newAnswer)[0];
      const existingAnswer = existingQ.answers.find(
        (a) => Object.keys(a)[0] === subCategory
      );

      if (!existingAnswer) return true;

      // Check if the values are different
      const newValue = newAnswer[subCategory][0]['Documented care expenses'];
      const existingValue =
        existingAnswer[subCategory][0]['Documented care expenses'];
      return newValue !== existingValue;
    });
  });

  if (questionnairesToUpdate.length === 0) {
    console.log('No changes detected');
    return existingQuestionnaires;
  }

  // Start with existing questionnaires
  const result = [...existingQuestionnaires];

  // Update or add new questionnaires
  questionnairesToUpdate.forEach((newQ) => {
    const existingIndex = result.findIndex((q) => q.question === newQ.question);

    if (existingIndex >= 0) {
      // Update existing questionnaire
      const existingQ = result[existingIndex];

      // Update or add new answers
      newQ.answers.forEach((newAnswer) => {
        const subCategory = Object.keys(newAnswer)[0];
        const existingAnswerIndex = existingQ.answers.findIndex(
          (a) => Object.keys(a)[0] === subCategory
        );

        if (existingAnswerIndex >= 0) {
          // Update existing answer
          existingQ.answers[existingAnswerIndex] = newAnswer;
        } else {
          // Add new answer
          existingQ.answers.push(newAnswer);
        }
      });
    } else {
      // Add new questionnaire
      result.push(newQ);
    }
  });

  console.log('Final questionnaires:', result);
  return result;
};

async function updateBulkQuestionnaires(
  userId: string,
  questionnaires: BulkQuestionnaireInput['questionnaires']
) {
  try {
    console.log('Updating questionnaires for user:', userId);
    console.log('New questionnaires:', questionnaires);

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

    console.log(
      'Successfully updated questionnaires:',
      updatedUser.questionnaires
    );
    return updatedUser.questionnaires;
  } catch (error) {
    console.error('Error updating questionnaires:', error);
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

export const UserHelpers = {
  filterAndUpdateQuestionnaires,
  updateBulkQuestionnaires,
};
