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
    <div className="bg-white h-full rounded-lg">
      <h1 className="text-lg font-semibold">{type}</h1>
      <h1 className="text-6xl font-bold my-4">
        kr{' '}
        <span className="tabular-nums">
          <Odometer
            value={formattedValue}
            format="( ddd),dd"
            duration={500}
            theme="minimal"
          />
        </span>
      </h1>
    </div>
  );
};

export default ExpenseStatsByType;
