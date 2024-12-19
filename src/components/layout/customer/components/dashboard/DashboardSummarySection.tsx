'use client';

import React, { useState } from 'react';
import DeductiveExpenses from './DeductiveExpenses';
import SummaryChart from './SummaryChart';
import YearlyExpenseGraph from './YearlyExpenseGraph';
import { trpc } from '@/utils/trpc';
import AggregatedExpenseCard from './AggregatedExpenseCard';
import {
  CustomCategory,
  finalCalculation,
} from '@/utils/helpers/primaryCategoriesWithFormula';
import { predefinedCategories } from '@/utils/dummy';
import { useAppSelector } from '@/redux/hooks';
import { questionnaireSelector } from '@/redux/slices/questionnaire';
import { manipulatePersonalDeductions } from '@/utils/helpers/manipulatePersonalDeductions';
import { useManipulatedCategories } from '@/hooks/useManipulateCategories';
import { manipulateCustomCategoryExpenses } from '@/utils/helpers/manipulateCustomCategoryExpenses';
import { numberFormatter } from '@/utils/helpers/numberFormatter';

const DashboardSummarySection = () => {
  const [showPersonal, setShowPersonal] = useState<'personal' | 'business'>(
    'business'
  );
  const { data: expensesAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });

  const { data: rawExpenseAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
    });
  const { categories } = useManipulatedCategories({ category_for: 'expense' });

  const referenceCategories = categories?.data?.filter(
    (category: { title: string; reference_category: string }) =>
      category.reference_category
  );

  const dbCategories = expensesAnalytics?.data?.categoryWiseExpenses;

  const customCategories = manipulateCustomCategoryExpenses(
    referenceCategories || [],
    dbCategories
  ) as CustomCategory[];

  const businessData = finalCalculation(
    dbCategories,
    predefinedCategories,
    customCategories
  );

  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const personalData = manipulatePersonalDeductions(questionnaires, user);

  const summaryChartData =
    showPersonal === 'business' ? businessData : personalData;

  const totalExpenseAmount = rawExpenseAnalytics?.data?.expenseTypeWiseExpenses
    ? rawExpenseAnalytics?.data?.expenseTypeWiseExpenses?.reduce(
        (acc: number, curr: { amount: number }) => acc + curr.amount,
        0
      )
    : 0;
  console.log('totalExpenseAmount', rawExpenseAnalytics);
  return (
    <div>
      {/* <h1 className="text-gray-500 font-bold text-xs uppercase mb-2">
        Write-offs Overview
      </h1> */}
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-5">
          <div>
            <div className="p-4 bg-white rounded-2xl mb-2">
              <h1 className="font-semibold text-sm text-gray-500 mb-2">
                Total Expenses from bank statement
              </h1>
              <p className="text-xl font-bold text-[#00104B]">{`NOK ${numberFormatter(totalExpenseAmount)}`}</p>
            </div>
            <div className="grid grid-cols-12 gap-2">
              <DeductiveExpenses businessData={businessData} />
              <SummaryChart
                expenses={summaryChartData}
                showPersonal={showPersonal}
                setShowPersonal={setShowPersonal}
              />
            </div>
          </div>
        </div>
        <YearlyExpenseGraph />
        <div className="col-span-12 grid grid-cols-2 gap-2">
          <AggregatedExpenseCard
            origin="business"
            items={businessData}
            title="Write-offs From Business Spending (Total)"
          />
          <AggregatedExpenseCard
            title="Write-offs From Personal Spending (Total)"
            origin="personal"
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardSummarySection;
