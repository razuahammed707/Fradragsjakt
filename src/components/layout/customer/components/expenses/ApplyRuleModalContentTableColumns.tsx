'use client';

import { ColumnDef } from '@tanstack/react-table';
import { NumericFormat } from 'react-number-format';

export type ExpenseColumnProps = {
  description: string;
  category: string;
  type: string;
  amount: number;
};

export const ApplyRuleModalContentTableColumns: ColumnDef<ExpenseColumnProps>[] =
  [
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
        return (
          <span className="text-[#00104B]">{row.getValue('category')}</span>
        );
      },
    },
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => {
        return <span className="text-[#00104B]">{row.getValue('type')}</span>;
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
  ];
