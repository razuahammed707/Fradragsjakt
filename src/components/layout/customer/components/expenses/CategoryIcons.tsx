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

const CategoryIcons: React.FC = () => {
  // Placeholder data - this would be replaced with real data later
  const categories = [
    { name: 'Transportation', icon: <Car className="h-4 w-4" />, value: 2 },
    { name: 'Food', icon: <Coffee className="h-4 w-4" />, value: 3 },
    { name: 'Office', icon: <Briefcase className="h-4 w-4" />, value: 1 },
    { name: 'Housing', icon: <Home className="h-4 w-4" />, value: 4 },
    { name: 'Clothing', icon: <ShoppingBag className="h-4 w-4" />, value: 2 },
    {
      name: 'Business Meals',
      icon: <Utensils className="h-4 w-4" />,
      value: 3,
    },
    { name: 'Office Travel', icon: <Plane className="h-4 w-4" />, value: 1 },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2 px-2 pb-3">
      {categories.map((category, index) => (
        <div
          key={index}
          className="flex items-center gap-1 text-xs text-gray-600"
        >
          <div className="p-1 bg-gray-100 rounded-full">{category.icon}</div>
          <span className="hidden sm:inline">{category.name}</span>
          <span className="text-gray-500">({category.value})</span>
        </div>
      ))}
    </div>
  );
};

export default CategoryIcons;
