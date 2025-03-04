'use client';

import React from 'react';
//import { useRouter } from 'next/navigation';
//import { useTranslation } from '@/lib/TranslationProvider';
//import { useUserInfo } from '@/hooks/use-user-info';
import { trpc } from '@/utils/trpc';
import { Loader2 } from 'lucide-react';
import { ExpenseColumnProps } from '@/components/layout/customer/components/expenses/ExpenseDataTableColumns';
import ExpenseUpdateModal, {
  PayloadType,
} from '@/components/layout/customer/components/expenses/ExpenseUpdateModal';

export default function DashboardPage() {
  //const router = useRouter();
  //const { translate } = useTranslation();
  //const { isAuditor } = useUserInfo();
  const [selectedRow, setSelectedRow] =
    React.useState<ExpenseColumnProps | null>(null);

  const { data: expensesResponse, isLoading } =
    trpc.expenses.getExpenses.useQuery(
      {
        page: 1,
        limit: 10,
        searchTerm: '',
        filterString: '',
      },
      {
        keepPreviousData: true,
      }
    );

  // Add this to debug
  React.useEffect(() => {
    console.log('Expenses data loaded:', expensesResponse?.data);
  }, [expensesResponse]);

  // Add this effect to handle initial data load
  React.useEffect(() => {
    // Reset selected row when data changes
    setSelectedRow(null);
  }, [expensesResponse?.data]);

  // Add this to debug
  React.useEffect(() => {
    console.log('Dashboard render, selectedRow:', selectedRow);
  }, [selectedRow]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* ... other dashboard content ... */}

      {/* Only render modal if there's a selected row AND it's not from initial data load */}
      {selectedRow && selectedRow._id && (
        <ExpenseUpdateModal
          payload={selectedRow as PayloadType}
          onClose={() => {
            console.log('Closing modal');
            setSelectedRow(null);
          }}
        />
      )}
    </div>
  );
}
