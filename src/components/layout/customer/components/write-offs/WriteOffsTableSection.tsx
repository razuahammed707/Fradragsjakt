'use client';
import React, { useCallback, useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { WriteOffsTableColumns } from './WriteOffsTableColumns';
import { trpc } from '@/utils/trpc';
import { debounce } from '@/lib/utils';

export default function WriteOffsTableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: writeOffs } = trpc.expenses.getWriteOffs.useQuery({
    page: currentPage,
    limit: pageLimit,
    searchTerm,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageLimitChange = (page: number) => {
    setPageLimit(page);
  };

  const debouncedSetSearchTerm = useCallback(debounce(setSearchTerm), [
    setSearchTerm,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };
  return (
    <div className="rounded-2xl mt-2 p-6 bg-white">
      <div className="flex justify-between items-center mb-4  ">
        <h2 className="text-xl text-[#101010] font-bold">Edit write-offs</h2>
        <div className="flex gap-2">
          <SearchInput
            className=""
            placeholder="Search write-offs"
            onChange={handleSearchChange}
          />
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          columns={WriteOffsTableColumns}
          data={writeOffs?.data || []}
        />
        <div className="mt-10">
          <SharedPagination
            currentPage={currentPage}
            pageLimit={pageLimit}
            totalPages={writeOffs?.pagination?.totalPages ?? 1}
            onPageChange={handlePageChange}
            onPageLimitChange={handlePageLimitChange}
          />
        </div>
      </div>
    </div>
  );
}
