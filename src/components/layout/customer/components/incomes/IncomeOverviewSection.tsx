'use client';

import React, { useState } from 'react';
import SharedPagination from '@/components/SharedPagination';
import { SharedDataTable } from '@/components/SharedDataTable';
import { IncomeDataTableColumns } from './incomeDataTableColumns';
import { trpc } from '@/utils/trpc';
import IncomeOverviewTools from './IncomeOverviewTools';

type IFilterProps = {
  filterString: string;
  setFilterString: React.Dispatch<React.SetStateAction<string>>;
};

function IncomeOverviewSection({
  filterString,
  setFilterString,
}: IFilterProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [resetSelection, setResetSelection] = useState(false);

  const { data: incomesResponse, isLoading } = trpc.incomes.getIncomes.useQuery(
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
      <IncomeOverviewTools
        setSearchTerm={setSearchTerm}
        setFilterString={setFilterString}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        onDeleteComplete={handleSelectionReset}
      />
      <div className="space-y-6">
        <SharedDataTable
          loading={isLoading}
          columns={IncomeDataTableColumns()}
          data={incomesResponse?.data || []}
          onSelectionChange={setSelectedIds}
          resetRowSelection={resetSelection}
        />
        <SharedPagination
          currentPage={currentPage}
          pageLimit={pageLimit}
          totalPages={incomesResponse?.pagination?.totalPages ?? 1}
          onPageChange={handlePageChange}
          onPageLimitChange={handlePageLimitChange}
        />
      </div>
    </div>
  );
}

export default IncomeOverviewSection;
