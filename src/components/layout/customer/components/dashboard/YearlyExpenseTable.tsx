'use client';
import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { YearlyExpenseTableColumns } from './YearlyExpenseTableColumns';

// Define the type for a single expense item
type YearlyExpenseItem = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
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
          Recent Expenses Overview
        </h4>
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
