import { ApiError } from '@/lib/exceptions';
import {
  ExpenseType,
  IExpense,
  IExpenseUpdate,
} from '../db/interfaces/expense';
import CategoryModel from '../db/models/category';
import ExpenseModel from '../db/models/expense';
import RuleModel from '../db/models/rules';
import httpStatus from 'http-status';
import { errorHandler } from '../middlewares/error-handler';
import { IRule } from '../db/interfaces/rules';
import { JwtPayload } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { IncomeType } from '../db/interfaces/income';
import IncomeModel from '../db/models/income';

async function findMatchingRule(description: string, userId: string) {
  try {
    const normalizedDescription = description
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[^\w\s]/g, '');

    const rules = await RuleModel.find({
      user: userId,
    });

    const matchingRule = rules.find((rule) => {
      const normalizedRule = rule.description_contains
        .toLowerCase()
        .normalize('NFKD')
        .replace(/[^\w\s]/g, '');

      return normalizedDescription.includes(normalizedRule);
    });

    return matchingRule || null;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

async function createIncomeRecord(input: IExpense, userId: string) {
  try {
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

async function createIncomeFromBulkInput(
  input: { description: string; amount: number },
  userId: string
) {
  try {
    const rule = await findMatchingRule(input.description, userId);

    const incomeData = {
      ...input,
      user: userId,
      income_type: rule?.expense_type || IncomeType.unknown,
      category: rule?.category_title || 'unknown',
      rule: rule?._id,
    };

    return await IncomeModel.findOneAndUpdate(
      { description: input.description, user: userId },
      incomeData,
      { upsert: true, new: true }
    );
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
}

const getIncomesWithRules = async (rules: IRule[], loggedUser: JwtPayload) => {
  try {
    const expensesWithRules = (
      await Promise.all(
        rules.map(async (rule) => {
          const escapedDescription = rule.description_contains.replace(
            /[-/\\^$*+?.()|[\]{}]/g,
            '\\$&'
          );
          const expenses = await ExpenseModel.find({
            user: loggedUser?.id,
            expense_type: ExpenseType.unknown,
            category: ExpenseType.unknown,
            description: {
              $regex: escapedDescription,
              $options: 'i',
            },
          })
            .sort({ createdAt: -1 })
            .select('amount description category expense_type')
            .lean();

          return expenses.length > 0
            ? {
                rule: rule.description_contains,
                expensePayload: {
                  rule: rule._id,
                  category: rule.category_title,
                  expense_type: rule.expense_type,
                },
                expenses,
              }
            : null;
        })
      )
    ).filter((result) => result !== null);
    return expensesWithRules;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const getCategoryAndExpenseTypeAnalytics = async (
  query: Record<string, unknown>
) => {
  try {
    return await ExpenseModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          categoryWiseExpenses: [
            {
              $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                category: '$_id',
                totalItemByCategory: '$totalItems',
                amount: '$totalAmount',
                _id: 0,
              },
            },
          ],
          expenseTypeWiseExpenses: [
            {
              $group: {
                _id: '$expense_type',
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                expense_type: '$_id',
                totalItemByExpenseType: '$totalItems',
                amount: '$totalAmount',
                _id: 0,
              },
            },
          ],
        },
      },
    ]);
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

interface ExpenseAnalytics {
  date?: string;
  totalAmount: number;
  totalItems: number;
  dayName?: string;
  month?: string;
}

interface ExpenseAnalyticsResult {
  businessExpenseAnalytics: ExpenseAnalytics[];
  personalExpenseAnalytics: ExpenseAnalytics[];
}

const getBusinessAndPersonalExpenseAnalytics = async (
  query: Record<string, unknown>
): Promise<ExpenseAnalyticsResult[]> => {
  try {
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const dateArray: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateArray.push(date.toISOString().split('T')[0]);
    }

    const result = await ExpenseModel.aggregate<ExpenseAnalyticsResult>([
      {
        $match: {
          ...query,
          transaction_date: {
            $gte: sevenDaysAgo,
            $lte: today,
          },
        },
      },
      {
        $facet: {
          businessExpenseAnalytics: [
            {
              $match: {
                expense_type: 'business',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                date: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { date: 1 },
            },
            {
              $addFields: {
                date: { $ifNull: ['$date', dateArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                date: { $in: dateArray },
              },
            },
            {
              $limit: 7,
            },
          ],
          // Personal Expense Analytics grouped by day
          personalExpenseAnalytics: [
            {
              $match: {
                expense_type: 'personal',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m-%d',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                date: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { date: 1 },
            },
            {
              $addFields: {
                date: { $ifNull: ['$date', dateArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                date: { $in: dateArray },
              },
            },
            {
              $limit: 7,
            },
          ],
        },
      },
    ]);

    return result.map((analytics) => ({
      businessExpenseAnalytics: ensureSevenDaysCoverage(
        analytics.businessExpenseAnalytics,
        dateArray
      ),
      personalExpenseAnalytics: ensureSevenDaysCoverage(
        analytics.personalExpenseAnalytics,
        dateArray
      ),
    }));
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const getBusinessAndPersonalExpenseAnalyticsYearly = async (
  query: Record<string, unknown>
): Promise<ExpenseAnalyticsResult[]> => {
  try {
    const today = new Date();
    const twelveMonthsAgo = new Date(today);
    twelveMonthsAgo.setMonth(today.getMonth() - 11);

    const monthArray: string[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setMonth(today.getMonth() - i);
      const yearMonth = date.toISOString().split('T')[0].slice(0, 7);
      monthArray.push(yearMonth);
    }

    const result = await ExpenseModel.aggregate<ExpenseAnalyticsResult>([
      {
        $match: {
          ...query,
          transaction_date: {
            $gte: twelveMonthsAgo,
            $lte: today,
          },
        },
      },
      {
        $facet: {
          businessExpenseAnalytics: [
            {
              $match: {
                expense_type: 'business',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                month: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { month: 1 },
            },
            {
              $addFields: {
                month: { $ifNull: ['$month', monthArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                month: { $in: monthArray },
              },
            },
          ],
          personalExpenseAnalytics: [
            {
              $match: {
                expense_type: 'personal',
              },
            },
            {
              $group: {
                _id: {
                  $dateToString: {
                    format: '%Y-%m',
                    date: '$transaction_date',
                  },
                },
                totalAmount: { $sum: '$amount' },
                totalItems: { $sum: 1 },
              },
            },
            {
              $project: {
                month: '$_id',
                totalAmount: '$totalAmount',
                totalItems: '$totalItems',
                _id: 0,
              },
            },
            {
              $sort: { month: 1 },
            },
            {
              $addFields: {
                month: { $ifNull: ['$month', monthArray[0]] },
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] },
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                month: { $in: monthArray },
              },
            },
          ],
        },
      },
    ]);

    return result.map((analytics) => ({
      businessExpenseAnalytics: ensureTwelveMonthsCoverage(
        analytics.businessExpenseAnalytics,
        monthArray
      ),
      personalExpenseAnalytics: ensureTwelveMonthsCoverage(
        analytics.personalExpenseAnalytics,
        monthArray
      ),
    }));
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const ensureTwelveMonthsCoverage = (
  analytics: ExpenseAnalytics[],
  monthArray: string[]
): ExpenseAnalytics[] => {
  const analyticsMap = new Map(analytics.map((item) => [item.month, item]));
  return monthArray.map(
    (month) =>
      analyticsMap.get(month) || { month, totalAmount: 0, totalItems: 0 }
  );
};

const ensureSevenDaysCoverage = (
  analytics: ExpenseAnalytics[],
  dateArray: string[]
): ExpenseAnalytics[] => {
  const analyticsMap = new Map(analytics.map((item) => [item.date, item]));

  return dateArray.map((date) => {
    const dayName = new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
    });

    return analyticsMap.get(date)
      ? {
          ...analyticsMap.get(date)!,
          dayName,
        }
      : {
          date,
          dayName,
          totalAmount: 0,
          totalItems: 0,
        };
  });
};

const getWriteOffSummary = async (
  skip: number,
  limit: number,
  searchQuery: Record<string, unknown>
) => {
  try {
    return await ExpenseModel.aggregate([
      {
        $match: searchQuery,
      },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          totalItems: { $sum: 1 },
        },
      },
      {
        $project: {
          category: '$_id',
          totalItemByCategory: '$totalItems',
          amount: '$totalAmount',
          _id: 0,
        },
      },
      {
        $skip: Number(skip),
      },
      {
        $limit: Number(limit),
      },
    ]);
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};

const getTotalUniqueExpenseCategories = async (loggedUser: JwtPayload) => {
  try {
    return await ExpenseModel.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
          expense_type: ExpenseType.business,
        },
      },
      {
        $group: {
          _id: '$category',
        },
      },
      {
        $count: 'uniqueCategories',
      },
    ]);
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.NOT_FOUND, message);
  }
};
const deleteExpenseRecord = async (expenseId: string, userId: string) => {
  try {
    const expense = await ExpenseModel.findOne({
      _id: expenseId,
      user: userId,
    });
    if (!expense) {
      throw new Error('Expense not found or unauthorized');
    }

    const deletedExpense = await ExpenseModel.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      throw new Error('Failed to delete expense');
    }

    return deletedExpense;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
};
const updateIncomeRecord = async (input: IExpenseUpdate, userId: string) => {
  try {
    const { id, ...updateData } = input;
    const expense = await ExpenseModel.findOneAndUpdate(
      { _id: id, user: userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!expense) {
      throw new Error(
        'Expense not found or you do not have permission to update'
      );
    }
    return expense;
  } catch (error) {
    const { message } = errorHandler(error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
  }
};

export const IncomeHelpers = {
  updateIncomeRecord,
  createIncomeRecord,
  createIncomeFromBulkInput,
  findMatchingRule,
  getIncomesWithRules,
  getCategoryAndExpenseTypeAnalytics,
  deleteExpenseRecord,
  getWriteOffSummary,
  getTotalUniqueExpenseCategories,
  getBusinessAndPersonalExpenseAnalytics,
  getBusinessAndPersonalExpenseAnalyticsYearly,
};
