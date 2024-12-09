'use client';

import React, { useEffect, useState } from 'react';

import IncomeStatsByType from './IncomeStatsByType';
import IncomeType from './IncomeType';

import { income_categories } from '@/utils/dummy';
// import { trpc } from '@/utils/trpc';
// import { useSession } from 'next-auth/react';

interface CategoryCard {
  id: number;
  imageSrc: string;
  category: string;
  totalItemByCategory: number;
  amount: number;
}

type IFilterProps = {
  filterString: string;
};

const IncomeCardsSection = ({ filterString }: IFilterProps) => {
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([]);
  const [incomeStats, setIncomeStats] = useState({
    personal: 0,
    business: 0,
  });

  // const { data: incomes } =
  //   trpc.incomes.getCategoryAndIncomeTypeWiseIncomes.useQuery({
  //     income_type: '',
  //     filterString,
  //   });
  //const { data: user } = useSession();
  useEffect(() => {
    const updatedCategoryCards = income_categories.map((category, index) => ({
      id: index,
      imageSrc: category.image,
      category: category.label,
      totalItemByCategory: Math.floor(Math.random() * 100),
      amount: Math.floor(Math.random() * 10000),
    }));

    const businessStats = updatedCategoryCards
      .filter((card) => card.category.toLowerCase().includes('business'))
      .reduce((sum, card) => sum + card.amount, 0);

    const personalStats = updatedCategoryCards
      .filter((card) => card.category.toLowerCase().includes('personal'))
      .reduce((sum, card) => sum + card.amount, 0);

    setIncomeStats({
      business: businessStats,
      personal: personalStats,
    });

    // Slice to show only the first 8 categories
    setCategoryCards(updatedCategoryCards.slice(0, 8));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="grid grid-cols-2 gap-3">
        <IncomeStatsByType
          type="Business"
          amount={incomeStats.business}
          filterString={filterString}
        />
        <IncomeStatsByType
          type="Personal"
          amount={incomeStats.personal}
          filterString={filterString}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Display a maximum of 8 categories */}
        {categoryCards.map((income, i) => (
          <IncomeType
            key={i}
            imageSrc={income.imageSrc}
            amount={income.amount}
            type={income.category}
            quantity={income.totalItemByCategory}
          />
        ))}
      </div>
    </div>
  );
};

export default IncomeCardsSection;
