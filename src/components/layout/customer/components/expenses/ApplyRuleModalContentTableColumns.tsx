/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import SharedTooltip from '@/components/SharedTooltip';
import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';

export type ExpenseColumnProps = { [x: string]: any; [x: number]: any };

export const ApplyRuleModalContentTableColumns = (
  onDelete: (id: string) => void
): ColumnDef<ExpenseColumnProps>[] => [
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

    header: 'Category',
    cell: ({ row }) => {
      return <span className="text-[#00104B]">{row.getValue('category')}</span>;
    },
  },
  {
    accessorKey: 'expense_type',
    header: 'Type',
    cell: ({ row }) => {
      return (
        <span className="text-[#00104B]">{row.getValue('expense_type')}</span>
      );
    },
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
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
      <div className="flex items-center space-x-2">
        <SharedTooltip
          align="end"
          visibleContent={
            <Button
              className="h-6 w-16 text-red-500 bg-white shadow-none border-none hover:bg-white  "
              onClick={() => onDelete(row.original._id as string)}
            >
              Remove
            </Button>
          }
        >
          <div className="w-36">
            Don&apos;t worry! you can still find this item on reapply
          </div>
        </SharedTooltip>
      </div>
    ),
  },
];
