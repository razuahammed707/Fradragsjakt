'use client';

import { FormInput } from '@/components/FormInput';
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

type ContentWorkProps = {
  questionnaire?: Questionnaire;
};

export function ContentWork({ questionnaire }: ContentWorkProps) {
  const [openItem, setOpenItem] = useState<string | null>(null);
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm();

  const appDispatch = useAppDispatch();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  console.log(questionnaires);

  const handleToggle = (value: string) => {
    setOpenItem((prevItem) => (prevItem === value ? null : value));
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title:
        'The return distance between home and work is more than 37 kilometres',
      content: (
        <>
          Travel costs between your home and your permanent workplace that
          surpass NOK 14,400 and up to NOK 97,000 may be deducted. Regardless of
          your actual expenses or the mode of transportation you utilize, you
          will be eligible for this deduction. The number of journeys and the
          travel distance are used to compute the deduction. The days that you
          worked from home are not deductible.
          <p className="text-black pt-3 pb-1">
            The return distance between home and work
          </p>
          <FormInput
            name="The return distance between home and work is more than 37 kilometres.The return distance between home and work"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="distance between home and work"
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title:
        'Have expenses for road toll or ferry when travelling between your home and workplace',
      content: (
        <>
          You must save at least two hours each way while driving oneself as
          opposed to taking public transportation in order to qualify for a
          deduction for road toll and/or ferry costs. Queues and delays cannot
          be taken into account. You need to make a comparison with the typical
          travel time. You can receive a discount for using the least expensive
          payment option if you save at least two hours. This implies that you
          need to account for subscription discounts and the like. For you to be
          eligible for a deduction, your expenses must total at least NOK 3,300.
          <p className="text-black pt-3 pb-1">
            Amount you pay on toll or ferry
          </p>
          <FormInput
            name="Have expenses for road toll or ferry when travelling between your home and workplace.Amount you pay on toll or ferry"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="toll or ferry payment"
            required
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'Stay away from home overnight because of work',
      content: (
        <>
          If you are paid a salary and must spend the night away from home due
          to work, you might qualify as a commuter and receive a deduction for
          your travel expenses.
        </>
      ),
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
    <div>
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
        </Accordion>{' '}
        <Button
          disabled={!isDirty || !isValid}
          type="submit"
          className="text-white w-full mt-4"
        >
          Done
        </Button>
      </form>
    </div>
  );
}
