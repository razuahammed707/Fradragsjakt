'use client';

import React, { useState } from 'react';
import ExpenseOverviewHeading from './ExpenseOverviewHeading';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { ExpenseDataTableColumns } from './ExpenseDataTableColumns';
import { trpc } from '@/utils/trpc';
import ExpenseUpdateModal, { PayloadType } from './ExpenseUpdateModal';

type IFilterProps = {
  filterString: string;
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
};

function ExpenseOverviewSection({
  filterString,
  setFilterString,
}: IFilterProps) {
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
        filterString,
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

  return (
    <div className="mt-3 rounded-2xl p-6 space-y-6 bg-white">
      <ExpenseOverviewHeading
        setSearchTerm={setSearchTerm}
        setFilterString={setFilterString}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDeleteComplete={handleSelectionReset}
      />
      <div className="space-y-6">
        <SharedDataTable
          loading={isLoading}
          columns={ExpenseDataTableColumns()}
          data={expensesResponse?.data || []}
          onSelectionChange={setSelectedIds}
          resetRowSelection={resetSelection}
          setSelectedRow={setSelectedRow}
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
          rowClickEnabled
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
}

export default ExpenseOverviewSection;
