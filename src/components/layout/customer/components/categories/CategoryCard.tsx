import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const categories = [
  { label: 'Supplies', amount: 35, image: '/Supplies.svg' },
  { label: 'Clothing', amount: 15, image: '/Clothing.png' },
  { label: 'Travel', amount: 20, image: '/Travel.png' },
  { label: 'Transport', amount: 25, image: '/Transport.png' },
  { label: 'Gas', amount: 40, image: '/Gas.png' },
  { label: 'Meals', amount: 30, image: '/Meals.png' },
  { label: 'Insurance', amount: 40, image: '/Insurance.png' },
  { label: 'Payment', amount: 25, image: '/Payment.png' },
  { label: 'More (25)', amount: 'NOK 500', image: '/More.png' },
];

export default function CategoryCard() {
  return (
    <div className="grid grid-cols-5 gap-2">
      {categories.map((category, index) => (
        <Card
          key={index}
          style={index === 0 ? { gridRow: 'span 2' } : { minHeight: '100px' }}
          className="rounded-[16px] border border-[#EEF0F4] shadow-none "
        >
          <CardContent className="flex h-full items-center space-x-4 p-4">
            <Image
              src={category.image}
              alt={category.label}
              width={index === 0 ? 108 : 40}
              height={index === 0 ? 106 : 40}
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
  );
}
