import { protectedProcedure } from '@/server/middlewares/with-auth';
import httpStatus from 'http-status';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import { ApiError } from '@/lib/exceptions';
import { errorHandler } from '@/server/middlewares/error-handler';
import RuleModel from '@/server/db/models/rules';
import mongoose from 'mongoose';
import { parseFilterString } from '@/utils/helpers/parseFilterString';
import { IncomeValidations } from './income.validations';
import { IncomeHelpers } from '@/server/helpers/income';
import {
  IIncome,
  IIncomeUpdate,
  IncomeType,
} from '@/server/db/interfaces/income';
import IncomeModel from '@/server/db/models/income';

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
            { income_type: { $regex: searchTerm, $options: 'i' } },
          ];
        }

        console.log('filter income query', query);
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
  getCategoryAndIncomeTypeWiseIncomes: protectedProcedure
    .input(
      z.object({
        income_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { income_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (income_type) {
          query.income_type = IncomeType.business;
        }

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const incomes =
          await IncomeHelpers.getCategoryAndIncomeTypeAnalytics(query);

        return {
          status: 200,
          message:
            'Category-wise and income_type-wise incomes fetched successfully',
          data: incomes[0],
        } as ApiResponse<(typeof incomes)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessAndPersonalIncomeAnalytics: protectedProcedure
    .input(
      z.object({
        income_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { income_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (income_type) {
          query.income_type = IncomeType.business;
        }

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const incomes =
          await IncomeHelpers.getBusinessAndPersonalIncomeAnalytics(query);

        return {
          status: 200,
          message: 'Analytics for business an personal income are fetched.',
          data: incomes ? incomes[0] : [],
        } as ApiResponse<(typeof incomes)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        console.log('error messsage from income', message);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessAndPersonalincomeYearly: protectedProcedure
    .input(
      z.object({
        income_type: z.string().optional(),
        filterString: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { income_type, filterString } = input;
        const loggedUser = ctx.user as JwtPayload;

        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
        };

        if (income_type) {
          query.income_type = IncomeType.business;
        }

        const filters = parseFilterString(filterString);
        Object.assign(query, filters);

        const incomes =
          await IncomeHelpers.getBusinessAndPersonalIncomeAnalyticsYearly(
            query
          );

        return {
          status: 200,
          message: 'Analytics for business an personal income are fetched.',
          data: incomes[0],
        } as ApiResponse<(typeof incomes)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  getUnknownIncomesWithMatchedRules: protectedProcedure
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
          income_type: IncomeType.unknown,
          category: IncomeType.unknown,
        });

        const rules = await RuleModel.find({
          user: loggedUser?.id,
          rule_for: 'income',
        });

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
          message: 'Incomes fetched with matched rules',
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

  createIncome: protectedProcedure
    .input(IncomeValidations.createIncomeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const income = await IncomeHelpers.createIncomeRecord(
          input as IIncome,
          loggedUser.id
        );

        return {
          status: 201,
          message: 'Income created successfully',
          data: income,
        } as ApiResponse<typeof income>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),

  updateBulkIncome: protectedProcedure
    .input(IncomeValidations.updateBulkIncomeSchema)

    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { incomes } = input;

        console.log('incomes from bulk', incomes);

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
  deleteIncome: protectedProcedure
    .input(
      z.object({
        _id: z.string().array().or(z.string()),
      })
    )
    .mutation(async ({ ctx, input: { _id } }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        if (Array.isArray(_id)) {
          const result = await IncomeModel.deleteMany({
            _id: { $in: _id },
            user: loggedUser.id,
          });

          if (result.deletedCount === 0) {
            throw new ApiError(
              httpStatus.NOT_FOUND,
              'No incomes were found or accessible'
            );
          }

          return {
            status: 200,
            message: `Successfully deleted ${result.deletedCount} incomes`,
            data: { deletedCount: result.deletedCount },
          } as ApiResponse<{ deletedCount: number }>;
        }

        const income = await IncomeHelpers.deleteIncomeRecord(
          _id,
          loggedUser.id
        );

        return {
          status: 200,
          message: 'Income deleted successfully',
          data: income,
        } as ApiResponse<typeof income>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message);
      }
    }),
  updateIncome: protectedProcedure
    .input(IncomeValidations.createIncomeSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const income = await IncomeHelpers.updateIncomeRecord(
          input as IIncomeUpdate,
          loggedUser.id
        );

        return {
          status: 200,
          message: 'income updated successfully',
          data: income,
        } as ApiResponse<typeof income>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
});
