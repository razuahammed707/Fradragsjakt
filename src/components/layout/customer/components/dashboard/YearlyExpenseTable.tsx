'use client';
import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { YearlyExpenseTableColumns } from './YearlyExpenseTableColumns';

// Define the type for a single expense item
type YearlyExpenseItem = {
  _id: string;
  expense_type: string;
  deductible_status: string;
  amount: number;
  description: string;
  transaction_date: Date | string;
};

// Correct the props type for the component
type YearlyExpenseTableProps = {
  data: YearlyExpenseItem[];
};

const YearlyExpenseTable = ({ data }: YearlyExpenseTableProps) => {
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
          data={data || []}
        />
      </div>
    </div>
  );
};

export default YearlyExpenseTable;
