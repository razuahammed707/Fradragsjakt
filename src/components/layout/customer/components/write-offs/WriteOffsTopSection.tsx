'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { NumericFormat } from 'react-number-format';

const categories = [
  { label: 'Meals', amount: 0, image: '/Meals.png' },
  { label: 'Clothing', amount: 0, image: '/Clothing.png' },
  { label: 'Travel', amount: 0, image: '/Travel.png' },
  { label: 'Supplies', amount: 0, image: '/Supplies.svg' },
  { label: 'Payment', amount: 0, image: '/Payment.png' },
  { label: 'Gas', amount: 0, image: '/Gas.png' },
  { label: 'Transport', amount: 0, image: '/Transport.png' },
  { label: 'Others', amount: 0, image: '/Transport.png' },
];

export default function WriteOffsTopSection({
  categoryWiseExpenses,
  expenseTypeWiseExpenses,
}: {
  categoryWiseExpenses: { category: string; totalItemByCategory: number }[];
  expenseTypeWiseExpenses: { expense_type: string; amount: number }[];
}) {
  const manipulateCategories = categoryWiseExpenses?.length
    ? categories.map((category) => {
        const findExpenseCategory = categoryWiseExpenses.find(
          (item) => item.category.toLowerCase() === category.label.toLowerCase()
        );
        return findExpenseCategory
          ? {
              label: findExpenseCategory.category,
              amount: findExpenseCategory.totalItemByCategory,
              image: category.image, // Use original image for each category
            }
          : category;
      })
    : categories;

  const manipulateExpenseTypeTotal = expenseTypeWiseExpenses
    ?.filter((expense) => expense.expense_type === 'business')
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="grid grid-cols-12 gap-2">
      <div className="col-span-4 p-6 bg-white flex flex-col justify-between rounded-2xl">
        <h3 className="text-xl text-[#101010] font-semibold">
          Potential saving from expenses
        </h3>
        <p className="text-[32px] text-[#00104B] font-bold">
          <NumericFormat
            value={manipulateExpenseTypeTotal || 0}
            displayType="text"
            thousandSeparator
            prefix="NOK "
          />
        </p>
      </div>
      <div className="col-span-8">
        <div className="grid grid-cols-4 gap-2">
          {manipulateCategories.map((category, index) => (
            <Card
              key={index}
              className="rounded-[16px] border border-[#EEF0F4] shadow-none"
            >
              <CardContent className="flex h-full items-center space-x-2 py-4 px-2">
                <Image
                  src={category.image}
                  alt={category.label}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <p className="text-[#71717A] text-xs font-semibold">
                  {category.label} <span>{`(${category.amount})`}</span>
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
