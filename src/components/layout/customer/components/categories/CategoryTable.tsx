'use client';
import React, { useCallback, useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import { CategoryTableColumns } from './CategoryTableColumns';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import CategoryAddModal from './CategoryAddModal';
import { trpc } from '@/utils/trpc';
import { debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';

export type FormData = {
  title: string;
};
export default function CategoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { translate } = useTranslation();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { data } = trpc.categories.getCategories.useQuery(
    {
      page: currentPage,
      limit: 50,
      searchTerm,
    },
    {
      keepPreviousData: true,
    }
  );

  const debouncedSetSearchTerm = useCallback(debounce(setSearchTerm), [
    setSearchTerm,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };
  return (
    <div className="rounded-2xl p-6 bg-white">
      <div className="flex justify-between items-center mb-4  ">
        <h2 className="text-xl text-[#101010] font-bold">
          {translate(
            'page.CategoryDataTableColumns.overview',
            'Category Overview'
          )}
        </h2>
        <div className="flex gap-2">
          <SearchInput
            className=""
            onChange={handleSearchChange}
            placeholder={translate(
              'page.CategoryDataTableColumns.search',
              'Search category'
            )}
          />
          {/*  */}
          <CategoryAddModal />
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          className="min-h-[500px]"
          columns={CategoryTableColumns()}
          data={data?.data ?? []}
        />
        <div className="mt-10">
          <SharedPagination
            currentPage={currentPage}
            totalPages={data?.pagination?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
