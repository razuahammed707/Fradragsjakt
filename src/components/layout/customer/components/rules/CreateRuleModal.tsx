import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

import { MdOutlineSignpost } from 'react-icons/md';
import SharedModal from '@/components/SharedModal';
import { trpc } from '@/utils/trpc';
import CreateRuleModalContent from './CreateRuleModalContent';

export default function CreateRuleModal() {
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
      <Button variant="purple" onClick={handleButtonClick}>
        <MdOutlineSignpost size={20} className="mr-2" />
        Create Rule
      </Button>
      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[500px]"
        >
          <div className="bg-white">
            <CreateRuleModalContent
              modalClose={setModalOpen}
              categories={manipulateCategories}
            />
          </div>
        </SharedModal>
      </div>
    </>
  );
}
