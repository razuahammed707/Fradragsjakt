'use client';

import React, { useEffect, useState } from 'react';
import useIsStatementsPopulated from '@/hooks/use-is-populated-statements';
import UploadingStatementsWarning from '../dashboard/UploadingStatementsWarning';
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

const ExpenseTopSection = () => {
  const { isStatementsPopulated, isLoading } = useIsStatementsPopulated();
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

  if (!isStatementsPopulated && !isLoading) {
    return <UploadingStatementsWarning />;
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Sheet>
        <SheetTrigger asChild className="border">
          <div className="cursor-pointer">
            <ExpenseStatsByType
              type={translate('page.expensetopsection.business')}
              amount={Number(expenseStats?.business?.toFixed(2))}
              filterString=""
            />
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
          <div className="mt-6">
            <p className="text-sm text-muted-foreground">
              If you earned freelance / 1099 income in 2025, marking business
              expenses as deductions reduces your taxable income.
            </p>
            <button className="w-full mt-4 text-primary hover:text-primary/90">
              See impact on total tax refund
            </button>
          </div>
        </SheetContent>
      </Sheet>
      <ExpenseStatsByType
        type={translate('page.expensetopsection.personal')}
        amount={Number(expenseStats?.personal?.toFixed(2))}
        filterString=""
      />
    </div>
  );
};

export default ExpenseTopSection;
