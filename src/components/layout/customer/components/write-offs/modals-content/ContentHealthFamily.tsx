'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';

type AccordionItemData = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type ContentHealthFamilyProps = {
  questionnaire?: Questionnaire;
};

export function ContentHealthFamily({
  questionnaire,
}: ContentHealthFamilyProps) {
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
      title: 'Have children aged 11 years or younger',
      content: (
        <>
          Parents can deduct expenses related to childcare, such as daycare
          (barnehage) or after-school programs (SFO/AKS), for children under 12
          years of age. The deduction is up to NOK 25,000 for the first child
          and an additional NOK 15,000 per additional child under 12.
          <p className="text-black pt-[12px] pb-[6px]">
            How many children do you have under the age of 12?
          </p>
          <Input type="text" placeholder="2" />
        </>
      ),
    },
    {
      id: 'item-2',
      title: 'I have children aged 12 or older with special care needs',
      content: (
        <>
          Parents can deduct expenses related to childcare, such as daycare
          (barnehage) or after-school programs (SFO/AKS), for children under 12
          years of age.
          <p className="text-black pt-[12px] pb-[6px]">
            Do you have children with needs for special care?
          </p>
          <Select>
            <SelectTrigger id="Select">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </>
      ),
    },
    {
      id: 'item-3',
      title:
        'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme',
      content: (
        <>
          Have additional travel distance or expenses related to dropping off
          the child in a child day care centre or after-school supervision
          scheme.
        </>
      ),
    },
    {
      id: 'item-4',
      title: 'I am a single parent',
      content: (
        <>
          Single parents receive a monthly allowance for each child under 18
          years of age. As of 2023, the benefit is NOK 1,676 per month for
          children under six and NOK 1,054 for children aged six and older. This
          is not taxable income.
          <p className="text-black pt-[12px] pb-[6px]">
            Do you get allowance as a single parent?
          </p>
          <Select>
            <SelectTrigger id="Select">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
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
              } no-underline font-bold text-start`}
            >
              {item.title}
            </AccordionTrigger>
            {openItems.includes(item.id) && (
              <AccordionContent className="text-gray-500 text-xs">
                {item.content}
              </AccordionContent>
            )}
          </AccordionItem>
        ))}
      </Accordion>
      <Button className="text-white w-full mt-4">Done</Button>
    </div>
  );
}
