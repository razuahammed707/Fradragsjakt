/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useAppDispatch } from '@/redux/hooks';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import { showModal } from '@/redux/slices/questionnaire';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { CardDescription } from '@/components/ui/card';
import { SelectFormInput } from '@/components/SelectFormInput';

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
  const appDispatch = useAppDispatch();
  const utils = trpc.useUtils();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty },
  } = useForm();

  const getDefaultValue = (accordionItemId: string, fieldName: string) => {
    const answers =
      (questionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemId)
      )?.[accordionItemId as unknown as any] as unknown as any) || [];

    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: 'Have children aged 11 years or younger',
      content: (
        <>
          <p>
            Parents can deduct expenses related to childcare, such as daycare
            (barnehage) or after-school programs (SFO/AKS), for children under
            12 years of age.
          </p>
          <CardDescription className="pt-2 text-xs text-gray-500 font-medium">
            <br />
            The deduction is up to <strong>NOK 25,000</strong> for the first
            child and an additional <strong>NOK 15,000</strong> per additional
            child under 12.
          </CardDescription>
          <p className="text-black pt-[12px] pb-[6px]">
            How many children do you have under the age of 12?
          </p>
          <FormInput
            name="Have children aged 11 years or younger.How many children do you have under the age of 12?"
            customClassName="w-full"
            control={control}
            type="number"
            placeholder=" "
            maxValue
            noFraction
            defaultValue={getDefaultValue(
              'Have children aged 11 years or younger',
              'How many children do you have under the age of 12?'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">Documented Expense</p>
          <FormInput
            name="Have children aged 11 years or younger.Documented Expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 25000"
            defaultValue={getDefaultValue(
              'Have children aged 11 years or younger',
              'Documented Expense'
            )}
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
          <p>
            Parents can deduct expenses related to childcare, such as daycare
            (barnehage) or after-school programs (SFO/AKS), for children under
            12 years of age.
          </p>
          <CardDescription className="pt-2 text-xs text-gray-500 font-medium">
            <br />
            <strong>No age restriction</strong> applies if special care needs
            are documented.
          </CardDescription>
          <p className="text-black pt-[12px] pb-[6px]">
            Do you have children with needs for special care?
          </p>
          <SelectFormInput
            name="I have children aged 12 or older with special care needs.Do you have children with needs for special care?"
            customClassName="w-full"
            control={control}
            placeholder="Yes"
            options={[
              {
                title: 'Yes',
                value: 'yes',
              },
              {
                title: 'No',
                value: 'no',
              },
            ]}
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Do you have children with needs for special care?'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Documented care expenses
          </p>
          <FormInput
            name="I have children aged 12 or older with special care needs.Documented care expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 500"
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Documented care expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="I have children aged 12 or older with special care needs.Upload verification document"
            setValue={setValue}
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I am a single parent',
      content: (
        <>
          <p>
            Single parents now receive financial support through other
            mechanisms, such as:
          </p>
          <ul>
            <li>
              <strong>Extended Child Benefit (Utvidet barnetrygd)</strong>:
              Single parents receive additional child benefits.
            </li>
            <li>
              <strong>Deductions for Childcare Expenses</strong>: Deduct costs
              for day care and after-school programs.
            </li>
            <li>
              <strong>Commuting Deductions</strong>: For extra travel costs
              related to children, such as drop-offs.
            </li>
          </ul>
          <CardDescription className="pt-2 text-xs text-gray-500 font-medium">
            <br />
            Additional support depends on <strong>income level</strong> and{' '}
            <strong>number of dependents</strong>.
          </CardDescription>
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

  const updateQuestionnaires = trpc.users.updateUserQuestionnaires.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'User questionnaires updation failed!');
    },
  });
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);

    updateQuestionnaires.mutate(payload);
    appDispatch(showModal(false));
  };

  const handleValueChange = (value: string) => {
    setOpenItem((prevOpen) => (prevOpen === value ? null : value));
  };

  return (
    <div>
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Accordion
            type="single"
            value={openItem || undefined}
            onValueChange={handleValueChange}
            className="w-full"
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
                <AccordionContent className="text-gray-500 text-xs">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        <Button
          disabled={!isDirty}
          type="submit"
          className="text-white w-full mt-4"
        >
          Done
        </Button>
      </form>
    </div>
  );
}
