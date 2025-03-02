/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { FormInput } from '@/components/FormInput';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/redux/hooks';
import { showModal } from '@/redux/slices/questionnaire';
import { AccordionItemData, Questionnaire } from '@/types/questionnaire';
import { matchQuestionnaireModalQuestion } from '@/utils/helpers/matchQuestionnaireModalQuestion';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { CardDescription } from '@/components/ui/card';
import { SelectFormInput } from '@/components/SelectFormInput';

type ContentHobbyProps = {
  questionnaire?: Questionnaire;
};

export type UploadedImageType = {
  link: string;
  mimeType: string;
  width?: number;
  height?: number;
};

export function ContentHobby({ questionnaire }: ContentHobbyProps) {
  const utils = trpc.useUtils();
  const appDispatch = useAppDispatch();

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isDirty, isValid },
  } = useForm();

  const getDefaultValue = (accordionItemTitle: string, fieldName: string) => {
    const answers =
      (questionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemTitle)
      )?.[accordionItemTitle as unknown as any] as unknown as any) || [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: 'I have a sole proprietorship',
      content: (
        <>
          Proprietorship expense = Operating Expenses + Depreciation + Other
          Deductions Report income and expenses in the RF-1030 or RF-1175 forms.
          <CardDescription className="pt-2 text-xs text-gray-500 font-medium">
            <br />
            <strong>Threshold:</strong> No minimum amount; all relevant expenses
            should be reported.
          </CardDescription>
          <p className="text-black pt-[12px] pb-[6px]">Revenue</p>
          <FormInput
            name="I have a sole proprietorship.Revenue"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 100"
            defaultValue={getDefaultValue(
              'I have a sole proprietorship',
              'Revenue'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Proprietorship expense
          </p>
          <FormInput
            name="I have a sole proprietorship.proprietorship expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 100"
            defaultValue={getDefaultValue(
              'I have a sole proprietorship',
              'proprietorship expense'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-2',
      title:
        'Sell goods or services, blog/influencer, practise e-sports (gaming), breed animals on a small scale',
      content: (
        <>
          If you sell goods or services, engage in blogging or influencing,
          practice e-sports (gaming), or breed animals on a small scale, you may
          be eligible for deductions.
          <CardDescription className="pt-2 text-xs text-gray-500 font-medium">
            <br />
            <strong>Threshold:</strong> Minimum deductible expense threshold is
            NOK 10,000.
          </CardDescription>
          <p className="text-black pt-[12px] pb-[6px]">Revenue</p>
          <FormInput
            name="Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale.Revenue"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 100"
            defaultValue={getDefaultValue(
              'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
              'Revenue'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">Documented expense</p>
          <FormInput
            name="Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale.Documented expense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 100"
            defaultValue={getDefaultValue(
              'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
              'Documented expense'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale.Upload verification document"
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Sell goods or services blog/influencer practise e-sports (gaming) breed animals on a small scale',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I have received salary from odd jobs and services',
      content: (
        <>
          Odd job income qualifies for the minimum deduction (45% of your total
          income, capped at NOK 104,450 for 2023).
          <CardDescription className="pt-2 text-xs text-gray-500 font-medium">
            <br />
            <strong>Maximum:</strong> The deduction cap for odd job income is
            NOK 104,450.
          </CardDescription>
          <p className="text-black pt-[12px] pb-[6px]">
            Received salary from odd jobs and services exceeding NOK 6000?
          </p>
          <SelectFormInput
            name="I have received salary from odd jobs and services.Received salary from odd jobs and services exceeding NOK 6000"
            customClassName="w-full"
            control={control}
            placeholder="Yes or No"
            options={[
              { title: 'Yes', value: 'yes' },
              { title: 'No', value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'I have received salary from odd jobs and services',
              'Received salary from odd jobs and services exceeding NOK 6000'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">Odd job income</p>
          <FormInput
            name="I have received salary from odd jobs and services.Odd job income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 5000"
            defaultValue={getDefaultValue(
              'I have received salary from odd jobs and services',
              'Odd job income'
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

  const handleValueChange = (value: string) => {
    setOpenItem((prevOpen) => (prevOpen === value ? null : value));
  };

  const updateQuestionnaires = trpc.users.updateUserQuestionnaires.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'User questionnaires updation failed!');
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    updateQuestionnaires.mutate(payload);
    appDispatch(showModal(false));
  };

  return (
    <div className="">
      <p className="text-xs text-gray-500">Review Questionnaire</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[350px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
          <Accordion
            type="single"
            className="w-full"
            value={openItem || undefined}
            onValueChange={handleValueChange}
          >
            {matchedAccordionData.map(({ id, title, content }) => (
              <AccordionItem key={id} value={id}>
                <AccordionTrigger
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
