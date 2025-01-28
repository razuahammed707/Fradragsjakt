'use client';
import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { YearlyExpenseTableColumns } from './YearlyExpenseTableColumns';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import useIsWithinDashboard from '@/hooks/is-within-dashboard';

type RecentExpenseTableItem = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
};
type RecentExpenseTableItems = {
  data: RecentExpenseTableItem[];
};

const RecentExpenseTable = () => {
  const isWithinDashboard = useIsWithinDashboard();
  const { data: session } = useSession();
  const { data: expensesResponse } = trpc.expenses.getExpenses.useQuery(
    {
      page: 1,
      limit: 5,
    },
    {
      keepPreviousData: true,
    }
  ) as { data?: RecentExpenseTableItems };

  return (
    <div className="col-span-7 p-6 rounded-2xl bg-white">
      <div>
        <h4 className="text-sm text-[#101010] font-semibold">
          Recent Expenses Overview
        </h4>
      </div>

      <SharedDataTable
        columns={YearlyExpenseTableColumns()}
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
    </div>
  );
};

export default RecentExpenseTable;
