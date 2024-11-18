'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  {
    id: 'actions',
    cell: () => {
      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            // onClick={() => console.log('Delete write-off:', writeOff.id)}
          >
            <Trash2 className="h-4 w-4 text-[#5B52F9]" />
          </Button>
        </div>
      );
    },
  },
];
