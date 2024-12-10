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
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';
import {
  addQuestionnaire,
  questionnaireSelector,
  showModal,
} from '@/redux/slices/questionnaire';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import { useTranslation } from '@/lib/TranslationProvider';

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
  const { translate } = useTranslation();
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
    return answers.find((field: any) => field[fieldName])?.[fieldName] || '';
  };
  const accordionData: AccordionItemData[] = [
    {
      id: 'item-1',
      title: translate('childrenUnder12'),
      content: (
        <>
          {translate('childrenUnder12Info')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('howManyChildren')}
          </p>
          <FormInput
            name="Have children aged 11 years or younger.How many children do you have under the age of 12"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="2"
            defaultValue={getDefaultValue(
              'Have children aged 11 years or younger',
              'How many children do you have under the age of 12'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('documentedExpense')}
          </p>
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
      title: translate('childrenOver12SpecialNeeds'),
      content: (
        <>
          {translate('specialCareInfo')}
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('specialCareQuestion')}
          </p>
          <FormInput
            name="I have children aged 12 or older with special care needs.Do you have children with needs for special care"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder={translate('yes')}
            options={[
              { title: translate('yes'), value: 'yes' },
              { title: translate('no'), value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Do you have children with needs for special care'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate('documentedCareExpenses')}
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
            {translate('uploadVerification')}
          </p>
          <FormReceiptInput
            name="I have children aged 12 or older with special care needs.Upload verification document"
            control={control}
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
      title: translate('singleParent'),
      content: (
        <div>
          <p>{translate('singleParentInfo')}</p>
          <ol>
            <li>
              <span className="font-semibold">
                {translate('extendedChildBenefit')}
              </span>
              : {translate('extendedChildBenefitInfo')}
            </li>
            <li>
              <span className="font-semibold">
                {translate('deductionsChildcare')}
              </span>
              : {translate('deductionsChildcareInfo')}
            </li>
            <li>
              <span className="font-semibold">
                {translate('commutingDeductions')}
              </span>
              : {translate('commutingDeductionsInfo')}
            </li>
          </ol>
        </div>
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

  const onSubmit = (formData: any) => {
    const question = questionnaire?.question || '';
    const payload = transformFormDataToPayload(question, formData);
    appDispatch(addQuestionnaire(payload));
    appDispatch(showModal(false));
  };

  const handleValueChange = (value: string) => {
    setOpenItem((prevOpen) => (prevOpen === value ? null : value));
  };

  return (
    <div>
      <p className="text-xs text-gray-500">
        {translate('reviewQuestionnaire')}
      </p>
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
          disabled={!isDirty || !isValid}
          type="submit"
          className="text-white w-full mt-4"
        >
          {translate('done')}
        </Button>
      </form>
         
    </div>
  );
}
