/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useCallback, useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { WriteOffsTableColumns } from './WriteOffsTableColumns';
import { trpc } from '@/utils/trpc';
import { cn, debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';
import SharedReportDownloader from '@/components/SharedReportDownloader';
import useIsWithinDashboard from '@/hooks/is-within-dashboard';

export default function WriteOffsTableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit, setPageLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');
  const isWithinDashboard = useIsWithinDashboard();
  const { data: writeOffs } = trpc.expenses.getWriteOffs.useQuery({
    page: currentPage,
    limit: pageLimit,
    searchTerm,
  });

  const { translate } = useTranslation();

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
    <div
      className={cn(
        'col-span-6 rounded-2xl p-6 bg-white',
        !isWithinDashboard && 'mt-2'
      )}
    >
      <div className="flex justify-between items-center mb-4  ">
        <h2
          className={cn(
            'text-xl  font-bold',
            isWithinDashboard && 'text-sm font-semibold'
          )}
        >
          {isWithinDashboard
            ? 'Write-offs overview'
            : translate('page.writeoffoverview.title')}
        </h2>
        <div className={cn('flex gap-2', isWithinDashboard && 'hidden')}>
          <SearchInput
            className=""
            placeholder={translate(
              'page.search.write_off',
              'Search Write-offs'
            )}
            onChange={handleSearchChange}
          />
          <SharedReportDownloader
            body={writeOffs?.data}
            total={writeOffs?.data?.reduce(
              (sum: any, item: { amount: any }) => sum + item.amount,
              0
            )}
          />
        </div>
      </div>
      <div className={cn(!isWithinDashboard && 'mt-10')}>
        <SharedDataTable
          columns={WriteOffsTableColumns()}
          data={writeOffs?.data || []}
          className={cn(isWithinDashboard && 'h-[350px]')}
        />
        <div className={cn('mt-10', isWithinDashboard && 'hidden')}>
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
