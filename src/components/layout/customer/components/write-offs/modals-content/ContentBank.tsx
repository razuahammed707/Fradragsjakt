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

type ContentBankProps = {
  questionnaire?: Questionnaire;
};

export function ContentBank({ questionnaire }: ContentBankProps) {
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
      title: 'Have a loan?',
      content: (
        <>
          Norway allows you to deduct interest paid on loans, including mortgage
          interest, student loans, and consumer loans, provided that the lender
          has reported the loan to the Tax Administration. Interest payments on
          loans in Norway are typically deductible at a rate of 22% (the
          standard tax deduction rate).
          <p className="text-black pt-[12px] pb-[6px]">Loan amount?</p>
          <FormInput
            name="Have a loan.Loan amount"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="Loan amount"
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title: 'Have refinanced a loan in the last year?',
      content: (
        <>
          If you’ve refinanced a loan, you may still be eligible to deduct
          interest expenses. Any fees associated with refinancing, such as loan
          arrangement fees, are generally not deductible. However, the interest
          paid after refinancing remains deductible, as long as it pertains to
          your primary residence, real estate, or certain other qualifying
          expenses.
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'Have taken out a joint loan with someone?',
      content: (
        <>
          For joint loans, each borrower can claim deductions on their portion
          of the interest paid. You would each declare your individual share of
          the interest payments on your tax returns. As with single loans, the
          deduction rate is generally 22% of the interest paid.
        </>
      ),
    },
    {
      id: 'item-4',
      title: 'Have young people’s housing savings (BSU)',
      content: (
        <>
          Young people’s housing savings (BSU) is for people under 34 years of
          age. You can save up to NOK 27,500 per year. Then you get a tax
          deduction of NOK 2,750 (10 percent). You can save up to a total of NOK
          300,000.
        </>
      ),
    },
    {
      id: 'item-5',
      title: 'I have sold shares or securities at a loss',
      content: (
        <>
          Gains and losses on shares are taxable for the amount that exceeds the
          deductible risk-free return. Losses on sale of shares are deductible.
          The tax rate for 2023 is 37.84 percent.
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
        </Accordion>
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
