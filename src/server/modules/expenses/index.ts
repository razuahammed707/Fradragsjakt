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
import { IExpense } from '@/server/db/interfaces/expense';

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
          .limit(limit);

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
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Failed to fetch expenses: ${errorMessage}`
        );
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
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Failed to create expense: ${errorMessage}`
        );
      }
    }),
  createBulkExpenses: protectedProcedure
    .input(expenseValidation.createExpenseSchema)
    .mutation(async ({ ctx }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        // Array of expenses to be created in bulk
        const expenses = [
          { description: 'Foodpanda', amount: 20 },
          { description: 'Dhaka to Chittagong', amount: 100 },
          { description: 'Charity', amount: 500 },
        ];

        // Use Promise.all to handle all expense creations in parallel
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
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Failed to create expenses: ${errorMessage}`
        );
      }
    }),
});