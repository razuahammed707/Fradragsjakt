import { numberFormatter } from '@/utils/helpers/numberFormatter';
import Image, { StaticImageData } from 'next/image';
import React from 'react';

export type IncomeProps = {
  imageSrc: string | StaticImageData;
  amount: number;
  type: string;
  quantity: number;
};

const IncomeType: React.FC<IncomeProps> = ({
  imageSrc,
  amount,
  type,
  quantity,
}) => {
  return (
    <div className="bg-white rounded-xl flex items-center py-5">
      <Image src={imageSrc} alt={`${type} image`} width={40} height={40} />
      <div>
        <h3 className="text-black text-s font-semibold">
          {'NOK '}
          {numberFormatter(amount)}
        </h3>
        <p className="text-[#71717A] text-xs font-semibold">
          {type} ({quantity})
        </p>
      </div>
    </div>
  );
};

export default IncomeType;
