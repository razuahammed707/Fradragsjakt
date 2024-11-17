'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import { IRule } from '@/server/db/interfaces/rules';
import SharedModal from '@/components/SharedModal';
import DeleteConfirmationContent from '@/components/DeleteConfirmationContent';
import { useState } from 'react';

const DeleteActionCell = ({ ruleId }: { ruleId: string }) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  const handleDelete = () => {
    setModalOpen(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        className="h-8 w-8 p-0"
        onClick={() => console.log('Delete transaction:', ruleId)}
      >
        <Trash2 className="h-4 w-4 text-[#5B52F9]" onClick={handleDelete} />
        <div className="bg-white z-50">
          <SharedModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            customClassName="max-w-[500px]"
          >
            <DeleteConfirmationContent
              ruleId={ruleId}
              setModalOpen={setModalOpen}
            />
          </SharedModal>
        </div>
      </Button>
    </div>
  );
};

export const RulesDataTableColumns: ColumnDef<IRule>[] = [
  {
    accessorKey: 'serialNo',
    header: 'Serial no.',
    cell: ({ row }) => (
      <div className="text-left pl-4">{`${row.index + 1}.`}</div> // Use row.index for serial number
    ),
  },
  {
    accessorKey: 'description_contains',
    header: 'Description Contains',
    cell: ({ row }) => (
      <div className="text-left">{row.getValue('description_contains')}</div>
    ),
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
          Expense Type
          <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <div className="text-left">
          {transformToUppercase(row.getValue('expense_type'))}
        </div>
      );
    },
  },
  {
    accessorKey: 'category_title',
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
    cell: ({ row }) => (
      <div className="text-left">
        {transformToUppercase(row.getValue('category_title'))}
      </div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DeleteActionCell ruleId={row.original._id as string} />,
  },
];
