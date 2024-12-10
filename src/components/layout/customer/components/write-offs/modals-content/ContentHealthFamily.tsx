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
import { useTranslation } from '@/lib/TranslationProvider'; // Import translation hook

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
  const { translate } = useTranslation(); // Use translate function
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

  const getDefaultValue = (accordionItemId: string, fieldName: string) => {
    const answers =
      foreignIncomeQuestionnaire?.answers.find((answer) =>
        Object.keys(answer).includes(accordionItemId)
      )?.[accordionItemId] || [];

    return answers.find((field: any) => field[fieldName])?.[fieldName] || ''; // eslint-disable-line @typescript-eslint/no-explicit-any
  };

  const accordionData: AccordionItemData[] = [
    {
      id: 'item1',
      title: 'Have children aged 11 years or younger',
      content: (
        <>
          <p>
            {translate('writeOffPage.accordionItems.item1.content.description')}
          </p>
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item1.content.questions.howManyChildren'
            )}
          </p>
          <FormInput
            name="childrenUnder12"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="2"
            defaultValue={getDefaultValue('item1', 'childrenUnder12')}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item1.content.questions.documentedExpense'
            )}
          </p>
          <FormInput
            name="documentedExpense"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 25000"
            defaultValue={getDefaultValue('item1', 'documentedExpense')}
            required
          />
        </>
      ),
    },
    {
      id: 'item2',
      title: 'I have children aged 12 or older with special care needs',
      content: (
        <>
          <p>
            {translate('writeOffPage.accordionItems.item2.content.description')}
          </p>
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item2.content.questions.specialCareNeeds'
            )}
          </p>
          <FormInput
            name="specialCareNeeds"
            customClassName="w-full"
            type="select"
            control={control}
            placeholder={translate(
              'writeOffPage.accordionItems.item2.options.yes'
            )}
            options={[
              {
                title: translate(
                  'writeOffPage.accordionItems.item2.options.yes'
                ),
                value: 'yes',
              },
              {
                title: translate(
                  'writeOffPage.accordionItems.item2.options.no'
                ),
                value: 'no',
              },
            ]}
            defaultValue={getDefaultValue('item2', 'specialCareNeeds')}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item2.content.questions.documentedCareExpenses'
            )}
          </p>
          <FormInput
            name="documentedCareExpenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 500"
            defaultValue={getDefaultValue('item2', 'documentedCareExpenses')}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            {translate(
              'writeOffPage.accordionItems.item2.content.questions.uploadVerification'
            )}
          </p>
          <FormReceiptInput
            name="uploadVerification"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue('item2', 'uploadVerification')}
          />
        </>
      ),
    },
    {
      id: 'item3',
      title: 'I am a single parent',
      content: (
        <>
          <p>
            {translate('writeOffPage.accordionItems.item3.content.description')}
          </p>
          <ul>
            <li>
              <strong>
                {translate(
                  'writeOffPage.accordionItems.item3.content.details.extendedChildBenefit'
                )}
              </strong>
              :{' '}
              {translate(
                'writeOffPage.accordionItems.item3.content.details.extendedChildBenefitDesc'
              )}
            </li>
            <li>
              <strong>
                {translate(
                  'writeOffPage.accordionItems.item3.content.details.childcareDeductions'
                )}
              </strong>
              :{' '}
              {translate(
                'writeOffPage.accordionItems.item3.content.details.childcareDeductionsDesc'
              )}
            </li>
            <li>
              <strong>
                {translate(
                  'writeOffPage.accordionItems.item3.content.details.commutingDeductions'
                )}
              </strong>
              :{' '}
              {translate(
                'writeOffPage.accordionItems.item3.content.details.commutingDeductionsDesc'
              )}
            </li>
          </ul>
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
        {translate('writeOffPage.reviewQuestionnaire')}
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
          {translate('writeOffPage.doneButton')}
        </Button>
      </form>
    </div>
  );
}
