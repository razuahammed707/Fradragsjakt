import React, { useState } from 'react';

import SharedModal from '@/components/SharedModal';
import { Edit2 } from 'lucide-react';
import ExpenseAddContent from './ExpenseAddContent';
import { trpc } from '@/utils/trpc';

export type PayloadType = {
  amount: number;
  category: string;
  description: string;
  expense_type: string;
  transaction_date?: string;
  createdAt?: string;
  __v?: number;
  _id: string;
};

export default function ExpenseUpdateModal({
  payload,
}: {
  payload: PayloadType;
}) {
  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      keepPreviousData: true,
    }
  );
  const [isModalOpen, setModalOpen] = useState(false);

  const handleButtonClick = () => {
    setModalOpen(true);
  };

  const manipulateCategories = categories?.data
    ? categories?.data?.map((category) => {
        return {
          title: category.title,
          value: category.title,
        };
      })
    : [];

  return (
    <>
      <Edit2
        className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
        onClick={handleButtonClick}
      />
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[500px]"
        >
          <div className="bg-white">
            <ExpenseAddContent
              origin="expense update"
              setModalOpen={setModalOpen}
              categories={manipulateCategories}
              payload={payload}
            />
          </div>
        </SharedModal>
      </div>
    </>
  );
}