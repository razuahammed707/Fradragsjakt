'use client';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image, { StaticImageData } from 'next/image';
import { cn } from '@/lib/utils';
import { categories as defaultCategories } from '@/utils/dummy';

type Category = {
  label: string;
  amount: number;
  image?: string | StaticImageData;
};

export default function CategoryCard() {
  const categories: Category[] = [...defaultCategories];
  const sortedCategories = categories.sort((a, b) => b.amount - a.amount);
  const topCategories = sortedCategories.slice(0, 7);
  const remainingCategories = sortedCategories.slice(7);
  const othersCategory: Category | null =
    remainingCategories.length > 0
      ? {
          label: 'Others',
          amount: remainingCategories.reduce(
            (sum, category) => sum + category.amount,
            0
          ),
        }
      : null;
  const displayCategories = othersCategory
    ? [...topCategories, othersCategory]
    : topCategories;

  return (
    <div className="grid grid-cols-6 gap-2">
      <div className="col-span-6 grid grid-cols-4 gap-2">
        {displayCategories.map((category, index) => (
          <Card
            key={index}
            className={`min-h-[100px] rounded-[16px] border border-[#EEF0F4] shadow-none flex ${
              category.label === 'Others'
                ? 'justify-center items-center'
                : 'items-center'
            }`}
          >
            <CardContent
              className={`flex h-full ${
                category.label === 'Others'
                  ? 'justify-center text-center pt-6'
                  : 'items-center space-x-4 p-4'
              }`}
            >
              {category.image && category.label !== 'Others' && (
                <Image
                  src={category.image}
                  alt={category.label}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <h3
                  className={cn(
                    'text-xl font-bold',
                    category.label === 'Others' ? 'pl-0' : 'pl-2'
                  )}
                >
                  {category.amount || '0'}
                </h3>
                <p
                  className={cn(
                    'text-[#71717A] font-inter text-[16px] font-semibold leading-[20px]',
                    category.label === 'Others' ? 'pl-0' : 'pl-2'
                  )}
                >
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
