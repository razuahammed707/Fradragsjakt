import { ApiError } from '@/lib/exceptions';
import { ExpenseType, IExpense } from '../db/interfaces/expense';
import CategoryModel from '../db/models/category';
import ExpenseModel from '../db/models/expense';
import RuleModel from '../db/models/rules';
import httpStatus from 'http-status';
import { errorHandler } from '../middlewares/error-handler';

async function findMatchingRule(description: string, userId: string) {
  try {
    // Escape special regex characters in the description
    const escapedDescription = description.replace(
      /[-/\\^$*+?.()|[\]{}]/g,
      '\\$&'
    );

    return await RuleModel.findOne({
      $or: [
        { description_contains: { $regex: escapedDescription, $options: 'i' } },
        { category_title: { $regex: escapedDescription, $options: 'i' } },
      ],
      user: userId,
    });
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

async function createExpenseRecord(input: IExpense, userId: string) {
  try {
    // Upsert category
    const category = await CategoryModel.findOneAndUpdate(
      {
        title: input.category,
        creator_id: userId,
      },
      {
        $setOnInsert: {
          title: input.category,
          creator_id: userId,
        },
      },
      { upsert: true, new: true }
    );

    // Upsert rule
    const updatedRule = await RuleModel.findOneAndUpdate(
      {
        description_contains: input.description,
        user: userId,
      },
      {
        $setOnInsert: {
          expense_type: input.expense_type,
          category_title: input.category,
          category: category?._id,
        },
      },
      { upsert: true, new: true }
    );

    // Create the expense record with updated or default rule and category information
    return await ExpenseModel.create({
      ...input,
      user: userId,
      expense_type:
        updatedRule?.expense_type || input.expense_type || ExpenseType.unknown,
      category: category?.title || input.category || 'unknown',
      rule: updatedRule?._id,
    });
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

async function createExpenseFromBulkInput(
  input: { description: string; amount: number },
  userId: string
) {
  try {
    // Check rule
    const rule = await findMatchingRule(input.description, userId);

    const expenseData = {
      ...input,
      user: userId,
      expense_type: rule?.expense_type || ExpenseType.unknown,
      category: rule?.category_title || 'unknown',
      rule: rule?._id,
    };

    return await ExpenseModel.findOneAndUpdate(
      { description: input.description, user: userId },
      expenseData,
      { upsert: true, new: true }
    );
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

export const ExpenseHelpers = {
  createExpenseRecord,
  createExpenseFromBulkInput,
  findMatchingRule,
};
