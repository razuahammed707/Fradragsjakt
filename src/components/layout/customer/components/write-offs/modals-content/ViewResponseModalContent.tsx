'use client';

import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/redux/hooks';
import { questionnaireSelector } from '@/redux/slices/questionnaire';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { savingExpenseCalculator } from '@/utils/helpers/savingExpenseCalculator';
import SadImg from '../../../../../../../public/sad.svg';
import { trpc } from '@/utils/trpc';
import Image from 'next/image';

type ExpenseAmounts = {
  workAndEducationExpenseAmount: number;
  healthAndFamilyExpenseAmount: number;
  bankAndLoansExpenseAmount: number;
  hobbyOddjobsAndExtraIncomesExpenseAmount: number;
  housingAndPropertyExpenseAmount: number;
  giftsOrDonationsExpenseAmount: number;
  foreignIncomeExpenseAmount: number;
};

// Mapping between questionnaire section names and expense amount keys
const SECTION_TO_EXPENSE_MAP: { [key: string]: keyof ExpenseAmounts } = {
  'Health and Family': 'healthAndFamilyExpenseAmount',
  'Bank and Loans': 'bankAndLoansExpenseAmount',
  'Work and Education': 'workAndEducationExpenseAmount',
  'Housing and Property': 'housingAndPropertyExpenseAmount',
  'Gifts or Donations': 'giftsOrDonationsExpenseAmount',
  'Hobby, Odd Jobs, and Extra Incomes':
    'hobbyOddjobsAndExtraIncomesExpenseAmount',
  'Foreign Income': 'foreignIncomeExpenseAmount',
};

const ViewResponseModalContent = () => {
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const sortedQuestionnaires = [...questionnaires].sort((a, b) => {
    const aIndex = Object.keys(SECTION_TO_EXPENSE_MAP).indexOf(a.question);
    const bIndex = Object.keys(SECTION_TO_EXPENSE_MAP).indexOf(b.question);
    return aIndex - bIndex;
  });

  const expenseAmounts: ExpenseAmounts = savingExpenseCalculator(
    sortedQuestionnaires,
    user?.questionnaires
  );

  return (
    <div className="text-[#101010] space-y-2">
      <h2 className="text-[20px] font-semibold">
        Review Questionaries Details
      </h2>
      <div className="view-response h-[500px] overflow-y-auto overflow-x-hidden space-y-6 pr-[10px]">
        {sortedQuestionnaires.length > 0 ? (
          sortedQuestionnaires.map((section, index) => (
            <div key={index} className="bg-[#F8F8F8] p-[10px] space-y-[18px]">
              <h3 className="text-sm text-[#5B52F9] font-bold">{`${index + 1}. ${section.question} `}</h3>
              {section.answers.map((answer, answerIndex) => (
                <div key={answerIndex}>
                  {Object.entries(answer).map(([key, value]) => (
                    <div key={key}>
                      <span className="text-xs font-bold leading-[150%]">
                        {key}{' '}
                      </span>
                      {Array.isArray(value) ? (
                        value.map((item, itemIndex) => (
                          <div key={itemIndex} className="space-y-[5px] mt-2">
                            {Object.entries(item).map(
                              ([k, v]) =>
                                !k.includes('Upload') && (
                                  <div
                                    key={k}
                                    className="text-xs flex justify-between"
                                  >
                                    <p>{k} </p>
                                    <p className="font-medium">
                                      {v == 'yes'
                                        ? v || 0
                                        : k?.includes('rate')
                                          ? `${v || 0} %`
                                          : k?.includes('How many')
                                            ? v || 0
                                            : k?.includes('share')
                                              ? `${v || 0} %`
                                              : `NOK ${v || 0}`}{' '}
                                    </p>
                                  </div>
                                )
                            )}
                          </div>
                        ))
                      ) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-xs font-bold">
                <p>
                  Write offs{' '}
                  <span className="font-normal">
                    after threshold and condition applied
                  </span>
                </p>
                <p>
                  NOK{' '}
                  {SECTION_TO_EXPENSE_MAP[section.question]
                    ? numberFormatter(
                        expenseAmounts[SECTION_TO_EXPENSE_MAP[section.question]]
                      )
                    : 0}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className=" h-full flex flex-col items-center justify-center">
            <Image
              src={SadImg}
              height={91}
              width={136}
              alt="sad expressed img"
            />
            <p className="text-xs text-[#101010] font-semibold mt-[10px]">
              No data found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResponseModalContent;
