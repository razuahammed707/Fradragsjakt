'use client';
import React from 'react';
//import ExpenseCard, { expenses } from './ExpenseCard';
import DeductiveExpenses from './DeductiveExpenses';
import SummaryChart from './SummaryChart';
import YearlyExpenseGraph from './YearlyExpenseGraph';
import { trpc } from '@/utils/trpc';
//import { updateExpenses } from '@/utils/helpers/categoryMapperForExpense';
import AggregatedExpenseCard from './AggregatedExpenseCard';
import { finalCalculation } from '@/utils/helpers/primaryCategoriesWithFormula';
import { predefinedCategories } from '@/utils/dummy';
import { useAppSelector } from '@/redux/hooks';
import { questionnaireSelector } from '@/redux/slices/questionnaire';
import { savingExpenseCalculator } from '@/utils/helpers/savingExpenseCalculator';

const DashboardSummarySection = () => {
  const { data: expensesAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
    });

  const categoryAnalytics = expensesAnalytics?.data?.categoryWiseExpenses;
  const cardData = finalCalculation(categoryAnalytics, predefinedCategories);

  // const personalExpenses =
  //   expensesAnalytics?.data?.expenseTypeWiseExpenses?.find(
  //     (item: { expense_type: string }) => item.expense_type === 'personal'
  //   );

  // const mappedExpenses = updateExpenses(
  //   expenses(personalExpenses?.amount),
  //   categoryAnalytics
  // );
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();
  const {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  } = savingExpenseCalculator(questionnaires, user?.questionnaires);
  const personalData = [
    {
      title: 'Health and Family',
      total_amount: healthAndFamilyExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Bank and Loans',
      total_amount: bankAndLoansExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Work and Education',
      total_amount: workAndEducationExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Housing and Property',
      total_amount: housingAndPropertyExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Gifts/Donations',
      total_amount: giftsOrDonationsExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Hobby, Odd jobs, and Extra incomes',
      total_amount: hobbyOddjobsAndExtraIncomesExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Foreign Income',
      total_amount: foreignIncomeExpenseAmount,
      total_original_amount: 0,
      predefinedCategories: [],
    },
  ];

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-5">
        <div className="grid grid-cols-12 gap-2">
          <DeductiveExpenses />
          <SummaryChart expenses={categoryAnalytics} />
        </div>
      </div>

      {/* Yearly Graph */}
      <YearlyExpenseGraph />

      {/* Expense Categories */}
      {/* <div className="col-span-12 grid grid-cols-3 gap-2">
        {mappedExpenses?.map((expense, index) => (
          <ExpenseCard key={index} expense={expense} index={index} />
        ))}
      </div> */}
      <div className="col-span-12 grid grid-cols-2 gap-2">
        <AggregatedExpenseCard
          items={cardData}
          title="Tax saved from Business Spending (Total)"
        />
        <AggregatedExpenseCard
          title="Tax saved from Personal Spending (Total)"
          items={personalData}
          origin="personal"
        />
      </div>
    </div>
  );
};

export default DashboardSummarySection;
