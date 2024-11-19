'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { trpc } from '@/utils/trpc';
import { categories } from '@/utils/dummy';
import { manipulatedCategories } from '@/utils/helpers/categoryManipulation';

export default function CategoryCard() {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: '',
    });

  const manipulateCategories = expenses?.data?.categoryWiseExpenses
    ? manipulatedCategories(expenses?.data)
    : categories;

  // Find the category with the highest totalItemByCategory
  const categoryWithHighestValue = manipulateCategories
    ?.filter((category) => typeof category.amount === 'number')
    .reduce(
      (acc, current, index) => {
        return current.amount > acc.category.amount
          ? { category: current, index }
          : acc;
      },
      { category: manipulateCategories[0], index: 0 } // Initial value
    );

  // Access the category and index
  const highestCategory = categoryWithHighestValue?.category;
  console.log('higest category', highestCategory);
  return (
    <div className="grid grid-cols-6 gap-2">
      {/* Card for the highest category */}
      <Card
        style={{ gridRow: 'span 2' }}
        className="col-span-1 rounded-[16px] border border-[#EEF0F4] shadow-none min-h-[100px]"
      >
        <CardContent className="flex h-full items-center space-x-4 p-4">
          <Image
            src={highestCategory?.image}
            alt={highestCategory?.label}
            width={100}
            height={98}
            className="rounded-full"
          />
          <div>
            <h3 className={cn('text-xl font-bold')}>
              {highestCategory?.amount}
            </h3>
            <p className="text-[#71717A] font-inter text-[16px] font-semibold leading-[20px]">
              {highestCategory?.label}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Grid for the other categories */}
      <div className="col-span-5 grid grid-cols-4 gap-2">
        {manipulateCategories?.map((category, index) => (
          <Card
            key={index}
            className="min-h-[100px] rounded-[16px] border border-[#EEF0F4] shadow-none flex items-center"
          >
            <CardContent className="flex h-full items-center space-x-4 p-4">
              <Image
                src={category.image}
                alt={category.label}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <h3 className={cn('text-xl font-bold')}>{category.amount}</h3>
                <p className="text-[#71717A] font-inter text-[16px] font-semibold leading-[20px]">
                  {category.label}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
