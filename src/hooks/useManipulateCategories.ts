import { trpc } from '@/utils/trpc';

type Query = {
  category_for: string | undefined;
};

export const useManipulatedCategories = (query: Query) => {
  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      ...query,
      page: 1,
      limit: 50,
    },
    {
      enabled: !!query?.category_for,
      keepPreviousData: true,
    }
  );

  const { data: commonCategories } = trpc.categories.getCategories.useQuery(
    {
      category_for: 'common',
      page: 1,
      limit: 50,
    },
    {
      enabled: true,
      keepPreviousData: true,
    }
  );

  const mergedCategories = [
    ...(categories?.data || []),
    ...(commonCategories?.data || []),
  ];

  const manipulatedCategories = mergedCategories.map((category) => ({
    title: category.title,
    value: category.title,
  }));

  return {
    manipulatedCategories,
    categories: mergedCategories,
  };
};
