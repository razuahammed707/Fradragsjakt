'use client';
import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { YearlyExpenseTableColumns } from './YearlyExpenseTableColumns';

const YearlyExpenseTable = () => {
  const data = [
    {
      id: '1',
      date: '8/30/24',
      expense_description: 'Chase',
      expense_type: 'Private',
      status: 'Deductible',
      category: 'Clothing',
      amount: 100,
    },
    {
      id: '2',
      date: '8/30/24',
      expense_description: 'Chase',
      expense_type: 'Public',
      status: 'Non-deductible',
      category: 'Travel',
      amount: 100,
    },
    {
      id: '3',
      date: '8/30/24',
      expense_description: 'Chase',
      expense_type: 'Private',
      status: 'Deductible',
      category: 'Clothing',
      amount: 100,
    },
    {
      id: '4',
      date: '8/30/24',
      expense_description: 'Chase',
      expense_type: 'Public',
      status: 'Non-deductible',
      category: 'Travel',
      amount: 100,
    },
  ];

  /* const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10; 

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
   }; */
  return (
    <div className="col-span-9 space-y-6 p-6 rounded-2xl bg-white">
      <div>
        <h4 className="text-sm text-[#101010] font-semibold">
          Total Expenses Overview
        </h4>
        <p className="text-xs text-[#71717A] font-medium ">
          <span className="text-[#00B386] font-bold">+2%</span> in August
        </p>
      </div>
      <div className="">
        <SharedDataTable
          className="max-h-[250px]"
          columns={YearlyExpenseTableColumns}
          data={data}
        />
      </div>
    </div>
  );
};

export default YearlyExpenseTable;
