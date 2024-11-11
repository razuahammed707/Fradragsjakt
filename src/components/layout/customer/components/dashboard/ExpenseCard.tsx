import { Card, CardTitle } from '@/components/ui/card';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import Image from 'next/image';
import React from 'react';

export const expenses = [
  { title: 'Personal Spending (non deductable)', amount: 10250 },
  { title: 'Travel & Meals', amount: 10250 },
  { title: 'Office Expenses', amount: 10250 },
  { title: 'Car Expenses', amount: 2050 },
  { title: 'Taxes/Licenses', amount: 6150 },
  { title: 'Legal/Professional Services', amount: 4100 },
];

interface ExpenseCardProps {
  index: number;
  expense: {
    title: string;
    amount: number;
  };
}
const ExpenseCard = ({ expense, index }: ExpenseCardProps) => {
  return (
    <Card className="p-6 flex items-center justify-between border border-[#EEF0F4] shadow-none rounded-2xl">
      <div className="space-y-1">
        <CardTitle className="text-sm text-[#71717A] font-semibold">
          {expense?.title}
        </CardTitle>
        <p className="text-[20px] text-[#00104B] font-bold">
          NOK {numberFormatter(expense?.amount)}{' '}
          <span className="text-xs text-[#00B386] text-bold">+55%</span>
        </p>
      </div>
      <Image
        src={`/images/dashboard/expense-card/icon${index + 1}.svg`}
        alt={`icon${index + 1}`}
        height={51}
        width={52}
      />
    </Card>
  );
};

export default ExpenseCard;
