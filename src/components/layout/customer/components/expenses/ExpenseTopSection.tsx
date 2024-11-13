'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import ExpenseStatsByType from './ExpenseStatsByType';
import ExpenseType from './ExpenseType';
import PlusIcon from '../../../../../../public/images/expenses/plus.png';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';
import CatPlaceholder from '../../../../../../public/images/expenses/cat_place.svg';

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

function ExpenseTopSection() {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery();
  console.log('expenses_', expenses?.data);

  const { data: user } = useSession();

  const [categoryExpenses, setCategoryExpenses] = useState<CategoryExpense[]>(
    []
  );

  // State for personal expenses
  const [personalExpenses, setPersonalExpenses] = useState<number>(0);

  // State for business expenses
  const [businessExpenses, setBusinessExpenses] = useState<number>(0);

  useEffect(() => {
    if (expenses?.data?.categoryWiseExpenses) {
      setCategoryExpenses(expenses?.data?.categoryWiseExpenses);
    }

    if (expenses?.data?.expenseTypeWiseExpenses) {
      // Find and set personal expenses
      const personal = expenses?.data?.expenseTypeWiseExpenses.find(
        (exp: ExpenseType) => exp.expense_type === 'personal'
      );
      setPersonalExpenses(personal?.amount ?? 0);

      // Find and set business expenses
      const business = expenses?.data?.expenseTypeWiseExpenses.find(
        (exp: ExpenseType) => exp.expense_type === 'business'
      );
      setBusinessExpenses(business?.amount ?? 0);
    }
  }, [expenses?.data]);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <ExpenseStatsByType
          type="Business"
          amount={businessExpenses}
          month="August"
          percentage={2}
        />
        <ExpenseStatsByType
          type="Personal"
          amount={personalExpenses || 0}
          month="August"
          percentage={2}
        />
      </div>
      <div className="grid grid-cols-6 gap-3">
        <div className="grid col-span-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categoryExpenses.map((expense, i) => (
            <ExpenseType
              key={i}
              imageSrc={CatPlaceholder}
              amount={expense.amount}
              type={expense.category}
              quantity={expense.totalItemByCategory}
            />
          ))}
        </div>
        <Link
          href={`/${user?.user.role}/categories`}
          className="text-white   flex flex-col items-center justify-center bg-[#5B52F9] p-4 rounded-xl font-bold cursor-pointer"
        >
          <Image src={PlusIcon} alt="Plus icon" className=" " /> More
        </Link>
      </div>
    </div>
  );
}

export default ExpenseTopSection;
