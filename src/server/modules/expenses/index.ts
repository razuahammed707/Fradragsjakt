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
import {
  ExpenseType,
  IExpense,
  IExpenseUpdate,
} from '@/server/db/interfaces/expense';
import { errorHandler } from '@/server/middlewares/error-handler';
import RuleModel from '@/server/db/models/rules';
import mongoose from 'mongoose';
import { parseFilterString } from '@/utils/helpers/parseFilterString';
import { IncomeHelpers } from '@/server/helpers/income';

export const expenseRouter = router({
  getExpenses: protectedProcedure
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

        const total = await ExpenseModel.countDocuments(query);
        const expenses = await ExpenseModel.find(query)
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
  getCategoryAndExpenseTypeWiseExpenses: protectedProcedure
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

        const expenses =
          await ExpenseHelpers.getCategoryAndExpenseTypeAnalytics(query);

        return {
          status: 200,
          message:
            'Category-wise and expense_type-wise expenses fetched successfully',
          data: expenses[0],
        } as ApiResponse<(typeof expenses)[0]>;
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }),
  getBusinessExpensesWithThreshold: protectedProcedure.query(
    async ({ ctx }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const query = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
          expense_type: 'business',
          sub_category: { $in: ['', null, undefined] },
        };

        const expenses =
          await ExpenseHelpers.getExpensesByTypeAndSubCategory(query);

        const aggregatedAmounts =
          await ExpenseHelpers.aggregateTagCategoryAmounts(expenses);

        const { aggregatedAmounts: finalAggregatedAmounts, totalAmount } =
          ExpenseHelpers.applyThreshold(aggregatedAmounts);

        return {
          status: 200,
          message:
            'Expenses fetched and aggregated successfully with threshold applied',
          data: {
            aggregatedAmounts: finalAggregatedAmounts,
            totalAmount,
          },
        };
      } catch (error: unknown) {
        const { message } = errorHandler(error);
        throw new ApiError(httpStatus.NOT_FOUND, message);
      }
    }
  ),
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

        const expenses =
          await ExpenseHelpers.getBusinessAndPersonalExpenseAnalytics(query);

        return {
          status: 200,
          message: 'Analytics for business an personal expense are fetched.',
          data: expenses[0],
        } as ApiResponse<(typeof expenses)[0]>;
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

        const expenses =
          await ExpenseHelpers.getBusinessAndPersonalExpenseAnalyticsYearly(
            query
          );

        return {
          status: 200,
          message: 'Analytics for business an personal expense are fetched.',
          data: expenses[0],
        } as ApiResponse<(typeof expenses)[0]>;
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

        // Base query to filter expenses by user
        const query: Record<string, unknown> = {
          user: new mongoose.Types.ObjectId(loggedUser?.id),
          expense_type: ExpenseType.business,
        };

        if (searchTerm) {
          query.$or = [{ category: { $regex: searchTerm, $options: 'i' } }];
        }
        const total =
          await ExpenseHelpers.getTotalUniqueExpenseCategories(loggedUser);

        const totalUniqueCategories = total[0]?.uniqueCategories;
        const expenses = await ExpenseHelpers.getWriteOffSummary(
          skip,
          limit,
          query
        );

        return {
          status: 200,
          message: 'Write off summary fetched successfully',
          data: expenses,
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

        const rules = await RuleModel.find({
          user: loggedUser?.id,
          rule_for: 'expense',
        });

        const expensesWithRules = await ExpenseHelpers.getExpensesWithRules(
          rules,
          loggedUser
        );

        const expensesWithAllRules = {
          expensesWithRules,
          rules,
        };

        return {
          status: 200,
          message: 'Expenses fetched with matched rules',
          data: expensesWithAllRules as object,
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

  populateStatement: protectedProcedure
    .input(expenseValidation.populateStatementSchema)
    .mutation(async ({ ctx, input: statements }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const results = await Promise.all(
          statements.map(async (statement) => {
            const expense =
              statement.withdrawal > 0
                ? await ExpenseHelpers.createExpenseFromBulkInput(
                    statement,
                    loggedUser.id
                  )
                : null;

            const income =
              statement.deposit > 0
                ? await IncomeHelpers.createIncomeFromBulkInput(
                    statement,
                    loggedUser.id
                  )
                : null;

            return {
              expense,
              income,
            };
          })
        );
        const createdExpenses = results
          .map((r) => r.expense)
          .filter((e) => e !== null);
        const createdIncomes = results
          .map((r) => r.income)
          .filter((i) => i !== null);
        console.log(
          'Total Processed',
          createdExpenses.length + createdIncomes.length,
          createdExpenses.length,
          createdIncomes.length
        );

        return {
          status: 201,
          message: 'Statements processed successfully',
          data: {
            expenses: createdExpenses,
            incomes: createdIncomes,
            totalProcessed: statements.length,
          },
        };
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
  deleteExpense: protectedProcedure
    .input(
      z.object({
        _id: z.string().array().or(z.string()),
      })
    )
    .mutation(async ({ ctx, input: { _id } }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        if (Array.isArray(_id)) {
          const result = await ExpenseModel.deleteMany({
            _id: { $in: _id },
            user: loggedUser.id,
          });

          if (result.deletedCount === 0) {
            throw new ApiError(
              httpStatus.NOT_FOUND,
              'No expenses were found or accessible'
            );
          }

          return {
            status: 200,
            message: `Successfully deleted ${result.deletedCount} expenses`,
            data: { deletedCount: result.deletedCount },
          } as ApiResponse<{ deletedCount: number }>;
        }

        const expense = await ExpenseHelpers.deleteExpenseRecord(
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
    .input(expenseValidation.createExpenseSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;

        const expense = await ExpenseHelpers.updateExpenseRecord(
          input as IExpenseUpdate,
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
  getQuestionnairePrefilledValues: protectedProcedure.query(async ({ ctx }) => {
    try {
      const loggedUser = ctx.user as JwtPayload;

      const expenseValues =
        await ExpenseHelpers.getQuestionnairePrefilledValues(loggedUser.id);

      const categoryMap = new Map<string, Map<string, any[]>>();

      expenseValues.forEach((item) => {
        const category = item.question;

        if (!categoryMap.has(category)) {
          categoryMap.set(category, new Map());
        }

        const answerMap = categoryMap.get(category)!;

        item.answers.forEach((answerObj) => {
          const [key, values] = Object.entries(answerObj)[0];
          if (!answerMap.has(key)) {
            answerMap.set(key, []);
          }

          const existingValues = answerMap.get(key)!;

          values.forEach((value) => {
            const existingEntry = existingValues.find((v) =>
              Object.keys(v).some((k) => k in value)
            );

            if (existingEntry) {
              Object.entries(value).forEach(([subKey, subValue]) => {
                const existingSubValue = existingEntry[subKey];

                if (!isNaN(Number(subValue))) {
                  const sum =
                    (parseFloat(existingSubValue) || 0) + parseFloat(subValue);
                  existingEntry[subKey] = sum.toFixed(2);
                } else {
                  if (!Array.isArray(existingEntry[subKey])) {
                    existingEntry[subKey] = existingSubValue
                      ? [existingSubValue]
                      : [];
                  }
                  existingEntry[subKey].push(subValue);
                }
              });
            } else {
              existingValues.push({ ...value });
            }
          });
        });
      });

      const mergedQuestionnaires = Array.from(categoryMap.entries()).map(
        ([category, answersMap]) => ({
          question: category,
          answers: Array.from(answersMap.entries()).map(([key, values]) => ({
            [key]: values,
          })),
        })
      );

      return {
        status: 200,
        message: 'Questionnaire prefilled values fetched successfully',
        data: mergedQuestionnaires,
      } as ApiResponse<typeof mergedQuestionnaires>;
    } catch (error: unknown) {
      const { message } = errorHandler(error);
      throw new ApiError(httpStatus.NOT_FOUND, message);
    }
  }),
});
