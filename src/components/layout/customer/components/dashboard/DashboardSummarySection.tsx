'use client';
import React from 'react';
import ExpenseCard, { expenses } from './ExpenseCard';
import DeductiveExpenses from './DeductiveExpenses';
import SummaryChart from './SummaryChart';
import YearlyExpenseGraph from './YearlyExpenseGraph';
import { trpc } from '@/utils/trpc';
import { updateExpenses } from '@/utils/helpers/categoryMapperForExpense';

const DashboardSummarySection = () => {
  const { data: expensesAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
    });

  const categoryAnalytics = expensesAnalytics?.data?.categoryWiseExpenses;
  const personalExpenses =
    expensesAnalytics?.data?.expenseTypeWiseExpenses?.find(
      (item: { expense_type: string }) => item.expense_type === 'personal'
    );

  console.log('expensesAnalytics', personalExpenses?.amount);

  const mappedExpenses = updateExpenses(
    expenses(personalExpenses?.amount),
    categoryAnalytics
  );
  console.log('updatedExpenses', mappedExpenses);

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
      <div className="col-span-12 grid grid-cols-3 gap-2">
        {mappedExpenses?.map((expense, index) => (
          <ExpenseCard key={index} expense={expense} index={index} />
        ))}
      </div>
    </div>
  );
};

export default DashboardSummarySection;
