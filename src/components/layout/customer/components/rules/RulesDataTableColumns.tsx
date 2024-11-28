'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import ArrowUpDown from '../../../../../../public/sort.png';
import Image from 'next/image';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import { IRule } from '@/server/db/interfaces/rules';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';
import CreateRuleModal from './CreateRuleModal';
import { useTranslation } from '@/lib/TranslationProvider';

export const RulesDataTableColumns = (): ColumnDef<IRule>[] => {
  const { translate } = useTranslation();

  return [
    {
      accessorKey: 'serialNo',
      header: translate('page.rulesTableColumn.serial_no'),
      cell: ({ row }) => (
        <div className="text-left pl-4">{`${row.index + 1}.`}</div> // Use row.index for serial number
      ),
    },
    {
      accessorKey: 'description_contains',
      header: translate('page.rulesTableColumn.description_contains'),
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
            {translate('page.rulesTableColumn.expense_type')}
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
            {translate('page.rulesTableColumn.category')}
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
      cell: ({ row }) => (
        <div className="flex items-center">
          <CreateRuleModal
            origin="rule update"
            updateRulePayload={row?.original}
          />
          <SharedDeleteActionCell
            itemId={row.original._id as string}
            itemOrigin="rule"
          />
        </div>
      ),
    },
  ];
};
