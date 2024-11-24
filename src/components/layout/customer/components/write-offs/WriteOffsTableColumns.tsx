'use client';

import { ColumnDef } from '@tanstack/react-table';

export type WriteOffs = {
  id: string;
  category: string;
  totalItemByCategory: number;
  amount: number;
};

export const WriteOffsTableColumns: ColumnDef<WriteOffs>[] = [
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => (
      <div className="text-left pl-4">{row.getValue('category')}</div>
    ),
  },
  {
    accessorKey: 'totalItemByCategory',
    header: 'Total Items',
    cell: ({ row }) => (
      <div className="text-left">{row.getValue('totalItemByCategory')}</div>
    ),
  },
  {
    accessorKey: 'amount',
    header: 'Deduction',
    cell: ({ row }) => (
      <div className="text-left">
        {`NOK ${(Number(row.getValue('amount')) || 0).toFixed(2)}`}
      </div>
    ),
  },
];
