import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { AuditorsDataTableColumns } from './AuditorsDataTableColumns';

const AuditorsTable = () => {
  const auditors = Array.from({ length: 10 }, (_, i) => ({
    serialNo: i + 1,
    auditor_email: `auditor${i + 1}@example.com`,
    first_name: `FirstName${i + 1}`,
    last_name: `LastName${i + 1}`,
    _id: `id_${i + 1}`,
  }));

  return (
    <div className=" ">
      <SharedDataTable
        className="min-h-[500px]"
        columns={AuditorsDataTableColumns()}
        data={auditors}
      />
    </div>
  );
};

export default AuditorsTable;
