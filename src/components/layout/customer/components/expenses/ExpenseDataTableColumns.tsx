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
import { Checkbox } from '@/components/ui/checkbox';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ExpenseColumnProps = {
  id: string;
  date: string;
  description: string;
  category: string;
  expenseType: string;
  amount: number;
};

export const expenseDataTableColumns: ColumnDef<ExpenseColumnProps>[] = [
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
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => {
      return (
        <span className="text-[#00104B]">{row.getValue('createdAt')}</span>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ row }) => {
      return (
        <span className="text-[#00104B]">{row.getValue('description')}</span>
      );
    },
  },
  {
    accessorKey: 'category',

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Category
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const defaultType = row.getValue('category') as string;
      return (
        <Select
          defaultValue={defaultType}
          onValueChange={(value) => console.log('Updated type:', value)}
        >
          <SelectTrigger className="w-[162px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[
              'Transport',
              'Meals',
              'Travel',
              'unknown',
              'Transaction',
              'withdraw',
            ].map((_, i) => (
              <SelectItem key={i} value={_}>
                {_}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'expense_type',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Type
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const defaultType = row.getValue('expense_type') as string;
      return (
        <Select
          defaultValue={defaultType}
          onValueChange={(value) => console.log('Updated type:', value)}
        >
          <SelectTrigger className="w-[162px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['unknown', 'personal', 'business'].map((type, i) => (
              <SelectItem key={i} value={type}>
                {transformToUppercase(type)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="pl-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Amount
          {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const payment = row.original;

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
              onClick={() => navigator.clipboard.writeText(payment.id)}
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
