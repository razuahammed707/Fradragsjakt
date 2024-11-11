'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ArrowUpDown from '../../../../../../public/sort.png';
import { Checkbox } from '@/components/ui/checkbox';
import Image from 'next/image';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Expense = {
  id: string;
  date: string;
  expense_description: string;
  expense_type: string;
  status: string;
  category: string; // Adjust based on possible categories
  amount: number;
};

export const YearlyExpenseTableColumns: ColumnDef<Expense>[] = [
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
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div className="text-left">{row.getValue('date')}</div>, // Align date to the left
  },
  {
    accessorKey: 'expense_description',
    header: 'Expense description',
    cell: ({ row }) => (
      <div className="pl-4">{row.getValue('expense_description')}</div>
    ), // Center aligned
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
    accessorKey: 'status',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Status
        <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
      </Button>
    ),
    cell: ({ row }) => <div className="pl-4">{row.getValue('status')}</div>, // Center aligned
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
    header: () => <div className="text-right">Amount</div>,
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
        <div className="text-right font-medium">{formatToNOK(amount)}</div>
      ); // Center aligned
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const expense = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(expense?.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
