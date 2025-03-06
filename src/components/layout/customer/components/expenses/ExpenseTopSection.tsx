'use client';

import React, { useEffect, useState } from 'react';
import Image, { StaticImageData } from 'next/image';
import ExpenseStatsByType from './ExpenseStatsByType';
import ExpenseType from './ExpenseType';
import PlusIcon from '../../../../../../public/images/expenses/plus.png';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import { expense_categories } from '@/utils/dummy';
import { useTranslation } from '@/lib/TranslationProvider';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

interface CategoryExpense {
  category: string;
  totalItemByCategory: number;
  amount: number;
}

interface ExpenseType {
  expense_type: string;
  totalItemByExpenseType: number;
  amount: number;
}

interface CategoryCard {
  id: number;
  imageSrc: StaticImageData;
  category: string;
  totalItemByCategory: number;
  amount: number;
}

type IFilterProps = {
  filterString: string;
};

const ExpenseTopSection = ({ filterString }: IFilterProps) => {
  const [categoryCards, setCategoryCards] =
    useState<CategoryCard[]>(expense_categories);
  const [expenseStats, setExpenseStats] = useState({
    personal: 0,
    business: 0,
  });

  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
      filterString,
    });
  const { data: user } = useSession();

  const { translate } = useTranslation();

  useEffect(() => {
    if (!expenses?.data) return;

    const { categoryWiseExpenses, expenseTypeWiseExpenses } = expenses.data;

    if (categoryWiseExpenses) {
      const updatedCategoryCards = expense_categories.map((card) => {
        const matchingExpense = categoryWiseExpenses.find(
          (expense: CategoryExpense) =>
            expense.category.toLowerCase() === card.category.toLowerCase()
        );

        return matchingExpense
          ? {
              ...card,
              totalItemByCategory: matchingExpense.totalItemByCategory,
              amount: matchingExpense.amount,
            }
          : card;
      });

      // Sort the cards by amount in descending order
      updatedCategoryCards.sort((a, b) => b.amount - a.amount);

      setCategoryCards(updatedCategoryCards);
    }

    if (expenseTypeWiseExpenses) {
      const personal = expenseTypeWiseExpenses.find(
        (exp: ExpenseType) => exp.expense_type === 'personal'
      );
      const business = expenseTypeWiseExpenses.find(
        (exp: ExpenseType) => exp.expense_type === 'business'
      );

      setExpenseStats({
        personal: personal?.amount ?? 0,
        business: business?.amount ?? 0,
      });
    }
  }, [expenses?.data]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <Sheet>
          <SheetTrigger asChild className="border">
            <div className="cursor-pointer">
              <ExpenseStatsByType
                type={translate('page.expensetopsection.business')}
                amount={Number(expenseStats?.business?.toFixed(2))}
                filterString={filterString}
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
          type={translate('page.expensetopsection.personal') as string}
          amount={Number(expenseStats?.personal?.toFixed(2))}
          filterString={filterString}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {categoryCards.slice(0, 7).map((expense, i) => (
          <ExpenseType
            key={i}
            imageSrc={expense.imageSrc}
            amount={expense.amount}
            type={expense.category}
            quantity={expense.totalItemByCategory}
          />
        ))}
        <Link
          href={`/${user?.user.role}/categories`}
          className="text-white flex items-center justify-center bg-[#5B52F9] p-4 rounded-xl font-bold cursor-pointer"
        >
          <Image src={PlusIcon} alt="Plus icon" className="mr-3" />
          {translate('page.expensetopsection.more')}
        </Link>
      </div>
    </div>
  );
};

export default ExpenseTopSection;
