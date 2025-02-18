import RuleModel from '@/server/db/models/rules';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import CategoryModel from '@/server/db/models/category';
import httpStatus from 'http-status';
import { ApiError, AuthError } from '@/lib/exceptions';
import IncomeModel from '../db/models/income';
import ExpenseModel from '../db/models/expense';
import { errorHandler } from '../middlewares/error-handler';

type UpdateResult = {
  count: number;
  items: any[];
};

type TransactionUpdateResults = {
  expenses: UpdateResult;
  incomes: UpdateResult;
};

type RuleResponse = {
  rule: any;
  updatedTransactions: TransactionUpdateResults;
};

async function validateUser(user: JwtPayload | undefined): Promise<void> {
  try {
    if (!user?.id) {
      throw new AuthError('You must be logged in to create this rule.');
    }
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.UNAUTHORIZED, message);
  }
}

type RuleQuery = {
  user: string;
  _id?: { $ne: string };
};

async function checkExistingRule(
  userId: string,
  input: any,
  ruleIdToExclude?: string
): Promise<void> {
  try {
    const query: RuleQuery = {
      user: userId,
    };

    if (ruleIdToExclude) {
      query._id = { $ne: ruleIdToExclude };
    }

    const existingRules = await RuleModel.find(query);

    for (const rule of existingRules) {
      const existingDescriptionContains = rule.description_contains;

      if (input.description_contains.includes(existingDescriptionContains)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `The rule with "description_contains: ${existingDescriptionContains}" already exists!`
        );
      }

      if (existingDescriptionContains.includes(input.description_contains)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `The rule with "description_contains: ${input.description_contains}" already exists!`
        );
      }
    }
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
}

async function findCategory(categoryTitle: string) {
  try {
    const category = await CategoryModel.findOne({
      title: categoryTitle,
    });

    if (!category) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Category not found');
    }

    return category;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
}
async function createNewRule(input: any, userId: string, category: any) {
  try {
    return await RuleModel.create({
      ...input,
      user: userId,
      category: category._id,
      category_title: category.title,
    });
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
}
async function updateExistingRule(
  ruleId: string,
  updateData: any,
  category: any
) {
  try {
    return await RuleModel.findByIdAndUpdate(
      ruleId,
      {
        ...updateData,
        category: category._id,
        category_title: category.title,
      },
      { new: true }
    );
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.BAD_REQUEST, message);
  }
}
async function updateTransactions(
  userId: string,
  rule: any,
  input: any
): Promise<TransactionUpdateResults> {
  try {
    const updateFields = {
      category: input.category,
      sub_category: input.sub_category,
      tag_category: input.tag_category,
      rule: rule._id,
    };

    const expenseUpdateResult = await ExpenseModel.updateMany(
      {
        user: userId,
        description: { $regex: input.description_contains, $options: 'i' },
        category: 'unknown',
        expense_type: 'unknown',
      },
      {
        $set: {
          ...updateFields,
          expense_type: input.expense_type,
        },
      }
    );

    const incomeUpdateResult = await IncomeModel.updateMany(
      {
        user: userId,
        description: { $regex: input.description_contains, $options: 'i' },
        category: 'unknown',
        income_type: 'unknown',
      },
      {
        $set: {
          ...updateFields,
          income_type: input.expense_type,
        },
      }
    );

    const updatedExpenses = await ExpenseModel.find({
      user: userId,
      rule: rule._id,
    });

    const updatedIncomes = await IncomeModel.find({
      user: userId,
      rule: rule._id,
    });

    return {
      expenses: {
        count: expenseUpdateResult.modifiedCount,
        items: updatedExpenses,
      },
      incomes: {
        count: incomeUpdateResult.modifiedCount,
        items: updatedIncomes,
      },
    };
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
async function findByRuleAndUpdateTransactions(
  ruleId: string,
  userId: string,
  updateData: any,
  category: any
) {
  try {
    const [expenseUpdates, incomeUpdates] = await Promise.all([
      ExpenseModel.updateMany(
        {
          rule: ruleId,
          description: {
            $regex: updateData.description_contains,
            $options: 'i',
          },
        },
        {
          $set: {
            category: category.title,
            expense_type: updateData.expense_type,
            sub_category: updateData.sub_category,
            tag_category: updateData.tag_category,
          },
        }
      ),
      IncomeModel.updateMany(
        {
          rule: ruleId,
          description: {
            $regex: updateData.description_contains,
            $options: 'i',
          },
        },
        {
          $set: {
            category: category.title,
            income_type: updateData.expense_type,
            sub_category: updateData.sub_category,
            tag_category: updateData.tag_category,
          },
        }
      ),
    ]);

    await Promise.all([
      ExpenseModel.updateMany(
        {
          rule: ruleId,
          description: {
            $not: { $regex: updateData.description_contains, $options: 'i' },
          },
        },
        {
          $set: {
            category: 'unknown',
            expense_type: 'unknown',
            sub_category: '',
            tag_category: '',
          },
        }
      ),
      IncomeModel.updateMany(
        {
          rule: ruleId,
          description: {
            $not: { $regex: updateData.description_contains, $options: 'i' },
          },
        },
        {
          $set: {
            category: 'unknown',
            income_type: 'unknown',
            sub_category: '',
            tag_category: '',
          },
        }
      ),
    ]);

    const updatedExpenses = await ExpenseModel.find({
      user: userId,
      rule: ruleId,
    });

    const updatedIncomes = await IncomeModel.find({
      user: userId,
      rule: ruleId,
    });

    return {
      expenses: {
        count: expenseUpdates.modifiedCount,
        items: updatedExpenses,
      },
      incomes: {
        count: incomeUpdates.modifiedCount,
        items: updatedIncomes,
      },
    };
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
async function updateTransactionsOnRuleDeletion(ruleId: string | string[]) {
  try {
    const [expenseUpdates, incomeUpdates] = await Promise.all([
      ExpenseModel.updateMany(
        { rule: ruleId },
        {
          $set: {
            category: 'unknown',
            expense_type: 'unknown',
            sub_category: '',
            tag_category: '',
          },
        }
      ),
      IncomeModel.updateMany(
        { rule: ruleId },
        {
          $set: {
            category: 'unknown',
            income_type: 'unknown',
            sub_category: '',
            tag_category: '',
          },
        }
      ),
    ]);

    return {
      expenses: { count: expenseUpdates.modifiedCount },
      incomes: { count: incomeUpdates.modifiedCount },
    };
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
}
async function findExistingRule(ruleId: string, userId: string) {
  try {
    const rule = await RuleModel.findOne({
      _id: ruleId,
      user: userId,
    });

    if (!rule) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Rule not found or unauthorized'
      );
    }

    return rule;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

function createSuccessResponse(
  rule: any,
  updatedTransactions: TransactionUpdateResults
): ApiResponse<RuleResponse> {
  return {
    message: 'Rule created and applied successfully',
    status: httpStatus.OK,
    data: {
      rule,
      updatedTransactions,
    },
  };
}

function updateSuccessResponse(
  rule: any,
  updatedTransactions: TransactionUpdateResults
): ApiResponse<RuleResponse> {
  return {
    message: 'Rule updated and applied successfully',
    status: httpStatus.OK,
    data: {
      rule,
      updatedTransactions,
    },
  };
}
async function findMatchingRulesForBatch(
  descriptions: string[],
  userId: string
) {
  return await RuleModel.find({
    description: { $in: descriptions },
    user: userId,
  });
}

export const RuleHelpers = {
  validateUser,
  checkExistingRule,
  createNewRule,
  updateTransactions,
  createSuccessResponse,
  findExistingRule,
  updateExistingRule,
  findCategory,
  findByRuleAndUpdateTransactions,
  updateSuccessResponse,
  updateTransactionsOnRuleDeletion,
  findMatchingRulesForBatch,
};
