import { questionnaires } from '@/lib/questionnaires';
export const getSubQuestions = (category: string): string[] => {
  const matchedQuestion = questionnaires.find((q) => q.question === category);
  return matchedQuestion ? matchedQuestion.answers : [];
};
