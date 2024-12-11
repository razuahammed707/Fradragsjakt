import React from 'react';
import IncomeStats from './IncomeStats';
import { NumericFormat } from 'react-number-format';

type IncomeStatsProps = {
  type: string;

  amount: number;
  filterString?: string;
};

const IncomeStatsByType: React.FC<IncomeStatsProps> = ({
  amount,
  type,

  filterString,
}) => {
  return (
    <div className="bg-white rounded-xl px-4 pt-4 relative">
      <h1 className="text-xl font-semibold">{type} Income</h1>

      <div className="flex justify-between items-center mt-7">
        <h1 className="text-xl font-bold mt-6 absolute left-4 bottom-5">
          <NumericFormat
            value={amount}
            displayType="text"
            thousandSeparator={true}
            prefix="NOK "
          />
        </h1>
        <IncomeStats title={type} filterString={filterString} />
      </div>
    </div>
  );
};

export default IncomeStatsByType;