import React from 'react';
import { formatNumberWithTwoDecimals } from '@/utils/helpers/formatNumberWithTwoDecimals';
import Odometer from 'react-odometerjs';
import 'odometer/themes/odometer-theme-minimal.css';

type ExpenseStatsProps = {
  type: string;
  percentage?: number;
  month?: string;
  amount: number;
};

const ExpenseStatsByType: React.FC<ExpenseStatsProps> = ({ amount, type }) => {
  const formattedValue = Number(
    formatNumberWithTwoDecimals(amount).replace(/\s/g, '').replace(',', '.')
  );

  return (
    <div className="bg-white h-full rounded-lg group relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{type}</h1>
          <span className="text-xs text-gray-500 group-hover:text-primary transition-colors duration-200">
            Click to expand
          </span>
        </div>
      </div>
      <h1 className="text-6xl font-bold my-4 group-hover:scale-[1.02] transition-transform duration-200">
        kr{' '}
        <span className="">
          <Odometer
            value={formattedValue}
            format="( ddd),dd"
            duration={500}
            theme=""
          />
        </span>
      </h1>
    </div>
  );
};

export default ExpenseStatsByType;
