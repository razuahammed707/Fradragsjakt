import { extended_questionnaires } from '@/lib/questionnaires';
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

  const mainCategoryTitles = extended_questionnaires.map((q) => q.question);

  const mainCategories = (categories?.data || [])
    .filter(
      (category) =>
        mainCategoryTitles.includes(category.title) &&
        category?.created_by === 'SYSTEM'
    )
    .map((category) => ({
      title: category.title,
      value: category.title,
    }));

  const secondaryCategories = Array.from(
    new Set(
      (categories?.data || [])
        .filter((category) => !mainCategoryTitles.includes(category.title))
        .map((category) => category.title)
    )
  ).map((title) => ({
    title,
    value: title,
  }));
  const manipulatedCategories = (categories?.data || []).map((category) => ({
    title: category.title,
    value: category.title,
  }));

  return {
    mainCategories,
    secondaryCategories,
    categories: categories?.data || [],
    manipulatedCategories,
  };
};
