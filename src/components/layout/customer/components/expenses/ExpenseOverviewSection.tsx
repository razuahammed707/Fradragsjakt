'use client';

import React, { useState } from 'react';
import ExpenseOverviewHeading from './ExpenseOverviewHeading';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { expenseDataTableColumns } from './ExpenseDataTableColumns';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

function ExpenseOverviewSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const utils = trpc.useUtils();

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
  const deleteRowMutation = trpc.expenses.deleteExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      toast.success('Expense deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete expense');
    },
  });
  const handleRowDelete = (expenseId: string) => {
    deleteRowMutation.mutate({ expenseId });
  };
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
          columns={expenseDataTableColumns(handleRowDelete)}
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
