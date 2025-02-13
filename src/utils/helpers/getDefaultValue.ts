import { Questionnaire } from '@/types/questionnaire';
import { questionMatcherEngine } from './questionMatcherEngine';

export const getDefaultValue = (
  user: any,
  selectedCategoty: string,
  accordionItemTitle: string,
  fieldName: string
) => {
  const matchedQuestionnaire = questionMatcherEngine(
    selectedCategoty,
    user?.questionnaires
  ) as Questionnaire;
  const answers =
    (matchedQuestionnaire?.answers.find((answer) =>
      Object.keys(answer).includes(accordionItemTitle)
    )?.[accordionItemTitle as unknown as any] as unknown as any) || [];

  return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
};

export const getInputType = (
  key: string
): 'number' | 'boolean' | 'percentage' | 'text' => {
  if (key?.includes('How many')) return 'number';
  if (key?.includes('Do you') || key?.includes('Was the')) return 'boolean';
  if (key?.includes('ownership share') || key?.includes('tax rate'))
    return 'percentage';
  return 'text';
};
