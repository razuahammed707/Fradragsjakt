/* eslint-disable @typescript-eslint/no-explicit-any */
import { ColumnDef } from '@tanstack/react-table';
import SharedDeleteActionCell from '@/components/SharedDeleteActionCell';

export const AuditorsDataTableColumns = (): ColumnDef<any>[] => {
  return [
    {
      accessorKey: 'serialNo',
      header: 'Serial',
      cell: ({ row }) => <div className="text-left pl-4">{row.index + 1}.</div>,
    },
    {
      accessorKey: 'auditor_email',
      header: 'Auditor Email',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('auditor_email')}</div>
      ),
    },
    {
      accessorKey: 'first_name',
      header: 'First Name',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('first_name')}</div>
      ),
    },
    {
      accessorKey: 'last_name',
      header: 'Last Name',
      cell: ({ row }) => (
        <div className="text-left">{row.getValue('last_name')}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex gap-2 items-center">
          <SharedDeleteActionCell
            itemId={row.original._id as string}
            itemOrigin="auditor"
          />
        </div>
      ),
    },
  ];
};
