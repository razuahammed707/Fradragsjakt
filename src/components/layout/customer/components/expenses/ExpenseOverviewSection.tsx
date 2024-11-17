'use client';

import React, { useState } from 'react';
import ExpenseOverviewHeading from './ExpenseOverviewHeading';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { expenseDataTableColumns } from './ExpenseDataTableColumns';
import { trpc } from '@/utils/trpc';

function ExpenseOverviewSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: expensesResponse, isLoading } =
    trpc.expenses.getExpenses.useQuery(
      {
        page: currentPage,
        limit: pageLimit,
        searchTerm,
      },
      {
        keepPreviousData: true,
      }
    );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const handlePageLimitChange = (page: number) => {
    setPageLimit(page);
  };

  console.log('search term', searchTerm);
  return (
    <div className="mt-3 rounded-2xl p-6 space-y-6 bg-white">
      <ExpenseOverviewHeading setSearchTerm={setSearchTerm} />
      <div className="space-y-6">
        <SharedDataTable
          loading={isLoading}
          columns={expenseDataTableColumns}
          data={expensesResponse?.data || []}
        />
        <SharedPagination
          currentPage={currentPage}
          pageLimit={pageLimit}
          totalPages={expensesResponse?.pagination?.totalPages ?? 1}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
      </div>
    </div>
  );
}

export default ExpenseOverviewSection;
