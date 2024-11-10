'use client';
import React, { useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { RulesDataTableColumns } from './RulesDataTableColumns';
import CreateRuleModal from './CreateRuleModal';
import { trpc } from '@/config/trpc/client';

export default function RulesOverviewSection() {
  const { data: rulesResponse } = trpc.rules.getRules.useQuery({
    page: 1,
    limit: 10,
  });

  // const rules = rulesResponse || [];
  const pagination = rulesResponse?.pagination;
  const totalPages = pagination?.totalPages || 1;

  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  console.log('rules', rulesResponse);

  return (
    <div className="rounded-2xl mt-2 p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl text-[#101010] font-bold">Edit Rules</h2>
        <div className="flex gap-2">
          <SearchInput className="" placeholder="Search Rules" />
          <CreateRuleModal />
          {/* <Button className="text-white w-[124px] text-sm font-medium">
            Save
          </Button> */}
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          columns={RulesDataTableColumns}
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
