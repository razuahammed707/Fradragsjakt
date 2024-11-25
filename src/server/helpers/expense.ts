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

async function findMatchingRule(description: string, userId: string) {
  try {
    // Step 1: Normalize both the input description and stored rules to handle special characters
    const normalizedDescription = description
      .toLowerCase()
      .normalize('NFKD') // Decompose combined characters
      .replace(/[^\w\s]/g, ''); // Remove special characters but keep spaces

    // Step 2: Query the database to find rules, then filter in memory for exact substring match
    const rules = await RuleModel.find({
      user: userId,
    });

    // Step 3: Find the first matching rule by checking if normalized rule text is contained in description
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

    // console.log('expense data', expenseData);

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

const getExpensesWithRules = async (rules: IRule[], loggedUser: JwtPayload) => {
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

          // Only return rules with matched expenses
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
    // Single aggregate query using $facet
    return await ExpenseModel.aggregate([
      {
        $match: query,
      },
      {
        $facet: {
          // Group by `category`
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
          // Group by `expense_type`
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

const getBusinessAndPersonalExpenseAnalytics = async (
  query: Record<string, unknown>
) => {
  try {
    // Get the current date and calculate the date for 7 days ago
    const today = new Date();
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7); // Subtract 7 days from today's date

    // Generate an array of the last 7 days (including today)
    const dateArray = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      dateArray.push(date.toISOString().split('T')[0]); // Add the date in YYYY-MM-DD format
    }

    // Single aggregate query using $facet
    return await ExpenseModel.aggregate([
      {
        $match: {
          ...query, // Apply any filters passed in the query
          transaction_date: {
            $gte: sevenDaysAgo, // Only include records from the last 7 days
            $lte: today, // Ensure we're also including today
          },
        },
      },
      {
        $facet: {
          // Business Expense Analytics grouped by day
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
                }, // Group by day
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
              $sort: { date: 1 }, // Sort by date (ascending order)
            },
            {
              $addFields: {
                date: { $ifNull: ['$date', dateArray[0]] }, // Ensure each day in the dateArray appears
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] }, // Set default values for missing days
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                date: { $in: dateArray }, // Ensure all 7 days are included
              },
            },
            {
              $limit: 7, // Ensure only 7 days worth of data
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
                }, // Group by day
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
              $sort: { date: 1 }, // Sort by date (ascending order)
            },
            {
              $addFields: {
                date: { $ifNull: ['$date', dateArray[0]] }, // Ensure each day in the dateArray appears
              },
            },
            {
              $set: {
                totalAmount: { $ifNull: ['$totalAmount', 0] }, // Set default values for missing days
                totalItems: { $ifNull: ['$totalItems', 0] },
              },
            },
            {
              $match: {
                date: { $in: dateArray }, // Ensure all 7 days are included
              },
            },
            {
              $limit: 7, // Ensure only 7 days worth of data
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

const getWriteOffSummary = async (
  skip: number,
  limit: number,
  searchQuery: Record<string, unknown>
) => {
  try {
    // Single aggregate query using $facet
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
    // Single aggregate query using $facet
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
const updateExpenseRecord = async (input: IExpenseUpdate, userId: string) => {
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

export const ExpenseHelpers = {
  updateExpenseRecord,
  createExpenseRecord,
  createExpenseFromBulkInput,
  findMatchingRule,
  getExpensesWithRules,
  getCategoryAndExpenseTypeAnalytics,
  deleteExpenseRecord,
  getWriteOffSummary,
  getTotalUniqueExpenseCategories,
  getBusinessAndPersonalExpenseAnalytics,
};
