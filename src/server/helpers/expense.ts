import { ApiError } from '@/lib/exceptions';
import { ExpenseType, IExpense } from '../db/interfaces/expense';
import CategoryModel from '../db/models/category';
import ExpenseModel from '../db/models/expense';
import RuleModel from '../db/models/rules';
import httpStatus from 'http-status';

async function findMatchingRule(description: string, userId: string) {
  try {
    return await RuleModel.findOne({
      $or: [
        { description_contains: { $regex: description, $options: 'i' } },
        { category_title: { $regex: description, $options: 'i' } },
      ],
      user: userId,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Erro finding matched rule: ${errorMessage}`
    );
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
    const errorMessage =
      error instanceof Error ? error.message : 'An unknown error occurred';
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Failed to create expenses: ${errorMessage}`
    );
  }
}

async function createExpenseFromBulkInput(
  input: { description: string; amount: number },
  userId: string
) {
  try {
    // check rule
    const rule = await findMatchingRule(input.description, userId);

    if (rule) {
      return await ExpenseModel.create({
        ...input,
        user: userId,
        expense_type: rule.expense_type || ExpenseType.unknown,
        category: rule.category_title || 'unknown',
        rule: rule._id,
      });
    }

    // Create the expense record with default values if no rule found
    return await ExpenseModel.create({
      ...input,
      user: userId,
      expense_type: ExpenseType.unknown,
      category: 'unknown',
    });
  } catch (error) {
    console.log('bulk expense error:', error);
  }
}

export const ExpenseHelpers = {
  createExpenseRecord,
  createExpenseFromBulkInput,
};
