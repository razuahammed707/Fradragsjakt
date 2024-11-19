'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AccordionItemData, Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';
import { useState } from 'react';

type ContentWorkProps = {
  questionnaire?: Questionnaire;
};

export function ContentWork({ questionnaire }: ContentWorkProps) {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    setOpenItems((prevItems) =>
      prevItems.includes(value)
        ? prevItems.filter((item) => item !== value)
        : [...prevItems, value]
    );
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
          <Input type="text" placeholder="50KM" />
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
          <Input type="text" placeholder="NOK 6000" />
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

  return (
    <div>
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <Accordion type="multiple" className="w-full">
        {matchedAccordionData.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger
              onClick={() => handleToggle(item.id)}
              className={`${
                openItems.includes(item.id) ? 'text-violet-600' : ''
              } font-bold text-start`}
            >
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-gray-500 text-xs">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button className="text-white w-full mt-4">Done</Button>
    </div>
  );
}
