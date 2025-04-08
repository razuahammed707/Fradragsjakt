'use client';
import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { YearlyExpenseTableColumns } from './YearlyExpenseTableColumns';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import useIsWithinDashboard from '@/hooks/is-within-dashboard';
import ExpenseUpdateModal from '../expenses/ExpenseUpdateModal';
import { ExpenseColumnProps } from '../expenses/ExpenseDataTableColumns';

type RecentExpenseTableItem = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: 'business' | 'personal' | 'unknown';
  amount: number;
};

type RecentExpenseTableItems = {
  data: RecentExpenseTableItem[];
};

const RecentExpenseTable = () => {
  const isWithinDashboard = useIsWithinDashboard();
  const { data: session } = useSession();
  const [selectedRow, setSelectedRow] =
    React.useState<ExpenseColumnProps | null>(null);

  const { data: expensesResponse } = trpc.expenses.getExpenses.useQuery(
    {
      category: null, // Add the required category parameter
      page: 1,
      limit: 5,
    },
    {
      keepPreviousData: true,
    }
  ) as { data?: RecentExpenseTableItems };

  const handleMerchantClick = React.useCallback(
    (rowData: ExpenseColumnProps) => {
      setSelectedRow(rowData);
    },
    []
  );

  return (
    <div className="col-span-7 p-6 rounded-2xl bg-white">
      <div>
        <h4 className="text-sm text-[#101010] font-semibold">
          Recent Expenses Overview
        </h4>
      </div>

      <SharedDataTable
        columns={YearlyExpenseTableColumns(handleMerchantClick)}
        data={expensesResponse?.data || []}
        className={cn('max-h-[312px] border mt-6', isWithinDashboard && 'mb-2')}
      />
      {(expensesResponse?.data?.length ?? 0) > 0 && (
        <Link
          href={`/${session?.user?.role}/expenses`}
          className="flex justify-center font-medium text-sm text-[#5B52F9]"
        >
          View more ...
        </Link>
      )}
      {selectedRow && (
        <ExpenseUpdateModal
          payload={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
};

export default RecentExpenseTable;
