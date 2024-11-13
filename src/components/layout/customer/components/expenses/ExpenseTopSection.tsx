'use client';

import React from 'react';
import Image from 'next/image';
import ExpenseStatsByType from './ExpenseStatsByType';
import { expenseType } from '@/utils/dummy';
import ExpenseType from './ExpenseType';
import PlusIcon from '../../../../../../public/images/expenses/plus.png';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { trpc } from '@/utils/trpc';

function ExpenseTopSection() {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery();
  console.log('expenses_', expenses);

  const { data: user } = useSession();
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <ExpenseStatsByType
          type="Business"
          amount={'30,000'}
          month="August"
          percentage={2}
        />
        <ExpenseStatsByType
          type="Personal"
          amount={'30,000'}
          month="August"
          percentage={2}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {expenseType.map((expense) => (
          <ExpenseType
            key={expense.id}
            imageSrc={expense.imageSrc}
            amount={expense.amount}
            type={expense.type}
            quantity={expense.quantity}
          />
        ))}
        <Link
          href={`/${user?.user.role}/categories`}
          className="text-white flex items-center justify-center bg-[#5B52F9] p-4 rounded-xl font-bold cursor-pointer"
        >
          <Image src={PlusIcon} alt="Plus icon" className="mr-3" /> More
        </Link>
      </div>
    </div>
  );
}

export default ExpenseTopSection;
