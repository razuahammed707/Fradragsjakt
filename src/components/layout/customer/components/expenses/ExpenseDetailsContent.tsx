import React from 'react';
import { Label } from '@/components/ui/label';
import Placeholder from '../../../../../../public/receipt_placeholder.jpg';
import { PayloadType } from './ExpenseUpdateModal';
import Image from 'next/image';
import formatDate from '@/utils/helpers/formatDate';

function ExpenseDetailsContent({ payload }: { payload?: PayloadType }) {
  return (
    <div className="space-y-6">
      <h1 className="font-medium text-lg  text-black ">Expense Details</h1>

      <div className="grid grid-cols-2">
        <div className="space-y-4 text-black text-xs font-medium">
          <p>Date</p>
          <p>Description</p>
          <p>Amount (NOK)</p>
          <p>Expense Type</p>
          <p>Category</p>
        </div>
        <div className="space-y-4 text-[#71717A] text-xs">
          <p>
            {formatDate(payload?.transaction_date || payload?.createdAt || '')}
          </p>
          <p className="text-nowrap truncate">{payload?.description}</p>
          <p>NOK {payload?.amount}</p>
          <p>{payload?.expense_type}</p>
          <p>{payload?.category}</p>
        </div>
      </div>
      <div>
        <Label className="text-xs font-medium text-black">
          Your attached file
        </Label>
        <Image
          alt="receipt"
          src={payload?.receipt?.link || Placeholder}
          width={560}
          height={221}
          className="mt-2 border rounded-lg shadow-md w-full h-[221px]"
        />
      </div>
    </div>
  );
}

export default ExpenseDetailsContent;
