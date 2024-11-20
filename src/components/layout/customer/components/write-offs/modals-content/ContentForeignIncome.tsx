'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import {
  addQuestionnaire,
  questionnaireSelector,
} from '@/redux/slices/questionnaire';
import { AccordionItemData, Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ContentForeignIncomeProps = {
  questionnaire?: Questionnaire;
};

export function ContentForeignIncome({
  questionnaire,
}: ContentForeignIncomeProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const { handleSubmit /* control */ } = useForm();

  const appDispatch = useAppDispatch();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  console.log(questionnaires);

  const handleToggle = (value: string) => {
    setOpenItem((prevItem) => (prevItem === value ? null : value));
  };

  // Define an array with the items' title and content
  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title:
        'Have income or wealth in another country than Norway and pay tax in the other country',
      content:
        'You must declare all your foreign income and wealth in the Norwegian tax return. This applies regardless of whether you’ve paid tax abroad or the income/wealth is tax free in the country in question.',
    },
  ];

  const answers = questionnaire?.answers || [];
  const matchedAccordionData = matchQuestionnaireModalQuestion({
    questionnaire: answers,
    accordionData,
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    appDispatch(addQuestionnaire(payload));
  };
  return (
    <div className=" ">
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {matchedAccordionData.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger
                onClick={() => handleToggle(item.id)}
                className={`${
                  openItem === item.id ? 'text-violet-600' : ''
                } no-underline font-bold text-start`}
              >
                {item.title}
              </AccordionTrigger>
              {openItem === item.id && (
                <AccordionContent className="text-gray-500 text-xs">
                  {item.content}
                </AccordionContent>
              )}
            </AccordionItem>
          ))}
        </Accordion>
        <Button className="text-white w-full mt-4">Done</Button>
      </form>
    </div>
  );
}
