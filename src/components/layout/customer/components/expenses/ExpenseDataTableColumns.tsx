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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type ExpenseColumnProps = {
  _id: string;
  id: string;
  transaction_date?: string | Date;
  createdAt?: string;
  description: string;
  category: string;
  expense_type: 'business' | 'personal' | 'unknown';
  amount: number;
  note?: string;
  percentage: string;
  receipt?: {
    link: string;
    mimeType: string;
  } | null;
};

export const ExpenseDataTableColumns = (
  onMerchantClick: (rowData: ExpenseColumnProps) => void,
  onStatusChange?: (rowId: string, newStatus: 'business' | 'personal') => void
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
      cell: ({ row }) => {
        const expenseType = row.getValue('expense_type');

        if (expenseType === 'unknown') {
          return (
            <Select
              onValueChange={(value) => {
                onStatusChange?.(
                  row.original._id,
                  value as 'business' | 'personal'
                );
              }}
            >
              <SelectTrigger className="w-[130px] h-8 px-2 py-0 text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="business" className="text-sm">
                  <div className="flex items-center">
                    <span className="mr-2 text-green-500">✓</span>
                    Deduction
                  </div>
                </SelectItem>
                <SelectItem value="personal" className="text-sm">
                  <div className="flex items-center">
                    <span className="mr-2">✕</span>
                    Not Deductible
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          );
        }

        return (
          <div
            onClick={() => onMerchantClick(row.original)}
            className="cursor-pointer flex items-center text-sm"
          >
            <span
              className={cn(
                'mr-2',
                expenseType === 'business' && 'text-green-500'
              )}
            >
              {expenseType === 'business' ? '✓' : '✕'}
            </span>
            {expenseType === 'business' ? 'Deduction' : 'Not Deductible'}
          </div>
        );
      },
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
            {`kr ${numberFormatter(amountToRender)}`}
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
