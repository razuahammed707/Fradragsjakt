'use client';

import React from 'react';
import ExpenseStatsByType from './ExpenseStatsByType';
import { trpc } from '@/utils/trpc';
import { useTranslation } from '@/lib/TranslationProvider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import CategoryIcons from './CategoryIcons';

import { getCategoryIcon } from '@/utils/helpers/getCategoryIcon';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExpenseTopSection = () => {
  const { translate } = useTranslation();
  const { data: writeOffs } = trpc.expenses.getWriteOffs.useQuery({});
  console.log({ writeOffs });

  return (
    <Sheet>
      <SheetTrigger asChild className="overflow-hidden w-full">
        <div className="cursor-pointer bg-white p-3 rounded-lg">
          <ExpenseStatsByType
            type={translate('page.expensetopsection.business')}
            amount={Number(writeOffs?.data?.totalWriteOff?.toFixed(2) ?? 0)}
          />
          <CategoryIcons
            writeOffSummary={writeOffs?.data?.writeOffSummary || []}
          />
        </div>
      </SheetTrigger>
      <SheetContent
        noOverlay
        side="right"
        className="max-w-[450px] border sm:max-w-[500px]"
      >
        <SheetHeader>
          <SheetTitle>Deductions by category (2024)</SheetTitle>{' '}
          {/* Year updated */}
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            {writeOffs?.data?.writeOffSummary?.map(
              (
                {
                  category,
                  totalItemByCategory,
                  writeOffAmount,
                }: {
                  category: string;
                  totalItemByCategory: number;
                  writeOffAmount: number;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-md cursor-pointer border border-black/25"
                  >
                    <div className="flex items-center gap-3">
                      <div className="">
                        {React.createElement(getCategoryIcon(category), {
                          size: 16,
                        })}{' '}
                      </div>
                      <span className="">{category}</span>{' '}
                    </div>
                    <div className="flex items-center gap-2">
                      {`kr${writeOffAmount} (${totalItemByCategory}
                        ${totalItemByCategory === 1 ? 'transaction' : 'transactions'}
                        )`}

                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </div>
                );
              }
            )}
          </div>

          <Button className="w-full bg-transparent shadow-none border border-[#5B52F9] py-6 hover:text-white text-primary">
            See impact on total tax refund
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExpenseTopSection;
