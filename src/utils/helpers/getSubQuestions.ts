import { extended_questionnaires } from '@/lib/questionnaires';

export const getSubQuestions = (
  category: string,
  ruleFor: 'expense' | 'income' | 'common'
): string[] => {
  const categoryData = extended_questionnaires.find(
    (q) => q.question === category
  );
  if (!categoryData) return [];

  return categoryData.answers
    .filter((answer) => answer.type === ruleFor || answer.type === 'common')
    .map((answer) => answer.answer);
};
