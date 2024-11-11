'use client';
import React, { useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { WriteOffs, WriteOffsTableColumns } from './WriteOffsTableColumns';

const data: WriteOffs[] = [
  {
    id: '1',
    category: 'Clothing',
    amount: 3,
    expenseType: 'Deductible',
    deduction: 30.65,
  },
  {
    id: '2',
    category: 'Meals',
    amount: 18,
    expenseType: 'Deductible',
    deduction: 30.65,
  },
  {
    id: '3',
    category: 'Travel',
    amount: 6,
    expenseType: 'Deductible',
    deduction: 100.2,
  },
  {
    id: '4',
    category: 'Supplies',
    amount: 12,
    expenseType: 'Deductible',
    deduction: 100.0,
  },
  {
    id: '5',
    category: 'Payment',
    amount: 5,
    expenseType: 'Deductible',
    deduction: 100.25,
  },
  {
    id: '6',
    category: 'Transport',
    amount: 5,
    expenseType: 'Deductible',
    deduction: 100.25,
  },
  {
    id: '7',
    category: 'Gas',
    amount: 2,
    expenseType: 'Deductible',
    deduction: 100.25,
  },
  {
    id: '8',
    category: 'Others',
    amount: 2,
    expenseType: 'Deductible',
    deduction: 100.26,
  },
];

export default function WriteOffsTableSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
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
        <SharedDataTable columns={WriteOffsTableColumns} data={data} />
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
