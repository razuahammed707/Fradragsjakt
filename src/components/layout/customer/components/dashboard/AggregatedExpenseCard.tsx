'use client';
import { Badge } from '@/components/ui/badge';
import { FC, useEffect } from 'react';
//import ArrowDown from '../../../../../../public/images/dashboard/arrow_down.svg';
import ArrowUp from '../../../../../../public/images/dashboard/arrow_up.svg';
import Image from 'next/image';
import SharedTooltip from '@/components/SharedTooltip';
import { Separator } from '@/components/ui/separator';
import { numberFormatter } from '@/utils/helpers/numberFormatter';
import { cn } from '@/lib/utils';
import { savingExpenseCalculator } from '@/utils/helpers/savingExpenseCalculator';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { questionnaireSelector } from '@/redux/slices/questionnaire';
import { trpc } from '@/utils/trpc';
import {
  updateBusinesSavings,
  updatePersonalSavings,
} from '@/redux/slices/writeoffs';

interface caregoryItem {
  title: string;
  predefinedCategories: {
    name: string;
    amount: number;
    threshold?: number;
  }[];
  total_amount: number;
  total_original_amount: number;
}

interface AggregatedExpenseCardProps {
  title?: string;
  items?: caregoryItem[];
  origin?: string;
}

const AggregatedExpenseCard: FC<AggregatedExpenseCardProps> = ({
  title,
  items,
  origin = 'business',
}) => {
  const dispatch = useAppDispatch();
  const { questionnaires } = useAppSelector(questionnaireSelector);
  const { data: user } = trpc.users.getUserByEmail.useQuery();
  const {
    workAndEducationExpenseAmount,
    healthAndFamilyExpenseAmount,
    bankAndLoansExpenseAmount,
    hobbyOddjobsAndExtraIncomesExpenseAmount,
    housingAndPropertyExpenseAmount,
    giftsOrDonationsExpenseAmount,
    foreignIncomeExpenseAmount,
  } = savingExpenseCalculator(questionnaires, user?.questionnaires);

  const personalData = [
    {
      title: 'Health and Family',
      total_amount: healthAndFamilyExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Bank and Loans',
      total_amount: bankAndLoansExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Work and Education',
      total_amount: workAndEducationExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Housing and Property',
      total_amount: housingAndPropertyExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Gifts/Donations',
      total_amount: giftsOrDonationsExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Hobby, Odd jobs, and Extra incomes',
      total_amount: hobbyOddjobsAndExtraIncomesExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
    {
      title: 'Foreign Income',
      total_amount: foreignIncomeExpenseAmount || 0,
      total_original_amount: 0,
      predefinedCategories: [],
    },
  ];
  const largestItem = (items ? items : personalData)?.reduce((prev, current) =>
    current.total_amount > prev.total_amount ? current : prev
  );
  const total = (items ? items : personalData)?.reduce(
    (sum, current) => sum + current.total_amount,
    0
  );

  useEffect(() => {
    if (origin === 'business') {
      dispatch(updateBusinesSavings(total));
    }
    dispatch(updatePersonalSavings(total));
  }, [origin, total, dispatch]);

  return (
    <div className="bg-white rounded-xl p-6 space-y-6 w-full">
      <div className="flex justify-between ">
        <div>
          <h2 className="text-[13px] font-semibold text-[#627A97]">{title}</h2>
          <p className="text-2xl font-bold text-[#00104B]">
            NOK {numberFormatter(total)}
          </p>
        </div>
        <Badge className="bg-[#F0EFFE] px-1 h-6  hover:text-white rounded-[5px] text-xs text-[#627A97] font-medium">
          View details
        </Badge>
      </div>

      <div className="grid grid-cols-12 gap-4 ">
        <div className="col-span-4 bg-[#F6F6F6] rounded-2xl p-4">
          <div className="flex h-full flex-col space-y-4 justify-end ">
            <Image
              src={ArrowUp}
              alt="arrow_icon"
              height={25}
              width={25}
              className=""
            />

            <div className="">
              <p className="text-sm font-semibold text-[#71717A]">
                {largestItem?.title}
              </p>
              <p
                className={cn(
                  'text-lg font-bold mt-2 text-[#00104B]',
                  largestItem?.total_amount >= 0 && 'text-[#00104B]'
                )}
              >
                NOK {largestItem?.total_amount?.toFixed(2)}{' '}
              </p>
            </div>
          </div>
        </div>

        <div className="col-span-8 space-y-2  h-[175px] overflow-y-auto pr-4  ">
          {(items ? items : personalData)?.map(
            ({ title, total_amount, predefinedCategories }, index) =>
              origin === 'business' ? (
                <SharedTooltip
                  align="end"
                  key={index}
                  visibleContent={
                    <div className="flex items-center space-x-2 hover:bg-[#F6F6F6] p-2 rounded-lg">
                      <div>
                        <p className="text-xs font-semibold text-[#71717A]">
                          {title}
                        </p>
                        <p
                          className={cn(
                            'text-sm font-bold text-[#00104B]',
                            total_amount >= 0 && 'text-[#00104B]'
                          )}
                        >
                          NOK {total_amount.toFixed(2)}{' '}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div className="space-y-2 w-[200px] py-1">
                    <h6 className="text-xs font-semibold text-[#627A97]">
                      {title}
                    </h6>
                    <Separator />
                    {predefinedCategories?.map(({ name, amount }, i) => (
                      <div key={i} className="w-full space-y-1 mt-2">
                        <p className="text-xs font-semibold text-[#71717A]">
                          {name}
                        </p>
                        <div className="flex justify-between ">
                          <p className="text-xs font-bold text-[#00104B]">
                            NOK {amount?.toFixed(2)}
                          </p>

                          {[
                            'Furniture and Equipment',
                            'Computer Hardware',
                          ].includes(name) && (
                            <p
                              className={`text-[10px] font-medium text-[#71717A]`}
                            >
                              NOK 15000
                            </p>
                          )}
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
                      {title}
                    </p>
                    <p
                      className={cn(
                        'text-sm font-bold text-[#00104B]',
                        largestItem?.total_amount >= 0 && 'text-[#00104B]'
                      )}
                    >
                      NOK {total_amount?.toFixed(2)}{' '}
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
