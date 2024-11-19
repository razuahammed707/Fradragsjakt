'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import FilterIcon from '../../../../../../public/images/expenses/filter.png';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import { trpc } from '@/utils/trpc';

interface FilterItem {
  id: string;
  label: string;
}

interface CategoryOption {
  _id: string;
  creator_id: string;
  title: string;
  __v: number;
  createdAt: string;
  created_by: string;
  updatedAt: string;
}

const expenseTypes: FilterItem[] = [
  { id: 'business', label: 'Business' },
  { id: 'personal', label: 'Personal' },
  { id: 'unknown', label: 'Unknown' },
];

export default function ExpenseDataTableFilter({
  setFilterString,
}: {
  setFilterString: (value: string) => void;
}): JSX.Element {
  const { data: categoryData } = trpc.categories.getCategories.useQuery({});

  const categoryOptions: FilterItem[] = React.useMemo(() => {
    if (!categoryData?.data) return [];
    return categoryData.data.map((category: CategoryOption) => ({
      id: category.title.toLowerCase(),
      label: category.title.charAt(0).toUpperCase() + category.title.slice(1),
    }));
  }, [categoryData]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const generateQueryString = (): string => {
    const parts: string[] = [];
    if (selectedCategories.length > 0) {
      parts.push(`category=${selectedCategories.join(',')}`);
    }
    if (selectedTypes.length > 0) {
      parts.push(`expense_type=${selectedTypes.join(',')}`);
    }
    return parts.join('&');
  };

  useEffect(() => {
    setFilterString(generateQueryString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories, selectedTypes, setFilterString]);

  const toggleCategory = (categoryId: string): void => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleType = (typeId: string): void => {
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="purple">
          <Image
            src={FilterIcon}
            alt="button icon"
            className="mr-2"
            width={20}
            height={20}
          />
          Filter By
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <ScrollArea className="max-h-[230px] min-h-[150px] pr-4">
          <div className="space-y-4">
            <div>
              <h4 className="mb-4 text-sm font-medium leading-none">
                Category
              </h4>
              <div className="grid gap-2">
                {categoryOptions.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      className="data-[state=checked]:text-white"
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={category.id}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            <div>
              <h4 className="mb-4 text-sm font-medium leading-none">
                Expense Type
              </h4>
              <div className="grid gap-2">
                {expenseTypes.map((type) => (
                  <div key={type.id} className="flex items-center space-x-2">
                    <Checkbox
                      className="data-[state=checked]:text-white"
                      id={type.id}
                      checked={selectedTypes.includes(type.id)}
                      onCheckedChange={() => toggleType(type.id)}
                    />
                    <Label
                      htmlFor={type.id}
                      className="text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}