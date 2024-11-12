import { protectedProcedure } from '@/server/middlewares/with-auth';
import httpStatus from 'http-status';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import ExpenseModel from '@/server/db/models/expense';
import { ApiError } from '@/lib/exceptions';
import { expenseValidation } from './expenses.validation';
import { ExpenseHelpers } from '@/server/helpers/expense';
import { ExpenseType, IExpense } from '@/server/db/interfaces/expense';
import { errorHandler } from '@/server/middlewares/error-handler';
import RuleModel from '@/server/db/models/rules';
import mongoose from 'mongoose';

export const expenseRouter = router({
  getExpenses: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit } = input;
        const skip = (page - 1) * limit;

        const total = await ExpenseModel.countDocuments({
          user: loggedUser?.id,
        });
        const expenses = await ExpenseModel.find({ user: loggedUser?.id })
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        return {
          status: 200,
          message: 'Expenses fetched successfully',
          data: expenses,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof expenses>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getCategoryWiseExpenses: protectedProcedure.query(async ({ ctx }) => {
    try {
      const loggedUser = ctx.user as JwtPayload;

      const expenses = await ExpenseModel.aggregate([
        {
          $match: {
            user: new mongoose.Types.ObjectId(loggedUser?.id),
          },
        },
        {
          $group: {
            _id: '$category',
            totalAmount: {
              $sum: '$amount',
            },
            totalItems: {
              $sum: 1,
            },
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
      ]);

      return {
        status: 200,
        message: 'Category wise expenses fetched successfully',
        data: expenses,
      } as ApiResponse<typeof expenses>;
    } catch (error: unknown) {
      const { message } = errorHandler(error);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  }),
  getUnknownExpensesWithMatchedRules: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit } = input;

        const total = await ExpenseModel.countDocuments({
          user: loggedUser?.id,
          expense_type: ExpenseType.unknown,
          category: ExpenseType.unknown,
        });

        const rules = await RuleModel.find({ user: loggedUser?.id });

        // Use Promise.all to ensure all async operations complete
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

        return {
          status: 200,
          message: 'Expenses fetched with matched rules',
          data: expensesWithRules,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof expensesWithRules>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  createExpense: protectedProcedure
    .input(expenseValidation.createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await ExpenseHelpers.createExpenseRecord(
          input as IExpense,
          loggedUser.id
        );

        return {
          status: 201,
          message: 'Expense created successfully',
          data: expense,
        } as ApiResponse<typeof expense>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  createBulkExpenses: protectedProcedure
    .input(expenseValidation.createBulkExpenseSchema)
    .mutation(async ({ ctx, input: expenses }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const createdExpenses = await Promise.all(
          expenses.map(async (singleExpense) => {
            return await ExpenseHelpers.createExpenseFromBulkInput(
              singleExpense,
              loggedUser.id
            );
          })
        );

        return {
          status: 201,
          message: 'Expenses created successfully',
          data: createdExpenses,
        } as ApiResponse<typeof createdExpenses>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  updateBulkExpense: protectedProcedure
    .input(expenseValidation.updateBulkExpenseSchema)

    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { expenses } = input;

        // Update all specified expenses for the logged-in user
        const updatedExpenses = await Promise.all(
          expenses.map(async (expense) => {
            return await ExpenseModel.findByIdAndUpdate(
              { _id: expense?._id, user: loggedUser?.id },
              { $set: expense.expenseUpdatePayload },
              { new: true }
            ).lean();
          })
        );

        if (!updatedExpenses) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            'Some expenses were not found or not accessible.'
          );
        }

        return {
          status: 200,
          message: 'Expenses updated successfully',
          data: updatedExpenses,
        } as ApiResponse<typeof updatedExpenses>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
      }
    }),
});
