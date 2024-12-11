'use client';

import { Separator } from '@/components/ui/separator';
import { useAppSelector } from '@/redux/hooks';
import { questionnaireSelector } from '@/redux/slices/questionnaire';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { savingExpenseCalculator } from '@/utils/helpers/savingExpenseCalculator';
import { trpc } from '@/utils/trpc';

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
  'Work and Education': 'workAndEducationExpenseAmount',
  'Health and Family': 'healthAndFamilyExpenseAmount',
  'Bank and Loans': 'bankAndLoansExpenseAmount',
  'Hobby, Odd Jobs, and Extra Incomes':
    'hobbyOddjobsAndExtraIncomesExpenseAmount',
  'Housing and Property': 'housingAndPropertyExpenseAmount',
  'Gifts or Donations': 'giftsOrDonationsExpenseAmount',
  'Foreign Income': 'foreignIncomeExpenseAmount',
};
const ViewResponseModalContent = () => {
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const expenseAmounts: ExpenseAmounts = savingExpenseCalculator(
    questionnaires,
    user?.questionnaires
  );

  return (
    <div className="text-[#101010] space-y-2">
      <h2 className="text-[20px] font-semibold">
        Review Questionaries Details
      </h2>
      <div className="view-response h-[500px] overflow-y-auto overflow-x-hidden space-y-6 pr-[10px]">
        {questionnaires.map((section, index) => (
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
                                    {v !== 'yes' ? `NOK ${v || 0}` : v || 0}{' '}
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
              <p>Deduction Amount</p>
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
        ))}
      </div>
    </div>
  );
};

export default ViewResponseModalContent;
