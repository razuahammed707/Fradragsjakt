'use client';
import React from 'react';
import QuestionnairesReviewSection from '../write-offs/QuestionnairesReviewSection';
import WriteOffsTableSection from '../write-offs/WriteOffsTableSection';
import AggregatedExpenseCard from './AggregatedExpenseCard';
import {
  CustomCategory,
  finalCalculation,
} from '@/utils/helpers/primaryCategoriesWithFormula';
import { trpc } from '@/utils/trpc';
import { predefinedCategories } from '@/utils/dummy';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { manipulateCustomCategoryExpenses } from '@/utils/helpers/manipulateCustomCategoryExpenses';

const DashboardOverviewSection = () => {
  const { categories } = useManipulatedCategories({ category_for: 'expense' });

  const referenceCategories = categories?.filter(
    (category: { title: string; reference_category: string }) =>
      category.reference_category
  );
  const { data: expensesAnalytics } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });
  const dbCategories = expensesAnalytics?.data?.categoryWiseExpenses;
  const customCategories = manipulateCustomCategoryExpenses(
    referenceCategories || [],
    dbCategories
  ) as CustomCategory[];
  const businessData = finalCalculation(
    dbCategories,
    predefinedCategories,
    customCategories
  );
  return (
    <div className="grid grid-cols-12 gap-2 mt-2">
      <div className="col-span-7 space-y-2">
        <AggregatedExpenseCard
          origin="business"
          items={businessData}
          title="Write-offs From Business Spending (Total)"
        />
        <WriteOffsTableSection />
      </div>
      <QuestionnairesReviewSection />
    </div>
  );
};

export default DashboardOverviewSection;
