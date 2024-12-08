import { protectedProcedure } from '@/server/middlewares/with-auth';
import httpStatus from 'http-status';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import IncomeModel from '@/server/db/models/expense';
import { ApiError } from '@/lib/exceptions';

import { ExpenseType } from '@/server/db/interfaces/expense';
import { errorHandler } from '@/server/middlewares/error-handler';
import RuleModel from '@/server/db/models/rules';
import mongoose from 'mongoose';
import { parseFilterString } from '@/utils/helpers/parseFilterString';
import { IncomeValidations } from './income.validations';
import { IncomeHelpers } from '@/server/helpers/income';
import { IIncome, IIncomeUpdate } from '@/server/db/interfaces/income';

export const IncomeRouter = router({
  getIncomes: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        searchTerm: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit, searchTerm, filterString } = input;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = { user: loggedUser?.id };

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        if (searchTerm) {
          query.$or = [
            { description: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } },
            { expense_type: { $regex: searchTerm, $options: 'i' } },
          ];
        }
        const total = await IncomeModel.countDocuments(query);
        const incomes = await IncomeModel.find(query)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 });

        return {
          status: 200,
          message: 'Incomes fetched successfully',
          data: incomes,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof incomes>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getCategoryAndExpenseTypeWiseincomes: protectedProcedure
    .input(
      z.object({
        expense_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { expense_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (expense_type) {
          query.expense_type = ExpenseType.business;
        }

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const incomes =
          await IncomeHelpers.getCategoryAndExpenseTypeAnalytics(query);

        return {
          status: 200,
          message:
            'Category-wise and expense_type-wise incomes fetched successfully',
          data: incomes[0],
        } as ApiResponse<(typeof incomes)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessAndPersonalExpenseAnalytics: protectedProcedure
    .input(
      z.object({
        expense_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { expense_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (expense_type) {
          query.expense_type = ExpenseType.business;
        }

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const incomes =
          await IncomeHelpers.getBusinessAndPersonalExpenseAnalytics(query);

        return {
          status: 200,
          message: 'Analytics for business an personal expense are fetched.',
          data: incomes[0],
        } as ApiResponse<(typeof incomes)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessAndPersonalExpenseYearly: protectedProcedure
    .input(
      z.object({
        expense_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { expense_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (expense_type) {
          query.expense_type = ExpenseType.business;
        }

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const incomes =
          await IncomeHelpers.getBusinessAndPersonalExpenseAnalyticsYearly(
            query
          );

        return {
          status: 200,
          message: 'Analytics for business an personal expense are fetched.',
          data: incomes[0],
        } as ApiResponse<(typeof incomes)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  getWriteOffs: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(50),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const { page, limit, searchTerm } = input;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
          expense_type: ExpenseType.business,
        };

        if (searchTerm) {
          query.$or = [{ category: { $regex: searchTerm, $options: 'i' } }];
        }
        const total =
          await IncomeHelpers.getTotalUniqueExpenseCategories(loggedUser);

        const totalUniqueCategories = total[0]?.uniqueCategories;
        const incomes = await IncomeHelpers.getWriteOffSummary(
          skip,
          limit,
          query
        );

        return {
          status: 200,
          message: 'Write off summary fetched successfully',
          data: incomes,
          pagination: {
            total: totalUniqueCategories,
            page,
            limit,
            totalPages: Math.ceil(totalUniqueCategories / limit),
          },
        } as unknown as ApiResponse<typeof totalUniqueCategories>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getUnknownincomesWithMatchedRules: protectedProcedure
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

        const total = await IncomeModel.countDocuments({
          user: loggedUser?.id,
          expense_type: ExpenseType.unknown,
          category: ExpenseType.unknown,
        });

        const rules = await RuleModel.find({ user: loggedUser?.id });

        // Use Promise.all to ensure all async operations complete
        const incomesWithRules = await IncomeHelpers.getIncomesWithRules(
          rules,
          loggedUser
        );

        const incomesWithAllRules = {
          incomesWithRules,
          rules,
        };

        return {
          status: 200,
          message: 'incomes fetched with matched rules',
          data: incomesWithAllRules as object,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof incomesWithRules>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  createExpense: protectedProcedure
    .input(IncomeValidations.createIncomeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await IncomeHelpers.createIncomeRecord(
          input as IIncome,
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
  createBulkIncomes: protectedProcedure
    .input(IncomeValidations.createBulkIncomeSchema)
    .mutation(async ({ ctx, input: incomes }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const createdIncomes = await Promise.all(
          incomes.map(async (singleIncome) => {
            return await IncomeHelpers.createIncomeFromBulkInput(
              singleIncome,
              loggedUser.id
            );
          })
        );

        return {
          status: 201,
          message: 'Incomes created successfully',
          data: createdIncomes,
        } as ApiResponse<typeof createdIncomes>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  updateBulkExpense: protectedProcedure
    .input(IncomeValidations.updateBulkIncomeSchema)

    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { incomes } = input;

        // Update all specified incomes for the logged-in user
        const updatedincomes = await Promise.all(
          incomes.map(async (income) => {
            return await IncomeModel.findByIdAndUpdate(
              { _id: income?._id, user: loggedUser?.id },
              { $set: income.incomeUpdatePayload },
              { new: true }
            ).lean();
          })
        );

        if (!updatedincomes) {
          throw new ApiError(
            httpStatus.NOT_FOUND,
            'Some incomes were not found or not accessible.'
          );
        }

        return {
          status: 200,
          message: 'incomes updated successfully',
          data: updatedincomes,
        } as ApiResponse<typeof updatedincomes>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
      }
    }),
  deleteExpense: protectedProcedure
    .input(
      z.object({
        _id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { _id } }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await IncomeHelpers.deleteExpenseRecord(
          _id,
          loggedUser.id
        );

        return {
          status: 200,
          message: 'Expense deleted successfully',
          data: expense,
        } as ApiResponse<typeof expense>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
      }
    }),
  updateExpense: protectedProcedure
    .input(IncomeValidations.createIncomeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await IncomeHelpers.updateIncomeRecord(
          input as IIncomeUpdate,
          loggedUser.id
        );

        return {
          status: 200,
          message: 'Expense updated successfully',
          data: expense,
        } as ApiResponse<typeof expense>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
