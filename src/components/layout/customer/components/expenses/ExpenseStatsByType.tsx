import React from 'react';
import ExpenseStats from './ExpenseStats';

type ExpenseStatsProps = {
  type: string;
  percentage: number;
  month: string;
  amount: string;
};

const ExpenseStatsByType: React.FC<ExpenseStatsProps> = ({
  amount,
  type,
  percentage,
  month,
}) => {
  return (
    <div className="bg-white rounded-xl px-4 pt-4">
      <h1 className="text-xl font-semibold">{type} Expense</h1>
      <h2 className="text-sm text-gray-600 font-light mb-0">
        <strong className="text-[#00B386] font-semibold">+{percentage}%</strong>{' '}
        in {month}
      </h2>
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">${amount}</h1>
        <ExpenseStats title={type} />
      </div>
    </div>
  );
};

export default ExpenseStatsByType;
