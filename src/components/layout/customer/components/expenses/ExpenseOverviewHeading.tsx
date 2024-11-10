import React, { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdAdd } from 'react-icons/io';
import Image from 'next/image';
import FilterIcon from '../../../../../../public/images/expenses/filter.png';
import RuleIcon from '../../../../../../public/images/expenses/rule.png';
import WriteOffIcon from '../../../../../../public/images/expenses/writeoff.png';
import ExpenseRuleUpdateOrCreateContent from './ExpenseRuleUpdateOrCreateContent';
import ExpenseWriteOffSummary from './ExpenseWriteOffSummary';
import SharedModal from '../../../../SharedModal';
import ExpenseUploadContent from './ExpenseUploadContent';
import { trpc } from '@/utils/trpc';
import ExpenseAddContent from './ExpenseAddContent';
import { usePathname, useRouter } from 'next/navigation';

const buttons = [
  { text: 'Filter By', icon: FilterIcon },
  { text: 'Apply Rule', icon: RuleIcon },
  { text: 'Show Write-offs', icon: WriteOffIcon },
];

function ExpenseOverviewHeading({}) {
  const router = useRouter();
  const pathname = usePathname();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
  }>({
    title: '',
  });

  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      keepPreviousData: true,
    }
  );
  const manipulateCategories = categories?.data
    ? categories?.data?.map((category) => {
        return {
          title: category.title,
          value: category.title,
        };
      })
    : [];

  const handleButtonClick = (title: string) => {
    setModalContent({ title });
    setModalOpen(true);
  };

  const renderContent = () => {
    return modalContent.title === 'Add expense' ? (
      <ExpenseAddContent
        setModalOpen={setModalOpen}
        categories={manipulateCategories}
      />
    ) : modalContent.title === 'Apply Rule' ? (
      <ExpenseRuleUpdateOrCreateContent
        categories={manipulateCategories}
        modalClose={setModalOpen}
      />
    ) : modalContent.title === 'Show Write-offs' ? (
      <ExpenseWriteOffSummary />
    ) : modalContent.title === 'Upload statements' ? (
      <ExpenseUploadContent setModalOpen={setModalOpen} />
    ) : (
      <></>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <h1 className="text-xl font-semibold">Total Expenses Overview</h1>
        <h2 className="text-sm text-gray-600 font-light mb-0">
          <strong className="text-[#00B386] font-semibold">+2%</strong> in
          August
        </h2>
        <div className="mt-5 flex gap-2">
          <Button
            variant="purple"
            onClick={() => handleButtonClick('Add expense')}
          >
            <IoMdAdd className="font-bold mr-2" /> Add Expense
          </Button>
          <Button
            variant="purple"
            onClick={() => handleButtonClick('Upload statements')}
          >
            <IoMdAdd className="font-bold mr-2" /> Upload Statements
          </Button>
        </div>
      </div>
      <div className="flex justify-end">
        <div className="flex flex-col justify-end">
          <div className="flex justify-end">
            <SearchInput className="hidden md:block" />
          </div>
          <div className="mt-5 flex space-x-2">
            {buttons.map((button, index) =>
              button.text === 'Show Write-offs' ? (
                <Button
                  key={index}
                  variant="purple"
                  onClick={() =>
                    router.push(`/${pathname.split('/')[1]}/write-offs`)
                  }
                >
                  <Image src={button.icon} alt="button icon" className="mr-2" />{' '}
                  {button.text}
                </Button>
              ) : (
                <Button
                  key={index}
                  variant="purple"
                  onClick={() => handleButtonClick(button.text)}
                >
                  <Image src={button.icon} alt="button icon" className="mr-2" />{' '}
                  {button.text}
                </Button>
              )
            )}
          </div>
        </div>
      </div>

      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[500px]"
        >
          <div className="bg-white">{renderContent()}</div>
        </SharedModal>
      </div>
    </div>
  );
}

export default ExpenseOverviewHeading;
