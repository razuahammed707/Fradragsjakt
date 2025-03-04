'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import formatDate from '@/utils/helpers/formatDate';
// import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
// import ExpenseUpdateModal from './ExpenseUpdateModal';
// import ExpenseDetailsModal from './ExpenseDetailsModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
// import useUserInfo from '@/hooks/use-user-info';

export type ExpenseColumnProps = {
  _id: string;
  id: string;
  transaction_date?: string | Date;
  createdAt?: string;
  description: string;
  category: string;
  sub_category?: string;
  tag_category?: string;
  expense_type: 'business' | 'personal' | 'unknown';
  amount: number;
  note?: string;
  receipt?: {
    link: string;
    mimeType: string;
  } | null;
};

export const ExpenseDataTableColumns = (
  onMerchantClick: (rowData: ExpenseColumnProps) => void
): ColumnDef<ExpenseColumnProps>[] => {
  const { translate } = useTranslation();
  // const { isAuditor } = useUserInfo();

  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          className="border border-[#E4E4E7] shadow-none rounded-none  data-[state=checked]:text-white"
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          className="border border-[#E4E4E7] shadow-none rounded-none  data-[state=checked]:text-white"
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    },
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
      size: 120,
    },
    {
      accessorKey: 'description',
      id: 'description',
      header: translate(
        'page.expenseDataTableColumns.description',
        'Description'
      ),
      cell: ({ row }) => {
        const handleClick = () => {
          console.log('Merchant clicked, data:', row.original);
          onMerchantClick(row.original);
        };

        return (
          <div
            role="button"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
            className="text-[#00104B] cursor-pointer hover:underline p-1"
          >
            {row.getValue('description')}
          </div>
        );
      },
      size: 200,
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.expenseDataTableColumns.category', 'Category')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('category'))}</span>
      ),
      size: 150,
    },
    {
      accessorKey: 'expense_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.expenseDataTableColumns.status', 'Status')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>
          {row.getValue('expense_type') === 'business'
            ? 'Deduction'
            : row.getValue('expense_type') === 'personal'
              ? 'Not Deductible'
              : 'Ask me'}
        </span>
      ),
      size: 130,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {translate('page.expenseDataTableColumns.amount', 'Amount')}{' '}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const amountToRender = row.getValue('amount') as number;
        return (
          <span className="text-[#00104B]">
            {`NOK ${numberFormatter(amountToRender)}`}
          </span>
        );
      },
      size: 120,
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
  ];
};
