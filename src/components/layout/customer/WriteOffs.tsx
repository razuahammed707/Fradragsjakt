'use client';

import React, { useEffect } from 'react';
import ProtectedLayout from '../ProtectedLayout';
import QuestionnairesReviewSection from './components/write-offs/QuestionnairesReviewSection';
import WriteOffsTopSection from './components/write-offs/WriteOffsTopSection';
import WriteOffsTableSection from './components/write-offs/WriteOffsTableSection';
import { trpc } from '@/utils/trpc';
import { useDispatch } from 'react-redux';
import { questionnaireSelector, showModal } from '@/redux/slices/questionnaire';
import { useAppSelector } from '@/redux/hooks';

export default function CustomerWriteOffs() {
  const { data: expenses } =
    trpc.expenses.getCategoryAndExpenseTypeWiseExpenses.useQuery({
      expense_type: 'business',
    });

  const dispatch = useDispatch();
  const { isModalOpen } = useAppSelector(questionnaireSelector);

  useEffect(() => {
    dispatch(showModal(true));
  }, []);

  console.log('is modal open', isModalOpen);

  return (
    <ProtectedLayout>
      <div className="grid grid-cols-12 gap-2">
        <div className="col-span-9">
          <WriteOffsTopSection
            categoryWiseExpenses={expenses?.data?.categoryWiseExpenses}
            expenseTypeWiseExpenses={expenses?.data?.expenseTypeWiseExpenses}
          />
          <WriteOffsTableSection />
        </div>
        <QuestionnairesReviewSection />
      </div>
    </ProtectedLayout>
  );
}
