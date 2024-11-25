import React, { useCallback, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdAdd } from 'react-icons/io';
import Image from 'next/image';
import RuleIcon from '../../../../../../public/images/expenses/rule.png';
import WriteOffIcon from '../../../../../../public/images/expenses/writeoff.png';
import ExpenseAddContent from './ExpenseAddContent';
import SharedModal from '../../../../SharedModal';
import ExpenseUploadContent from './ExpenseUploadContent';
import ApplyRuleModalContent from './ApplyRuleModalContent';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { debounce } from '@/lib/utils';
import ExpenseDataTableFilter from './ExpenseDataTableFilter';

type ExpenseOverviewSectionProps = {
  setSearchTerm: (value: string) => void;
  setFilterString: (value: string) => void;
};

const buttons = [
  { text: 'Apply Rule', icon: RuleIcon },
  { text: 'Show Write-offs', icon: WriteOffIcon },
];

function ExpenseOverviewHeading({
  setSearchTerm,
  setFilterString,
}: ExpenseOverviewSectionProps) {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useSession();
  const [modalContent, setModalContent] = useState<{
    title: string;
  }>({
    title: '',
  });
  const { data: expensesWithMatchedRules } =
    trpc.expenses.getUnknownExpensesWithMatchedRules.useQuery(
      {
        page: 1,
        limit: 10,
      },
      {
        keepPreviousData: true,
      }
    );
  const { data: categories } = trpc.categories.getCategories.useQuery(
    {
      page: 1,
      limit: 50,
    },
    {
      keepPreviousData: true,
    }
  );

  const manipulatedCategories = categories?.data
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
        categories={manipulatedCategories}
      />
    ) : modalContent.title === 'Apply Rule' ? (
      <ApplyRuleModalContent
        expenses={expensesWithMatchedRules?.data || []}
        setModalOpen={setModalOpen}
      />
    ) : modalContent.title === 'Upload statements' ? (
      <ExpenseUploadContent setModalOpen={setModalOpen} />
    ) : (
      <></>
    );
  };

  // Debounced version of setSearchTerm
  const debouncedSetSearchTerm = useCallback(debounce(setSearchTerm), [
    setSearchTerm,
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSearchTerm(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between">
        <div>
          <h1 className="text-xl font-semibold">Total Expenses Overview</h1>
          <h2 className="text-sm text-gray-600 font-light mb-0">
            <strong className="text-[#00B386] font-semibold">+2%</strong> in
            August
          </h2>
        </div>
        <SearchInput
          className="hidden md:block"
          onChange={handleSearchChange}
        />
      </div>
      <div className="flex justify-between mt-5">
        <div className=" flex gap-2">
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
        <div className=" flex space-x-2 ">
          <ExpenseDataTableFilter setFilterString={setFilterString} />
          {buttons.map((button, index) => (
            <Button
              disabled={
                button.text === 'Apply Rule' &&
                expensesWithMatchedRules?.data?.expensesWithRules?.length == 0
              }
              key={index}
              variant="purple"
              onClick={() =>
                button.text === 'Show Write-offs'
                  ? router.push(`/${user?.user?.role}/write-offs`)
                  : handleButtonClick(button.text)
              }
            >
              <Image src={button.icon} alt="button icon" className="mr-2" />{' '}
              {button.text}
            </Button>
          ))}
        </div>
        <div className="bg-white absolute z-50">
          <SharedModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            customClassName="max-w-[650px]"
          >
            <div className="bg-white">{renderContent()}</div>
          </SharedModal>
        </div>
      </div>
    </>
  );
}

export default ExpenseOverviewHeading;
