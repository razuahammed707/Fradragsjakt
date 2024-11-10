'use client';

import React, { useState } from 'react';
import ExpenseOverviewHeading from './ExpenseOverviewHeading';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { expenseDataTableColumns } from './ExpenseDataTableColumns';
import { trpc } from '@/utils/trpc';

function ExpenseOverviewSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: expensesResponse } = trpc.expenses.getExpenses.useQuery(
    {
      page: currentPage,
    },
    {
      keepPreviousData: true,
    }
  );
  console.log('expense_data: ', expensesResponse);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mt-3 rounded-2xl p-6 space-y-6 bg-white">
      <ExpenseOverviewHeading />
      <div className="space-y-6">
        <SharedDataTable
          className="min-h-[500px]"
          columns={expenseDataTableColumns}
          data={expensesResponse?.data || []}
        />
        <SharedPagination
          currentPage={currentPage}
          totalPages={expensesResponse?.pagination?.totalPages ?? 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default ExpenseOverviewSection;
