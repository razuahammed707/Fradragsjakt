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

  // Manipulate categories or use default
  const manipulateCategories = expenses?.data?.categoryWiseExpenses
    ? manipulatedCategories(expenses?.data)
    : categories;

  // Sort categories by amount in descending order
  const sortedCategories = [...manipulateCategories]
    .filter((category) => typeof category.amount === 'number')
    .sort((a, b) => b.amount - a.amount);

  // Find the highest category (first in the sorted list)
  const highestCategory = sortedCategories[0];

  // Exclude the highest category from further processing
  const remainingCategories = sortedCategories.slice(1);

  // Take top 8 categories after excluding the highest
  const topCategories = remainingCategories.slice(0, 7);

  // Calculate the sum of remaining categories
  const othersAmount = remainingCategories
    .slice(7)
    .reduce((sum, category) => sum + category.amount, 0);

  // Combine top categories with Others if applicable
  const displayCategories = [
    ...topCategories,
    ...(othersAmount > 0
      ? [
          {
            label: 'Others',
            amount: othersAmount,
            image: '/path/to/default/others-icon.svg', // Add a default icon for Others
          },
        ]
      : [
          {
            label: 'Others',
            amount: 0, // Default to 0 initially
            image: '/path/to/default/others-icon.svg', // Add a default icon for Others
          },
        ]),
  ];

  return (
    <div className="grid grid-cols-6 gap-2">
      {/* Card for the highest category */}
      {highestCategory && (
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
      )}

      {/* Grid for the other categories */}
      <div className="col-span-5 grid grid-cols-4 gap-2">
        {displayCategories.map((category, index) => (
          <Card
            key={index}
            className={cn(
              'min-h-[100px] rounded-[16px] border border-[#EEF0F4] shadow-none flex items-center',
              category.label === 'Others' ? 'justify-center' : ''
            )}
          >
            <CardContent
              className={cn(
                'flex h-full items-center space-x-4 p-4',
                category.label === 'Others' ? 'justify-center text-center' : ''
              )}
            >
              {category.label !== 'Others' && (
                <Image
                  src={category.image}
                  alt={category.label}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div className={category.label === 'Others' ? 'text-center' : ''}>
                <h3
                  className={cn(
                    'text-xl font-bold',
                    category.label === 'Others' ? 'text-center' : ''
                  )}
                >
                  {category.amount}
                </h3>
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
