'use client';

import React, { useState } from 'react';
import DeductiveExpenses from './DeductiveExpenses';
import SummaryChart from './SummaryChart';
import { trpc } from '@/utils/trpc';
import {
  CustomCategory,
  finalCalculation,
} from '@/utils/helpers/primaryCategoriesWithFormula';
import { predefinedCategories } from '@/utils/dummy';
import { manipulatePersonalDeductions } from '@/utils/helpers/manipulatePersonalDeductions';
import { useManipulatedCategories } from '@/hooks/useManipulateCategories';
import { manipulateCustomCategoryExpenses } from '@/utils/helpers/manipulateCustomCategoryExpenses';
import RecentExpenseTable from './RecentExpenseTable';
import UploadingStatementsWarning from './UploadingStatementsWarning';
import { formatNumberWithTwoDecimals } from '@/utils/helpers/formatNumberWithTwoDecimals';

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

  const referenceCategories = categories?.filter(
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

  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const personalData = manipulatePersonalDeductions(user?.questionnaires || []);

  const summaryChartData =
    showPersonal === 'business' ? businessData : personalData;

  const totalExpenseAmount = rawExpenseAnalytics?.data?.expenseTypeWiseExpenses
    ? rawExpenseAnalytics?.data?.expenseTypeWiseExpenses?.reduce(
        (acc: number, curr: { amount: number }) => acc + curr.amount,
        0
      )
    : 0;
  return (
    <div>
      <UploadingStatementsWarning />
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-5">
          <div>
            <div className="p-4 bg-white rounded-2xl mb-2">
              <h1 className="font-semibold text-sm text-gray-500 mb-2">
                Total Expenses from bank statement
              </h1>
              <p className="text-xl font-bold text-red-400">{`NOK ${formatNumberWithTwoDecimals(totalExpenseAmount)}`}</p>
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
        <RecentExpenseTable />
      </div>
    </div>
  );
};

export default DashboardSummarySection;
