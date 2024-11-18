import Image, { StaticImageData } from 'next/image';
import React from 'react';
import { NumericFormat } from 'react-number-format';

export type ExpenseProps = {
  imageSrc: string | StaticImageData;
  amount: number;
  type: string;
  quantity: number;
};

const ExpenseType: React.FC<ExpenseProps> = ({
  imageSrc,
  amount,
  type,
  quantity,
}) => {
  return (
    <div className="bg-white rounded-xl flex items-center  py-5">
      <Image src={imageSrc} alt={`${type} image`} width={40} height={40} />
      <div className=" ">
        <h3 className="text-sm font-semibold">
          <NumericFormat
            value={amount}
            displayType="text"
            thousandSeparator={true}
            prefix="NOK "
          />{' '}
        </h3>
        <p className="text-xs font-normal text-gray-700">
          {type}({quantity})
        </p>
      </div>
    </div>
  );
};

export default ExpenseType;
