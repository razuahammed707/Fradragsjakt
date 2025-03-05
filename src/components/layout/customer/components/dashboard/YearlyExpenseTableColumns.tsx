'use client';

import { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from '@/lib/TranslationProvider';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import formatDate from '@/utils/helpers/formatDate';
import { ExpenseColumnProps } from '../expenses/ExpenseDataTableColumns';
// import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
// import ExpenseUpdateModal from '../expenses/ExpenseUpdateModal';
// import ExpenseDetailsModal from '../expenses/ExpenseDetailsModal';
// import useUserInfo from '@/hooks/use-user-info';

export type YearlyExpenseTableItem = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: 'business' | 'personal' | 'unknown';
  amount: number;
};

const useColumns = (onMerchantClick: (rowData: ExpenseColumnProps) => void) => {
  const { translate } = useTranslation();
  // const { isAuditor } = useUserInfo();

  return [
    {
      accessorKey: 'transaction_date',
      header: translate('page.expenseDataTableColumns.date', 'Date'),
      cell: ({ row }) => {
        const transactionDate = row.getValue('transaction_date') as string;
        const createdAt = row.original.createdAt;
        const dateToRender = transactionDate || createdAt || '';
        return (
          <span className="text-[#00104B]">{formatDate(dateToRender)}</span>
        );
      },
    },
    {
      accessorKey: 'description',
      header: translate(
        'page.expenseDataTableColumns.description',
        'Description'
      ),
      cell: ({ row }) => (
        <div
          role="button"
          tabIndex={0}
          onClick={() => onMerchantClick(row.original as ExpenseColumnProps)}
          onKeyDown={(e) =>
            e.key === 'Enter' &&
            onMerchantClick(row.original as ExpenseColumnProps)
          }
          className="text-[#00104B] cursor-pointer hover:underline p-1"
        >
          {row.getValue('description')}
        </div>
      ),
    },
    {
      accessorKey: 'category',
      header: translate('page.expenseDataTableColumns.category', 'Category'),
      cell: ({ row }) => <span>{row.getValue('category')}</span>,
    },
    {
      accessorKey: 'expense_type',
      header: translate('page.expenseDataTableColumns.status', 'Status'),
      cell: ({ row }) => (
        <span>
          {row.getValue('expense_type') === 'business'
            ? 'Deduction'
            : row.getValue('expense_type') === 'personal'
              ? 'Not Deductible'
              : 'Ask me'}
        </span>
      ),
    },
    {
      accessorKey: 'amount',
      header: translate('page.expenseDataTableColumns.amount', 'Amount'),
      cell: ({ row }) => {
        const amountToRender = row.getValue('amount') as number;
        return (
          <span className="text-[#00104B]">
            {`kr ${numberFormatter(amountToRender)}`}
          </span>
        );
      },
    },
    /* Commenting out actions column
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <div className={`my-2`}>
            <ExpenseDetailsModal payload={row.original} />
          </div>
          {!isAuditor && (
            <>
              <ExpenseUpdateModal payload={row.original as unknown as any} />
              <SharedDeleteActionCell
                itemOrigin="expense"
                itemId={row.original._id as string}
              />
            </>
          )}
        </div>
      ),
    },
    */
  ] as ColumnDef<YearlyExpenseTableItem>[];
};

export const YearlyExpenseTableColumns = (
  onMerchantClick: (rowData: ExpenseColumnProps) => void
): ColumnDef<YearlyExpenseTableItem>[] => {
  return useColumns(onMerchantClick);
};
