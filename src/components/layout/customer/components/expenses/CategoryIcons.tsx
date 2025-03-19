import React from 'react';
import {
  Car,
  Coffee,
  Home,
  Briefcase,
  ShoppingBag,
  Utensils,
  Plane,
} from 'lucide-react';

export const categories = [
  { name: 'Transportation', icon: Car, value: 2 },
  { name: 'Food', icon: Coffee, value: 3 },
  { name: 'Office', icon: Briefcase, value: 1 },
  { name: 'Housing', icon: Home, value: 4 },
  { name: 'Clothing', icon: ShoppingBag, value: 2 },
  { name: 'Business Meals', icon: Utensils, value: 3 },
  { name: 'Office Travel', icon: Plane, value: 1 },
];

const CategoryIcons: React.FC<{
  writeOffSummary: Array<{ category: string; totalItemByCategory: number }>;
}> = ({ writeOffSummary }) => {
  console.log({ writeOffSummary });

  return (
    <div className="flex flex-wrap items-center gap-2">
      {writeOffSummary?.map(({ category, totalItemByCategory }, index) => {
        return (
          <div
            key={index}
            className="flex items-center gap-1 text-xs text-gray-600"
          >
            <div className="p-1 bg-gray-100 rounded-full"></div>
            <span className="hidden sm:inline">{category}</span>
            <span className="text-gray-500">({totalItemByCategory})</span>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryIcons;
