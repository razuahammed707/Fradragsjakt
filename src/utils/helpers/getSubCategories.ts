import { extended_questionnaires } from '@/lib/questionnaires';

export const getSubCategories = (category: string): { answer: string }[] => {
  const categoryData = extended_questionnaires.find(
    (q) => q.question === category
  );
  if (!categoryData) return [];

  return categoryData.answers.map((answer) => ({
    answer: answer.answer,
  }));
};
