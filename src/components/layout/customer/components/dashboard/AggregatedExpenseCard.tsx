'use client';
import { Badge } from '@/components/ui/badge';
import { FC } from 'react';
import ArrowDown from '../../../../../../public/images/dashboard/arrow_down.svg';
import ArrowUp from '../../../../../../public/images/dashboard/arrow_up.svg';
import Image from 'next/image';
import SharedTooltip from '@/components/SharedTooltip';
import { Separator } from '@/components/ui/separator';

interface SpendingItem {
  category: string;
  amount: string;
  difference: string;
}

interface AggregatedExpenseCardProps {
  title: string;
  total: string;
  items: SpendingItem[];
  origin?: string;
}

const AggregatedExpenseCard: FC<AggregatedExpenseCardProps> = ({
  title,
  total,
  items,
  origin = 'business',
}) => {
  const largestItem = items.reduce((prev, current) =>
    parseFloat(current.amount.replace(/[^0-9.-]+/g, '')) >
    parseFloat(prev.amount.replace(/[^0-9.-]+/g, ''))
      ? current
      : prev
  );

  const otherItems = items.filter((item) => item !== largestItem);

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 w-full">
      <div className="flex justify-between ">
        <div>
          <h2 className="text-[13px] font-semibold text-[#627A97]">{title}</h2>
          <p className="text-2xl font-bold text-[#00104B]">{total}</p>
        </div>
        <Badge className="bg-[#F0EFFE] px-1 h-6  hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium">
          View details
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-4 bg-[#F6F6F6] rounded-2xl p-4">
          <div className="flex h-full flex-col space-y-4 justify-end ">
            <Image
              src={largestItem.difference.startsWith('+') ? ArrowUp : ArrowDown}
              alt="arrow_icon"
              height={20}
              width={20}
              className=""
            />

            <div className="">
              <p className="text-xs font-semibold text-[#71717A]">
                {largestItem.category}
              </p>
              <p className="text-sm font-bold mt-2 text-[#00104B]">
                {largestItem.amount}{' '}
              </p>
              <p
                className={`text-[10px] mt-[6px] font-medium  ${
                  largestItem.difference.startsWith('+')
                    ? 'text-[#5B52F9]'
                    : 'text-[#EC787A]'
                }`}
              >
                {' '}
                {largestItem.difference}
              </p>
            </div>
          </div>
        </div>
        <div className="col-span-8 space-y-2  h-[214px] overflow-y-auto pr-4">
          {otherItems.map((item, index) =>
            origin === 'business' ? (
              <SharedTooltip
                align="end"
                key={index}
                visibleContent={
                  <div className="flex items-center space-x-2 hover:bg-[#F6F6F6] p-2 rounded-lg">
                    {/* <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center `}
                  >
                    <Image
                      src={item.difference.startsWith('+') ? ArrowUp : ArrowDown}
                      alt="arrow_icon"
                      height={20}
                      width={20}
                      className=""
                    />
                  </div> */}
                    <div>
                      <p className="text-xs font-semibold text-[#71717A]">
                        {item.category}
                      </p>
                      <p className="text-sm font-bold text-[#00104B]">
                        {item.amount}{' '}
                        <span
                          className={`text-[10px] font-medium ms-2 ${
                            item.difference.startsWith('+')
                              ? 'text-[#5B52F9]'
                              : 'text-[#EC787A]'
                          }`}
                        >
                          {' '}
                          {item.difference}
                        </span>
                      </p>
                    </div>
                  </div>
                }
              >
                <div className="space-y-2 w-[150px] py-1">
                  <h6 className="text-xs font-semibold text-[#627A97]">
                    Main Category Name
                  </h6>
                  <Separator />
                  {[...Array(5)].map((el, i) => (
                    <div key={i} className="w-full">
                      <p className="text-[10px] font-semibold text-[#71717A]">
                        Category Name
                      </p>
                      <div className="flex justify-between ">
                        <p className="text-[10px] font-bold text-[#00104B]">
                          Amount{' '}
                        </p>

                        <p className={`text-[10px] font-medium text-[#71717A]`}>
                          {' '}
                          threshold
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </SharedTooltip>
            ) : (
              <div
                key={index}
                className="flex items-center space-x-2 hover:bg-[#F6F6F6] p-2 rounded-lg"
              >
                <div>
                  <p className="text-xs font-semibold text-[#71717A]">
                    {item.category}
                  </p>
                  <p className="text-sm font-bold text-[#00104B]">
                    {item.amount}{' '}
                    <span
                      className={`text-[10px] font-medium ms-2 ${
                        item.difference.startsWith('+')
                          ? 'text-[#5B52F9]'
                          : 'text-[#EC787A]'
                      }`}
                    >
                      {' '}
                      {item.difference}
                    </span>
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AggregatedExpenseCard;
