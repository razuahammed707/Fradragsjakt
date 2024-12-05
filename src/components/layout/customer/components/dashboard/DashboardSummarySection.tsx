'use client';

import React, { useState } from 'react';
import DeductiveExpenses from './DeductiveExpenses';
import SummaryChart from './SummaryChart';
import YearlyExpenseGraph from './YearlyExpenseGraph';
import { trpc } from '@/utils/trpc';
import AggregatedExpenseCard from './AggregatedExpenseCard';
import { finalCalculation } from '@/utils/helpers/primaryCategoriesWithFormula';
import { predefinedCategories } from '@/utils/dummy';
import { useAppSelector } from '@/redux/hooks';
import { questionnaireSelector } from '@/redux/slices/questionnaire';
import { manipulatePersonalDeductions } from '@/utils/helpers/manipulatePersonalDeductions';

const DashboardSummarySection = () => {
  const [showPersonal, setShowPersonal] = useState<'personal' | 'business'>(
    'business'
  );
  const { data: expensesAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });

  const categoryAnalytics = expensesAnalytics?.data?.categoryWiseExpenses;
  const cardData = finalCalculation(categoryAnalytics, predefinedCategories);

  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const personalData = manipulatePersonalDeductions(questionnaires, user);

  const summaryChartData =
    showPersonal === 'business' ? cardData : personalData;

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-5">
        <div className="grid grid-cols-12 gap-2">
          <DeductiveExpenses />
          <SummaryChart
            expenses={summaryChartData}
            showPersonal={showPersonal}
            setShowPersonal={setShowPersonal}
          />
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
          title="Tax Saved From Business Spending (Total)"
        />
        <AggregatedExpenseCard
          title="Tax Saved From Personal Spending (Total)"
          origin="personal"
        />
      </div>
    </div>
  );
};

export default DashboardSummarySection;
