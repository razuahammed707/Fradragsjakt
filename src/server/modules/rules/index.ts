import RuleModel from '@/server/db/models/rules';
import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { ruleValidation } from './rules.validation';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';
import CategoryModel from '@/server/db/models/category';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { ApiError, AuthError } from '@/lib/exceptions';

export const rulesRouter = router({
  getRules: protectedProcedure
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

        const total = await RuleModel.countDocuments({ user: loggedUser?.id });
        const rules = await RuleModel.find({ user: loggedUser?.id })
          .skip(skip)
          .limit(limit);

        return {
          status: 200,
          message: 'Rules fetched successfully',
          data: rules,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof rules>;
      } catch (error) {
        console.log(error);
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          'Something went wrong to fetch rules'
        );
      }
    }),

  createRule: protectedProcedure
    .input(ruleValidation.ruleSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email || !sessionUser?.id) {
          throw new AuthError('You must be logged in to create this rule.');
        }

        const categoryQuery = mongoose.Types.ObjectId.isValid(input.category)
          ? { _id: input.category }
          : { title: input.category };

        const category = await CategoryModel.findOneAndUpdate(
          {
            ...categoryQuery,
            creator_id: sessionUser.id,
          },
          {
            $setOnInsert: { creator_id: sessionUser.id, title: input.category },
          },
          {
            new: true,
            upsert: true,
          }
        );

        const createRule = await RuleModel.create({
          ...input,
          user: sessionUser?.id,
          category: category?._id,
          category_title: category?.title,
        });

        return {
          message: 'New Rule created successfully',
          status: 200,
          data: createRule,
        } as ApiResponse<typeof createRule>;
      } catch (error) {
        console.log(error);
        throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create rule');
      }
    }),
});
