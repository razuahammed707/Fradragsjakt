import { trpc } from '@/utils/trpc';

type Query = {
  category_for?: string;
};

export const useManipulatedCategories = (query?: Query) => {
  const { data: categories } = trpc.categories.getCategories.useQuery({
    ...query,
    page: 1,
    limit: 1000,
  });

  const mainCategories = (categories?.data || [])
    .filter((category) => category?.created_by === 'SYSTEM')
    .map((category) => ({
      title: category.title,
      value: category.title,
    }));

  // Use a Set to ensure uniqueness by title
  const uniqueTitles = new Set();
  const manipulatedCategories = (categories?.data || [])
    .filter((category) => {
      if (uniqueTitles.has(category.title)) {
        return false;
      }
      uniqueTitles.add(category.title);
      return true;
    })
    .map((category) => ({
      title: category.title,
      value: category.title,
    }));

  return {
    mainCategories,
    categories: categories?.data || [],
    manipulatedCategories,
  };
};
