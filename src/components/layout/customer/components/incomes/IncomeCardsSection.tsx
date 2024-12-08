'use client';

import React, { useEffect, useState } from 'react';

import IncomeStatsByType from './IncomeStatsByType';
import IncomeType from './IncomeType';

import ClothingImg from '../../../../../../public/images/expenses/clothing.png';
import TravelImg from '../../../../../../public/images/expenses/travel.png';
import TransportImg from '../../../../../../public/images/expenses/transport.png';
import GasImg from '../../../../../../public/images/expenses/gas.png';
import MealsImg from '../../../../../../public/images/expenses/meals.png';
import InsuranceImg from '../../../../../../public/images/expenses/insurance.png';
import PaymentImg from '../../../../../../public/payment.png';
import MoreImg from '../../../../../../public/More.png';

const incomeCategories = [
  { label: 'Salary/Wages', image: ClothingImg },
  { label: 'Bonuses', image: TravelImg },
  { label: 'Overtime Pay', image: TransportImg },
  { label: 'Holiday Pay', image: GasImg },
  { label: 'Freelance Earnings', image: MealsImg },
  { label: 'Business Profits', image: InsuranceImg },
  { label: 'Interest', image: PaymentImg },
  { label: 'Dividends', image: MoreImg },
  { label: 'Rental Income', image: MoreImg },
  { label: 'Capital Gains', image: MoreImg },
  { label: 'Unemployment Benefits', image: MoreImg },
  { label: 'Pension', image: MoreImg },
  { label: 'Sick Pay', image: MoreImg },
  { label: 'Parental Leave Pay', image: MoreImg },
  { label: 'Child Benefits', image: MoreImg },
  { label: 'Inheritance', image: MoreImg },
  { label: 'Scholarships/Grants', image: MoreImg },
  { label: 'Prizes/Awards', image: MoreImg },
  { label: 'Alimony/Child Support', image: MoreImg },
  { label: 'Gifts Over Tax-Free Limits', image: MoreImg },
  { label: 'Honorariums', image: MoreImg },
  { label: 'Side Hustle Income', image: MoreImg },
];

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
  const [categoryCards, setCategoryCards] = useState<CategoryCard[]>([]); // Dynamic state
  const [incomeStats, setIncomeStats] = useState({
    personal: 0,
    business: 0,
  });

  useEffect(() => {
    const updatedCategoryCards = incomeCategories.map((category, index) => ({
      id: index,
      imageSrc: category.image, // Use the image from the updated incomeCategories array
      category: category.label, // Category label
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
