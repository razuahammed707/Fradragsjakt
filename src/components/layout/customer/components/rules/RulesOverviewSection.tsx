'use client';
import React, { useCallback, useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { RulesDataTableColumns } from './RulesDataTableColumns';
import CreateRuleModal from './CreateRuleModal';
import { trpc } from '@/config/trpc/client';
import { debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';

export default function RulesOverviewSection() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { translate } = useTranslation();
  const { data: rulesResponse } = trpc.rules.getRules.useQuery(
    {
      page: 1,
      limit: 50,
      searchTerm,
    },
    { keepPreviousData: true }
  );

  // const rules = rulesResponse || [];
  const pagination = rulesResponse?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const debouncedSetSearchTerm = useCallback(debounce(setSearchTerm), [
    setSearchTerm,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  return (
    <div className="rounded-2xl mt-2 p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-[#101010] font-bold">
          {translate('page.rulesTopSection.heading')}
        </h2>
        <div className="flex gap-2">
          <SearchInput
            className=""
            placeholder={translate('page.rulesTopSection.search')}
            onChange={handleSearchChange}
          />
          <CreateRuleModal />
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          columns={RulesDataTableColumns()}
          data={rulesResponse?.data || []}
        />
        <div className="mt-10">
          <SharedPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}
