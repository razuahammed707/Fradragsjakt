'use client';
import React, { useState } from 'react';
import ExpenseOverviewHeading from './ExpenseOverviewHeading';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { ExpenseDataTableColumns } from './ExpenseDataTableColumns';
import { trpc } from '@/utils/trpc';
import ExpenseUpdateModal, { PayloadType } from './ExpenseUpdateModal';
import { ExpenseColumnProps } from './ExpenseDataTableColumns';
import ExpenseTopSection from './ExpenseTopSection';

function ExpenseOverviewSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [resetSelection, setResetSelection] = useState(false);
  const [selectedRow, setSelectedRow] = useState<PayloadType | null>(null);

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

  const handleSelectionReset = () => {
    setResetSelection(true);
    setTimeout(() => setResetSelection(false), 100);
  };

  const handleMerchantClick = React.useCallback(
    (rowData: ExpenseColumnProps) => {
      setSelectedRow(rowData);
    },
    []
  );

  const utils = trpc.useContext();

  const { mutate: updateExpenseStatus } =
    trpc.expenses.updateExpenseStatus.useMutation({
      onSuccess: () => {
        utils.expenses.getExpenses.invalidate();
        utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      },
    });

  const handleStatusChange = (
    rowId: string,
    newStatus: 'business' | 'personal'
  ) => {
    updateExpenseStatus({ id: rowId, expense_type: newStatus });
  };

  return (
    <div className="space-y-6">
      <ExpenseOverviewHeading
        setSearchTerm={setSearchTerm}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDeleteComplete={handleSelectionReset}
      />
      <ExpenseTopSection />
      <div className="space-y-6 bg-white rounded-lg">
        <SharedDataTable
          loading={isLoading}
          columns={ExpenseDataTableColumns(
            handleMerchantClick,
            handleStatusChange
          )}
          data={expensesResponse?.data || []}
          onSelectionChange={setSelectedIds}
          resetRowSelection={resetSelection}
        />
        <SharedPagination
          currentPage={currentPage}
          pageLimit={pageLimit}
          totalPages={expensesResponse?.pagination?.totalPages ?? 1}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
      </div>
      {selectedRow && (
        <ExpenseUpdateModal
          payload={selectedRow}
          onClose={() => {
            setSelectedRow(null);
          }}
        />
      )}
    </div>
  );
}

export default ExpenseOverviewSection;
