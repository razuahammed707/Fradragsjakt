'use client';

import React, { useEffect, useState } from 'react';
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
import { ChevronRight } from 'lucide-react';
import CategoryIcons, { categories } from './CategoryIcons';

const ExpenseTopSection = () => {
  const { translate } = useTranslation();
  const [expenseStats, setExpenseStats] = useState({
    personal: 0,
    business: 0,
  });

  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
      filterString: '',
    });

  useEffect(() => {
    if (!expenses?.data) return;

    const { expenseTypeWiseExpenses } = expenses.data;

    if (expenseTypeWiseExpenses) {
      const personal = expenseTypeWiseExpenses.find(
        (exp: { expense_type: string }) => exp.expense_type === 'personal'
      );
      const business = expenseTypeWiseExpenses.find(
        (exp: { expense_type: string }) => exp.expense_type === 'business'
      );

      setExpenseStats({
        personal: personal?.amount ?? 0,
        business: business?.amount ?? 0,
      });
    }
  }, [expenses?.data]);

  return (
    <Sheet>
      <SheetTrigger asChild className="overflow-hidden w-full">
        <div className="cursor-pointer bg-white p-3 rounded-lg">
          <ExpenseStatsByType
            type={translate('page.expensetopsection.business')}
            amount={Number(expenseStats?.business?.toFixed(2))}
          />
          <CategoryIcons />
        </div>
      </SheetTrigger>
      <SheetContent
        noOverlay
        side="right"
        className="w-[500px] border sm:w-[540px]"
      >
        <SheetHeader>
          <SheetTitle>Deductions by category (2025)</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-gray-100 rounded-full">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span>{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">
                      {category.value} transactions
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              );
            })}
          </div>

          <button className="w-full text-primary hover:text-primary/90">
            See impact on net tax bill
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ExpenseTopSection;
