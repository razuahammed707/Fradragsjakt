import Image, { StaticImageData } from 'next/image';
import React from 'react';

export type ExpenseProps = {
  key: number;
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
  key,
}) => {
  return (
    <div
      className="bg-white rounded-xl p-2 flex justify-center items-center py-5"
      key={key}
    >
      <Image src={imageSrc} alt={`${type} image`} width={40} height={40} />
      <div className="ml-4">
        <h3 className="text-lg font-bold">NOK {amount}</h3>
        <p className="text-xs font-normal text-gray-700">
          {type}({quantity})
        </p>
      </div>
    </div>
  );
};

export default ExpenseType;
