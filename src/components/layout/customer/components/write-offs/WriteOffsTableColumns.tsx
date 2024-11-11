'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';

export type WriteOffs = {
  id: string;
  category: string;
  amount: number;
  expenseType: 'Deductible'; // Keeping this as per the data
  deduction: number;
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
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => (
      <div className="text-left">{row.getValue('amount')}</div>
    ),
  },
  {
    accessorKey: 'type',
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="pl-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Type
        <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const defaultType = (row.getValue('type') as string) || 'Deductible';
      return (
        <Select
          defaultValue={defaultType}
          onValueChange={(value) => console.log('Updated type:', value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Deductible">Deductible</SelectItem>
            <SelectItem value="Non-Deductible">Non-Deductible</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: 'deduction',
    header: 'Deduction',
    cell: ({ row }) => (
      <Input
        type="text"
        defaultValue={`NOK ${(Number(row.getValue('deduction')) || 0).toFixed(2)}`}
        className="w-[110px]"
        onChange={(e) => console.log('Updated deduction:', e.target.value)}
      />
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const writeOff = row.original;

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => console.log('Delete write-off:', writeOff.id)}
          >
            <Trash2 className="h-4 w-4 text-[#5B52F9]" />
          </Button>
        </div>
      );
    },
  },
];
