import React from 'react';
import { formatNumberWithTwoDecimals } from '@/utils/helpers/formatNumberWithTwoDecimals';

type ExpenseStatsProps = {
  type: string;
  percentage?: number;
  month?: string;
  amount: number;
};

const ExpenseStatsByType: React.FC<ExpenseStatsProps> = ({ amount, type }) => {
  return (
    <div className="bg-white h-full rounded-lg ">
      <h1 className="text-lg font-semibold">{type}</h1>
      <h1 className="text-6xl font-bold my-4 ">
        {`kr ${formatNumberWithTwoDecimals(amount)}`}
      </h1>
    </div>
  );
};

export default ExpenseStatsByType;
