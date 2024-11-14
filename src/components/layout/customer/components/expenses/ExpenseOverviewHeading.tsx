import React, { useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdAdd } from 'react-icons/io';
import Image from 'next/image';
import FilterIcon from '../../../../../../public/images/expenses/filter.png';
import RuleIcon from '../../../../../../public/images/expenses/rule.png';
import WriteOffIcon from '../../../../../../public/images/expenses/writeoff.png';
import ExpenseAddContent from './ExpenseAddContent';
import SharedModal from '../../../../SharedModal';
import ExpenseUploadContent from './ExpenseUploadContent';
import ApplyRuleModalContent from './ApplyRuleModalContent';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const buttons = [
  { text: 'Filter By', icon: FilterIcon },
  { text: 'Apply Rule', icon: RuleIcon },
  { text: 'Show Write-offs', icon: WriteOffIcon },
];

function ExpenseOverviewHeading() {
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

  const handleButtonClick = (title: string) => {
    setModalContent({ title });
    setModalOpen(true);
  };

  const renderContent = () => {
    return modalContent.title === 'Add expense' ? (
      <ExpenseAddContent setModalOpen={setModalOpen} />
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
        </div>
      </div>

      <div className="bg-white z-50">
        <SharedModal
          open={isModalOpen}
          onOpenChange={setModalOpen}
          customClassName="max-w-[650px]"
        >
          <div className="bg-white">{renderContent()}</div>
        </SharedModal>
      </div>
    </div>
  );
}

export default ExpenseOverviewHeading;
