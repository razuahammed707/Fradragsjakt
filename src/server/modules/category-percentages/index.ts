import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { z } from 'zod';
import CategoryPercentage from '@/server/db/models/category-percentage';
import Category from '@/server/db/models/category'; // Add this import
import { JwtPayload } from 'jsonwebtoken';

export const categoryPercentageRouter = router({
  setCategoryPercentage: protectedProcedure
    .input(
      z.object({
        category: z.string(),
        percentage: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log({ input });

      try {
        const { category, percentage } = input;
        const sessionUser = ctx.user as JwtPayload;

        const categoryDoc = await Category.findOne({ title: category });
        if (!categoryDoc) {
          throw new Error('Category not found');
        }

        const categoryId = categoryDoc._id;

        const percentageNum = parseInt(percentage, 10);
        if (isNaN(percentageNum) || percentageNum < 0 || percentageNum > 100) {
          throw new Error('Percentage must be between 0 and 100');
        }

        const existingRecord = await CategoryPercentage.findOne({
          user: sessionUser.id,
          category: categoryId,
        });

        if (existingRecord) {
          existingRecord.threshold = percentage;
          await existingRecord.save();
          return existingRecord;
        } else {
          const newCategoryPercentage = await CategoryPercentage.create({
            user: sessionUser.id,
            category: categoryId, // Use the category ID
            threshold: percentage,
          });
          return newCategoryPercentage;
        }
      } catch (error) {
        console.error('Error setting category percentage:', error);
        throw new Error('Failed to set category percentage');
      }
    }),
  getCategoryPercentage: protectedProcedure
    .input(
      z.object({
        category: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const { category } = input;
        const sessionUser = ctx.user as JwtPayload;

        const categoryDoc = await Category.findOne({ title: category });
        if (!categoryDoc) {
          return '100';
        }

        const categoryId = categoryDoc._id;

        const categoryPercentage = await CategoryPercentage.findOne({
          user: sessionUser.id,
          category: categoryId,
        });

        return categoryPercentage ? categoryPercentage.threshold : '100';
      } catch (error) {
        console.error('Error getting category percentage:', error);
        return '100';
      }
    }),
});
