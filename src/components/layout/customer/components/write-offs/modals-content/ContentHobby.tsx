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

type ContentHobbyProps = {
  questionnaire?: Questionnaire;
};

export function ContentHobby({ questionnaire }: ContentHobbyProps) {
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
      title: 'I have a sole proprietorship',
      content: (
        <>
          If you’re self-employed, you may claim deductions for expenses related
          to your business. You must be able to document the expenses in the
          form of receipts and invoices. For deductions of NOK 10,000 or more,
          payments must be made electronically, such as via bank card, credit
          card, Vipps, or online banking.
        </>
      ),
    },
    {
      id: 'item-2',
      title:
        'Sell goods or services, blog/influencer, practise e-sports, breed animals, or rent out property on a small scale',
      content: (
        <>
          If you engage in activities like selling goods or services, blogging,
          e-sports, animal breeding, or small-scale property rental, you may
          qualify for tax exemptions if:
          <br />
          <br />
          <p>
            <strong>Annual Income Limits:</strong> Earnings are under NOK 50,000
            per year for hobby-level or small-scale activities.
          </p>
          <p>
            <strong>Non-Professional Activities:</strong> The activities aren’t
            your primary occupation or a main income source.
          </p>
          <p>
            <strong>Non-Recurring Basis:</strong> Irregular or incidental income
            may qualify as tax-exempt hobby income rather than business income.
          </p>
          Remember, exceeding these conditions may mean your earnings are
          treated as taxable income.
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I have received salary from odd jobs and services',
      content: (
        <>
          If you’ve received salary under NOK 6,000 (from individuals) or NOK
          10,000 (from tax-exempt organizations) reported via an a-melding, this
          income may be pre-filled on your tax return. To avoid unnecessary tax,
          cross out this amount on your tax return if it qualifies as
          non-taxable income.
          <p className="text-black pt-[12px] pb-[6px]">
            Received salary from odd jobs and services?
          </p>
          <FormInput
            name="I have received salary from odd jobs and services.Received salary from odd jobs and services"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="Received salary"
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    appDispatch(addQuestionnaire(payload));
  };
  return (
    <div className="">
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Accordion type="multiple" className="w-full">
          {matchedAccordionData.map(({ id, title, content }) => (
            <AccordionItem key={id} value={id}>
              <AccordionTrigger
                onClick={() => handleToggle(id)}
                className={`${
                  openItem === id ? 'text-violet-600' : ''
                } no-underline font-bold text-start`}
              >
                {title}
              </AccordionTrigger>
              {openItem === id && (
                <AccordionContent className="text-gray-500 text-xs">
                  {content}
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
