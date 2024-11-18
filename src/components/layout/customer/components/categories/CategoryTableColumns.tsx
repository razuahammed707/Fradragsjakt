'use client';

import { ColumnDef } from '@tanstack/react-table';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import { EnumValues } from 'zod';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import { Edit2 } from 'lucide-react';

export type Category = {
  _id: string;
  tile: string;
  created_by: EnumValues;
};

export const CategoryTableColumns: ColumnDef<Category>[] = [
  {
    header: 'Serial no.',
    cell: ({ row }) => {
      const serial_no = row.index + 1;
      return <div className="text-left pl-4">{`${serial_no}.`}</div>;
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Category
        <Image src={ArrowUpDown} alt="sort icon" className="ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-left pl-4">{row.getValue('title')}</div>
    ),
  },
  {
    accessorKey: 'created_by',
    header: 'Created by',
    cell: ({ row }) => (
      <div className="text-left text-xs pl-4 font-medium text-[#00104B]">
        {row.getValue('created_by')}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <div className="flex space-x-0 items-center">
        <Edit2 className="h-4 w-4 text-[#5B52F9] cursor-pointer" />
        <SharedDeleteActionCell
          itemId={row.original._id as string}
          itemOrigin="category"
        />
      </div>
    ),
  },
];
