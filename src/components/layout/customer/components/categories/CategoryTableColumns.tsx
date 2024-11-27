'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import { EnumValues } from 'zod';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import CategoryAddModal from './CategoryAddModal';
import { useTranslation } from '@/lib/TranslationProvider';

export type Category = {
  _id: string;
  tile: string;
  created_by: EnumValues;
};

export const CategoryTableColumns = (): ColumnDef<Category>[] => {
  const { translate } = useTranslation();
  return [
    {
      header: translate(
        'page.CategoryDataTableColumns.serial_no',
        'Serial No.'
      ),
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
      header: translate(
        'page.CategoryDataTableColumns.created_by',
        'Created By'
      ),
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
          <CategoryAddModal origin="category table" category={row?.original} />
          <SharedDeleteActionCell
            itemId={row.original._id as string}
            itemOrigin="category"
          />
        </div>
      ),
    },
  ];
};
