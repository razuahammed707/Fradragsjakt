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
import { ChevronRight, InfoIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ExpenseTopSection = () => {
  const { translate } = useTranslation();
  const { data: writeOffs } = trpc.expenses.getWriteOffs.useQuery({});
  console.log({ writeOffs });

  return (
    <Sheet>
      <SheetTrigger asChild className="block w-full">
        <div
          role="button"
          aria-label="View deductions by category"
          className="cursor-pointer bg-white p-6 rounded-xl hover:bg-gradient-to-br hover:from-white hover:to-primary/5 
            transition-all duration-300 group border-2 border-gray-100 hover:border-primary/30
            relative overflow-hidden hover:-translate-y-0.5 transform-gpu"
        >
          <div className="absolute z-50 top-4 right-4 flex items-center gap-2">
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
              <span className="text-xs font-medium text-primary/80">
                Live data
              </span>
            </div>
            <InfoIcon
              size={18}
              className="text-gray-400 group-hover:text-primary transition-colors duration-200"
            />
          </div>

          <div className="relative">
            <div
              className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-16 bg-primary/10 rounded-r 
              group-hover:bg-primary/30 group-hover:h-20 transition-all duration-300"
            />
            <div className="relative z-10">
              {' '}
              {/* Added z-index to ensure number visibility */}
              <ExpenseStatsByType
                type={translate('page.expensetopsection.business')}
                amount={Number(writeOffs?.data?.totalWriteOff ?? 0)}
              />
            </div>
          </div>

          <div className="mt-6 relative">
            <div
              className="absolute -left-6 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary/5 rounded-r 
              group-hover:bg-primary/20 transition-all duration-300"
            />
            <CategoryIcons
              writeOffSummary={writeOffs?.data?.writeOffSummary || []}
            />
          </div>
        </div>
      </SheetTrigger>
      <SheetContent
        noOverlay
        side="right"
        className="max-w-[450px] border sm:max-w-[500px]"
      >
        <SheetHeader>
          <SheetTitle>Deductions by category (2024)</SheetTitle>{' '}
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
