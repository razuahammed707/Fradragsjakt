import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { MdOutlineSignpost } from 'react-icons/md';
import SharedModal from '@/components/SharedModal';
import { trpc } from '@/utils/trpc';
import CreateRuleModalContent from './CreateRuleModalContent';
import { Edit2 } from 'lucide-react';

type UpdateRuleProps = {
  _id: string;
  description_contains: string;
  category: string;
  category_title: string;
  expense_type: string;
};

export default function CreateRuleModal({
  updateRulePayload,
  origin,
}: {
  updateRulePayload: UpdateRuleProps;
  origin: string;
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

  console.log('update rule payload', updateRulePayload);

  return (
    <>
      {!origin ? (
        <Button variant="purple" onClick={handleButtonClick}>
          <MdOutlineSignpost size={20} className="mr-2" />
          Create Rule
        </Button>
      ) : (
        <Edit2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
          onClick={handleButtonClick}
        />
      )}
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[500px]"
        >
          <div className="bg-white">
            <CreateRuleModalContent
              origin={origin}
              modalClose={setModalOpen}
              categories={manipulateCategories}
              updateRulePayload={updateRulePayload}
            />
          </div>
        </SharedModal>
      </div>
    </>
  );
}
