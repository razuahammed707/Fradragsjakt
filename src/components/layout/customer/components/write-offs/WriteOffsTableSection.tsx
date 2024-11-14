'use client';
import React, { useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { WriteOffsTableColumns } from './WriteOffsTableColumns';

export default function WriteOffsTableSection({
  categoryWiseExpenses,
}: {
  categoryWiseExpenses: object[];
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const [pageLimit, setPageLimit] = useState(50);

  const handlePageLimitChange = (page: number) => {
    setPageLimit(page);
  };
  return (
    <div className="rounded-2xl mt-2 p-6 bg-white">
      <div className="flex justify-between items-center mb-4  ">
        <h2 className="text-xl text-[#101010] font-bold">Edit write-offs</h2>
        <div className="flex gap-2">
          <SearchInput className="" placeholder="Search expenses" />
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          columns={WriteOffsTableColumns}
          data={categoryWiseExpenses || []}
        />
        <div className="mt-10">
          <SharedPagination
            currentPage={currentPage}
            pageLimit={pageLimit}
            totalPages={1}
            onPageChange={handlePageChange}
            onPageLimitChange={handlePageLimitChange}
          />
        </div>
      </div>
    </div>
  );
}
