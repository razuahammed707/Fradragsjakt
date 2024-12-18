import { SharedDataTable } from '@/components/SharedDataTable';
import React from 'react';
import { CustomersDataTableColumns } from './CustomersDataTableColumns';
import UpdateAuditorModal from './UpdateAuditorModal';

const CustomersTable = () => {
  const customers = Array.from({ length: 10 }, (_, i) => ({
    serialNo: i + 1,
    customer_email: `customer${i + 1}@example.com`,
    first_name: `FirstName${i + 1}`,
    last_name: `LastName${i + 1}`,
    _id: `id_${i + 1}`,
  }));

  return (
    <div className=" ">
      <SharedDataTable
        className=" "
        columns={CustomersDataTableColumns()}
        data={customers}
      />
      <UpdateAuditorModal />
    </div>
  );
};

export default CustomersTable;