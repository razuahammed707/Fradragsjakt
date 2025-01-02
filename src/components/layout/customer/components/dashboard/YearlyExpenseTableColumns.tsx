'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import formatDate from '@/utils/helpers/formatDate';

export type Expense = {
  _id: string;
  id: string;
  transaction_date?: string;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: string;
  amount: number;
};

export const YearlyExpenseTableColumns = (): ColumnDef<Expense>[] => {
  return [
    {
      accessorKey: 'transaction_date',
      header: 'Date',
      cell: ({ row }) => {
        const transactionDate = row.getValue('transaction_date') as string;
        const createdAt = row.original.createdAt;
        const dateToRender = transactionDate || createdAt || '';
        return (
          <div className="w-[90px]">
            <span className="text-[#00104B]">{formatDate(dateToRender)}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'description',
      header: 'Expense description',
      cell: ({ row }) => (
        <div className="w-[220px]">{row.getValue('description')}</div>
      ), // Center aligned
      size: 100, // Adjust column size
      minSize: 100,
      maxSize: 150,
    },
    {
      accessorKey: 'expense_type',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Expense type
          <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="pl-4">{row.getValue('expense_type')}</div>
      ), // Center aligned
    },
    {
      accessorKey: 'category',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
        </Button>
      ),
      cell: ({ row }) => <div className="pl-4">{row.getValue('category')}</div>, // Center aligned
    },
    {
      accessorKey: 'amount',
      header: () => <div className="text-left">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue('amount'));
        const formatToNOK = (amount: number) => {
          const formatted = new Intl.NumberFormat('nb-NO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          }).format(amount);

          return `NOK ${formatted}`;
        };

        return (
          <div className="text-left font-medium w-[120px]">
            {formatToNOK(amount)}
          </div>
        ); // Center aligned
      },
    },
  ];
};
