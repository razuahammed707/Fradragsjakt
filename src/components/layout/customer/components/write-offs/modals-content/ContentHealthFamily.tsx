'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import {
  addQuestionnaire,
  questionnaireSelector,
} from '@/redux/slices/questionnaire';

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
          <FormInput
            name="Have children aged 11 years or younger.How many children do you have under the age of 12"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="children under 12"
            required
          />
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
          <FormInput
            name="I have children aged 12 or older with special care needs.Do you have children with needs for special care"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder="special care needs children?"
            options={[
              { title: 'Yes', value: 'yes' },
              { title: 'No', value: 'no' },
            ]}
            required
          />
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
          <FormInput
            name="I am a single parent.Do you get allowance as a single parent"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder="get allowance?"
            options={[
              { title: 'Yes', value: 'yes' },
              { title: 'No', value: 'no' },
            ]}
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
    <div>
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Accordion type="single" className="w-full">
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
