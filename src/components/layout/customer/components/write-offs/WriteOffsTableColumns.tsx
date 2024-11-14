'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    header: 'Amount',
    cell: ({ row }) => (
      <div className="text-left">{row.getValue('totalItemByCategory')}</div>
    ),
  },
  // {
  //   accessorKey: 'type',
  //   header: ({ column }) => (
  //     <Button
  //       variant="ghost"
  //       className="pl-0"
  //       onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
  //     >
  //       Type
  //       <Image src={ArrowUpDown} alt="arrow icon" className="ml-2" />
  //     </Button>
  //   ),
  //   cell: ({ row }) => {
  //     const defaultType = (row.getValue('type') as string) || 'Deductible';
  //     return (
  //       <Select
  //         defaultValue={defaultType}
  //         onValueChange={(value) => console.log('Updated type:', value)}
  //       >
  //         <SelectTrigger className="w-[120px]">
  //           <SelectValue />
  //         </SelectTrigger>
  //         <SelectContent>
  //           <SelectItem value="Deductible">Deductible</SelectItem>
  //           <SelectItem value="Non-Deductible">Non-Deductible</SelectItem>
  //         </SelectContent>
  //       </Select>
  //     );
  //   },
  // },
  {
    accessorKey: 'amount',
    header: 'Deduction',
    cell: ({ row }) => (
      <Input
        type="text"
        defaultValue={`NOK ${(Number(row.getValue('amount')) || 0).toFixed(2)}`}
        className="w-[130px]"
        onChange={(e) => console.log('Updated deduction:', e.target.value)}
      />
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
