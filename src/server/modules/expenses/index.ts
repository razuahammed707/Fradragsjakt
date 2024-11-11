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
import { errorHandler } from '@/server/middlewares/error-handler';

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
});
