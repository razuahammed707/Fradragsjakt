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
            placeholder="2"
            defaultValue={getDefaultValue(
              'Have children aged 11 years or younger',
              'How many children do you have under the age of 12'
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
            placeholder="Yes"
            options={[
              { title: 'Yes', value: 'yes' },
              { title: 'No', value: 'no' },
            ]}
            defaultValue={getDefaultValue(
              'I have children aged 12 or older with special care needs',
              'Do you have children with needs for special care'
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
    /* {
      id: 'item-3',
      title:
        'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme',
      content: (
        <>
          Have additional travel distance or expenses related to dropping off
          the child in a child day care centre or after-school supervision
          scheme.
          <p className="text-black pt-[12px] pb-[6px]">Documented expenses</p>
          <FormInput
            name="Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme.Documented expenses"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="NOK 500"
            defaultValue={getDefaultValue(
              'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme',
              'Documented expenses'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">Extra travel distance</p>
          <FormInput
            name="Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme.Extra travel distance"
            customClassName="w-full"
            type="number"
            control={control}
            placeholder="50 km"
            defaultValue={getDefaultValue(
              'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme',
              'Extra travel distance'
            )}
            required
          />
          <p className="text-black pt-[12px] pb-[6px]">
            Upload verification document
          </p>
          <FormReceiptInput
            name="Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme.Upload verification document"
            control={control}
            setValue={setValue}
            defaultValue={getDefaultValue(
              'Have additional travel distance or expenses related to dropping off the child in a child day care centre or after-school supervision scheme',
              'Upload verification document'
            )}
          />
        </>
      ),
    }, */
    {
      id: 'item-3',
      title: 'I am a single parent',
      content: (
        <div>
          <p className="">
            Single parents now receive financial support through other
            mechanisms, such as:
          </p>

          <ol>
            <li>
              <span className="font-semibold">
                Extended Child Benefit (Utvidet barnetrygd)
              </span>
              : Single parents receive additional child benefits.
            </li>
            <li>
              <span className="font-semibold">
                Deductions for Childcare Expenses
              </span>
              : Deduct costs for day care and after-school programs.
            </li>
            <li>
              <span className="font-semibold">Commuting Deductions</span>: For
              extra travel costs related to children, such as drop-offs.
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
