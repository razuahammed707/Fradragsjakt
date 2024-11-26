'use client';

import { ColumnDef } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import formatDate from '@/utils/helpers/formatDate';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import ExpenseUpdateModal from './ExpenseUpdateModal';
import ExpenseDetailsModal from './ExpenseDetailsModal';
import { useTranslation } from '@/lib/TranslationProvider';

export type ExpenseColumnProps = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
};

export const expenseDataTableColumns = (): ColumnDef<ExpenseColumnProps>[] => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dict = useTranslation();

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
    },
    {
      accessorKey: 'transaction_date',
      header: dict.page.expenseDataTableColumns.date, // Translate this header
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
      header: dict.page.expenseDataTableColumns.description, // Translate this header
      cell: ({ row }) => (
        <span className="text-[#00104B]">{row.getValue('description')}</span>
      ),
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.page.expenseDataTableColumns.category}{' '}
          {/* Translate this header */}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('category'))}</span>
      ),
    },
    {
      accessorKey: 'expense_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.page.expenseDataTableColumns.type} {/* Translate this header */}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <span>{transformToUppercase(row.getValue('expense_type'))}</span>
      ),
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {dict.page.expenseDataTableColumns.amount}{' '}
          {/* Translate this header */}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount_to_render = row.getValue('amount') as number;
        return (
          <span className="text-[#00104B]">
            <NumericFormat
              value={amount_to_render}
              displayType="text"
              thousandSeparator={true}
              prefix="NOK "
            />
          </span>
        );
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <ExpenseDetailsModal payload={row.original} />
          <ExpenseUpdateModal payload={row.original} />
          <SharedDeleteActionCell
            itemOrigin="expense"
            itemId={row.original._id as string}
          />
        </div>
      ),
    },
  ];
};
