import { trpc } from '@/utils/trpc'; // Adjust the import path as needed

export const useManipulatedCategories = () => {
  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      keepPreviousData: true,
    }
  );

  const manipulatedCategories = categories?.data
    ? categories.data.map((category) => ({
        title: category.title,
        value: category.title,
      }))
    : [];

  return {
    manipulatedCategories,
    categories,
  };
};
