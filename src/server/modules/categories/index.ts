import { protectedProcedure } from '@/server/middlewares/with-auth';
import { router } from '@/server/trpc';
import { JwtPayload } from 'jsonwebtoken';
import { categoryValidation } from './categories.validation';
import Category from '@/server/db/models/category';
import { ApiResponse } from '@/server/db/types';
import { z } from 'zod';

export const categoryRouter = router({
  getCategories: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        searchTerm: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      try {
        const loggedUser = ctx.user as JwtPayload;
        const { page, limit, searchTerm } = input;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = { creator_id: loggedUser?.id };

        // If a search term is provided, add a condition to match fields
        if (searchTerm) {
          query.title = { $regex: searchTerm, $options: 'i' };
        }

        const total = await Category.countDocuments(query);
        const categories = await Category.find(query).skip(skip).limit(limit);

        return {
          status: 200,
          message: 'Categories fetched successfully',
          data: categories,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        } as ApiResponse<typeof categories>;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new Error(`Failed to fetch categories: ${errorMessage}`);
      }
    }),

  deleteCategory: protectedProcedure
    .input(categoryValidation.deleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser?.email) {
          throw new Error('Authentication required');
        }

        const category = await Category.findById(id);
        if (!category) {
          throw new Error('Category not found');
        }

        if (category.creator_id.toString() !== sessionUser.id) {
          throw new Error('Unauthorized to delete this category');
        }

        await Category.findByIdAndDelete(id);

        return {
          message: 'Category deleted successfully',
          status: 200,
          data: id,
        } as ApiResponse<typeof category>;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new Error(`Failed to delete category: ${errorMessage}`);
      }
    }),

  updateCategory: protectedProcedure
    .input(categoryValidation.updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, title } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser?.email) {
          throw new Error('Authentication required');
        }

        const existingCategory = await Category.findById(id);
        if (!existingCategory) {
          throw new Error('Category not found');
        }

        if (existingCategory.creator_id.toString() !== sessionUser.id) {
          throw new Error('Unauthorized to update this category');
        }

        const duplicateName = await Category.findOne({
          title,
          _id: { $ne: id },
        });
        if (duplicateName) {
          throw new Error('Category with this name already exists');
        }

        const updatedCategory = await Category.findByIdAndUpdate(
          id,
          {
            title,
          },
          { new: true }
        );

        return {
          message: 'Category updated successfully',
          status: 200,
          category: updatedCategory,
        };
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new Error(`Failed to update category: ${errorMessage}`);
      }
    }),

  createCategory: protectedProcedure
    .input(categoryValidation.categorySchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { title } = input;
        const sessionUser = ctx.user as JwtPayload;

        if (!sessionUser || !sessionUser?.email) {
          throw new Error('You must be logged in to update this data.');
        }

        const categoryExist = await Category.findOne({
          title,
          creator_id: sessionUser.id,
        });
        if (categoryExist) {
          throw new Error('Category already exists!');
        }

        const category = new Category({
          title,
          creator_id: sessionUser.id,
        });

        await category.save();

        if (!category) {
          throw new Error('Failed to create category');
        }

        return {
          message: 'New Category created successfully',
          status: 200,
          data: category,
        } as ApiResponse<typeof category>;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'An unknown error occurred';
        throw new Error(`Failed to create category: ${errorMessage}`);
      }
    }),
});
