'use client';
import React from 'react';
//import ExpenseCard, { expenses } from './ExpenseCard';
import DeductiveExpenses from './DeductiveExpenses';
import SummaryChart from './SummaryChart';
import YearlyExpenseGraph from './YearlyExpenseGraph';
import { trpc } from '@/utils/trpc';
//import { updateExpenses } from '@/utils/helpers/categoryMapperForExpense';
import AggregatedExpenseCard from './AggregatedExpenseCard';
const businessSpending = {
  title: 'Business Spending (Total)',
  total: 'NOK 6,150',
  items: [
    {
      category: 'Office and Workspace',
      amount: 'NOK 250',
      difference: '+NOK 50',
    },
    {
      category: 'Technology and Communication',
      amount: 'NOK 250',
      difference: '+NOK 50',
    },
    {
      category: 'Professional Services',
      amount: 'NOK 250',
      difference: '-NOK 50',
    },
  ],
};

const personalSpending = {
  title: 'Personal Spending (Total)',
  total: 'NOK 6,150',
  items: [
    {
      category: 'Health & Family',
      amount: 'NOK 300',
      difference: '-NOK 50',
    },
    {
      category: 'Banks & Loans',
      amount: 'NOK 250',
      difference: '+NOK 50',
    },
    {
      category: 'Housing & Property',
      amount: 'NOK 250',
      difference: '-NOK 50',
    },
    {
      category: 'Furniture and Equipment',
      amount: 'NOK 250',
      difference: '-NOK 50',
    },
    {
      category: 'Office Supplies',
      amount: 'NOK 350',
      difference: '-NOK 50',
    },
  ],
};
const DashboardSummarySection = () => {
  const { data: expensesAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
    });

  const categoryAnalytics = expensesAnalytics?.data?.categoryWiseExpenses;
  // const personalExpenses =
  //   expensesAnalytics?.data?.expenseTypeWiseExpenses?.find(
  //     (item: { expense_type: string }) => item.expense_type === 'personal'
  //   );

  // const mappedExpenses = updateExpenses(
  //   expenses(personalExpenses?.amount),
  //   categoryAnalytics
  // );

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
        <AggregatedExpenseCard {...businessSpending} />
        <AggregatedExpenseCard {...personalSpending} />
      </div>
    </div>
  );
};

export default DashboardSummarySection;
