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

type ContentWorkProps = {
  questionnaire?: Questionnaire;
};

export function ContentWork({ questionnaire }: ContentWorkProps) {
  console.log({ questionnaire });
  const {
    handleSubmit,
    control,
    setValue,
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
      title:
        'The return distance between home and work is more than 37 kilometres',
      content: (
        <>
          If your home is more than 37 km away from your workplace, you may
          qualify for a commuting deduction. This is to compensate for the extra
          time and cost of commuting.
          <p className="text-black pt-3 pb-1">Distance</p>
          <FormInput
            name="The return distance between home and work is more than 37 kilometres.Distance"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="40 km"
            defaultValue={getDefaultValue(
              'The return distance between home and work is more than 37 kilometres',
              'Distance'
            )}
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
          If you incur expenses for road tolls or ferries while commuting to
          work, these expenses may be deductible.
          <p className="text-black pt-3 pb-1">Documented Expenses</p>
          <FormInput
            name="Have expenses for road toll or ferry when travelling between your home and workplace.Documented Expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have expenses for road toll or ferry when travelling between your home and workplace',
              'Documented Expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="Have expenses for road toll or ferry when travelling between your home and workplace.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Have expenses for road toll or ferry when travelling between your home and workplace',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-3',
      title: 'I Stay away from home overnight because of work',
      content: (
        <>
          If your work requires you to be away from home overnight, you can
          deduct certain expenses related to your accommodation and meals.
          <p className="text-black pt-3 pb-1">Meals and accommodation cost</p>
          <FormInput
            name="I Stay away from home overnight because of work.Meals and accommodation cost"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I Stay away from home overnight because of work',
              'Meals and accommodation cost'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-4',
      title: 'Moved for a new job',
      content: (
        <>
          Only moving expenses related to starting a new job or business are
          deductible. Keep receipts for transportation, packing, and temporary
          accommodation costs.
          <p className="text-black pt-3 pb-1">Documented expenses</p>
          <FormInput
            name="Moved for a new job.Documented expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Moved for a new job',
              'Documented expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="Moved for a new job.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Moved for a new job',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-5',
      title: 'I work as a fisherman',
      content: (
        <>
          This special deduction is meant to support fishermen and applies to
          taxable income derived from fishing activities.
          <p className="text-black pt-3 pb-1">Fishing Income</p>
          <FormInput
            name="I work as a fisherman.Fishing Income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I work as a fisherman',
              'Fishing Income'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-6',
      title: 'I work as a seafarer',
      content: (
        <>
          Applies only if you work onboard a qualifying ship and meet minimum
          days at sea.
          <p className="text-black pt-3 pb-1">Seafarer Income</p>
          <FormInput
            name="I work as a seafarer.Seafarer Income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I work as a seafarer',
              'Seafarer Income'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-7',
      title: 'I went to school last year',
      content: (
        <>
          Education costs are deductible only if directly related to your
          current job and aimed at improving qualifications. Tuition for basic
          education is not deductible.
          <p className="text-black pt-3 pb-1">
            Documented Education Expenses (if job-related)
          </p>
          <FormInput
            name="I went to school last year.Documented Education Expenses (if job-related)"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I went to school last year',
              'Documented Education Expenses (if job-related)'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="I went to school last year.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'I went to school last year',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-8',
      title: 'I am a foreign employee',
      content: (
        <>
          This deduction is available for the first two years of work in Norway.
          It is aimed at foreign employees who are temporarily resident.
          <p className="text-black pt-3 pb-1">Taxable Income</p>
          <FormInput
            name="I am a foreign employee.Taxable Income"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'I am a foreign employee',
              'Taxable Income'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-9',
      title: 'Member of Trade Union',
      content: (
        <>
          <div className="space-y-3">
            <p>
              Trade union fees are deductible from your taxable income in
              Norway.
            </p>
            <p>
              Maximum deduction for trade union fees: Typically around 3,850 NOK
              for 2024.
            </p>
          </div>
        </>
      ),
    },
    {
      id: 'item-10',
      title: 'living in Norway only in a part of a year',
      content: (
        <>
          If you live in Norway part-time, your tax obligations may depend on
          the length of your stay and your residency status.
          <p className="text-black pt-[12px] pb-[6px]">
            Have you spent more than 183 days in Norway?
          </p>
          <FormInput
            name="living in Norway only in a part of a year.Have you spent more than 183 days in Norway"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder="Yes"
            options={[
              { title: 'Yes', value: 'yes' },
              { title: 'No', value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'living in Norway only in a part of a year',
              'Have you spent more than 183 days in Norway'
            )}
            required
          />
        </>
      ),
    },
    {
      id: 'item-11',
      title: 'Disputation of a PhD',
      content: (
        <>
          Expenses related to defending a PhD may be deductible if they are
          job-related and not reimbursed by an employer or institution.
          <p className="text-black pt-3 pb-1">
            Documented Costs for Thesis Printing, Travel, and Defense Ceremony
          </p>
          <FormInput
            name="Disputation of a PhD.Documented Costs for Thesis Printing Travel and Defense Ceremony"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Disputation of a PhD',
              'Documented Costs for Thesis Printing Travel and Defense Ceremony'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="Disputation of a PhD.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Disputation of a PhD',
              'Upload verification document'
            )}
          />
        </>
      ),
    },
    {
      id: 'item-12',
      title: 'Have a separate room in your house used only as your home office',
      content: (
        <>
          The room must be exclusively used for work purposes. Costs include
          rent, mortgage interest, electricity, and maintenance.
          <p className="text-black pt-3 pb-1">Home Area</p>
          <FormInput
            name="Have a separate room in your house used only as your home office.Home Area"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="2000 Sq ft"
            defaultValue={getDefaultValue(
              'Have a separate room in your house used only as your home office',
              'Home Area'
            )}
            required
          />
          <p className="text-black pt-3 pb-1">Room Area</p>
          <FormInput
            name="Have a separate room in your house used only as your home office.Room Area"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="200 sq ft"
            defaultValue={getDefaultValue(
              'Have a separate room in your house used only as your home office',
              'Room Area'
            )}
            required
          />
          <p className="text-black pt-3 pb-1">Operating Cost</p>
          <FormInput
            name="Have a separate room in your house used only as your home office.Operating Cost"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 200"
            defaultValue={getDefaultValue(
              'Have a separate room in your house used only as your home office',
              'Operating Cost'
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
                {openItem === item.id && (
                  <AccordionContent className="text-gray-500 text-xs">
                    {item.content}
                  </AccordionContent>
                )}
              </AccordionItem>
            ))}
          </Accordion>{' '}
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
