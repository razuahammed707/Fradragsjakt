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
  showModal,
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
  const {
    handleSubmit,
    control,
    formState: { isDirty, isValid },
  } = useForm();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const foreignIncomeQuestionnaire = questionnaires.find(
    (q) => q.question === questionnaire?.question
  );

  const getDefaultValue = (accordionItemTitle: string, fieldName: string) => {
    const answers =
      foreignIncomeQuestionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemTitle)
      )?.[accordionItemTitle] || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };
  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: 'Have a loan?',
      content: (
        <>
          The deduction rate for loan interest is 22% of the interest paid in
          the tax year.
          <p className="text-black pt-[12px] pb-[6px]">Total interest paid</p>
          <FormInput
            name="Have a loan.Total interest paid"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue('Have a loan', 'Total interest paid')}
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
          Refinancing costs, such as fees and charges, are deductible alongside
          interest. The same 22% rate applies.
          <p className="text-black pt-[12px] pb-[6px]">Refinancing cost</p>
          <FormInput
            name="Have refinanced a loan in the last year.Refinancing cost"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have refinanced a loan in the last year',
              'Refinancing cost'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'Have taken out a joint loan with someone?',
      content: (
        <>
          Ensure the ownership percentage is documented, typically in the loan
          agreement.
          <p className="text-black pt-[12px] pb-[6px]">Interest amount</p>
          <FormInput
            name="Have taken out a joint loan with someone.Interest amount"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have taken out a joint loan with someone',
              'Interest amount'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">Your ownership share</p>
          <FormInput
            name="Have taken out a joint loan with someone.Your ownership share"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have taken out a joint loan with someone',
              'Your ownership share'
            )}
            required
          />
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
          deduction of NOK 2,750 (10 percent).
          <p className="text-black pt-[12px] pb-[6px]">This years savings</p>
          <FormInput
            name="Have young people’s housing savings (BSU).This years savings"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have young people’s housing savings (BSU)',
              'This years savings'
            )}
            required
          />
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
          <p className="text-black pt-[12px] pb-[6px]">Total loss</p>
          <FormInput
            name="I have sold shares or securities at a loss.Total loss"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I have sold shares or securities at a loss',
              'Total loss'
            )}
            required
          />
        </>
      ),
    },
  ];
  const answers = questionnaire?.answers || [];
  const matchedAccordionData = matchQuestionnaireModalQuestion({
    questionnaire: answers,
    accordionData,
  });
  const [openItem, setOpenItem] = useState<string | null>(
    matchedAccordionData.length > 0 ? matchedAccordionData[0].id : null
  );

  const appDispatch = useAppDispatch();

  const handleValueChange = (value: string) => {
    setOpenItem((prevOpen) => (prevOpen === value ? null : value));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    appDispatch(addQuestionnaire(payload));
    appDispatch(showModal(false));
  };
  return (
    <div>
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Accordion
            type="single"
            className="w-full"
            value={openItem || undefined}
            onValueChange={handleValueChange}
          >
            {matchedAccordionData.map((item) => (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger
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
        </div>
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
