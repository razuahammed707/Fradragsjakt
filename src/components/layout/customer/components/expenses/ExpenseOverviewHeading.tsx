'use client';

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
import { useTranslation } from '@/lib/TranslationProvider';

type ExpenseOverviewSectionProps = {
  setSearchTerm: (value: string) => void;
  setFilterString: (value: string) => void;
};

function ExpenseOverviewHeading({
  setSearchTerm,
  setFilterString,
}: ExpenseOverviewSectionProps) {
  const { translate } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { data: user } = useSession();
  const [modalContent, setModalContent] = useState<{ key: string }>({
    key: '',
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

  const buttons = [
    {
      key: 'applyRule',
      text: translate('components.buttons.expense_buttons.text.apply_rule'),
      icon: RuleIcon,
    },
    {
      key: 'showWriteOffs',
      text: translate(
        'components.buttons.expense_buttons.text.show_write_offs'
      ),
      icon: WriteOffIcon,
    },
  ];

  const handleButtonClick = (key: string) => {
    setModalContent({ key });
    setModalOpen(true);
  };

  const renderContent = () => {
    if (modalContent.key === 'addExpense') {
      return (
        <ExpenseAddContent
          setModalOpen={setModalOpen}
          categories={manipulatedCategories}
        />
      );
    }
    if (modalContent.key === 'applyRule') {
      return (
        <ApplyRuleModalContent
          expenses={expensesWithMatchedRules?.data || []}
          setModalOpen={setModalOpen}
        />
      );
    }
    if (modalContent.key === 'uploadStatements') {
      return <ExpenseUploadContent setModalOpen={setModalOpen} />;
    }
    return <></>;
  };

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
          <h1 className="text-xl font-semibold">
            {translate(
              'components.expenseOverview.heading',
              'Total Expenses Overview'
            )}
          </h1>
          <h2 className="text-sm text-gray-600 font-light mb-0">
            <strong className="text-[#00B386] font-semibold">+2%</strong>{' '}
            {translate('components.expenseOverview.subheading', 'in August')}
          </h2>
        </div>
        <SearchInput
          className="hidden md:block"
          onChange={handleSearchChange}
          placeholder={translate('components.expenseOverview.search', 'Search')}
        />
      </div>
      <div className="flex justify-between mt-5">
        <div className="flex gap-2">
          <Button
            variant="purple"
            onClick={() => handleButtonClick('addExpense')}
          >
            <IoMdAdd className="font-bold mr-2" />{' '}
            {translate('components.buttons.expense_buttons.text.add_expense')}
          </Button>
          <Button
            variant="purple"
            onClick={() => handleButtonClick('uploadStatements')}
          >
            <IoMdAdd className="font-bold mr-2" />{' '}
            {translate(
              'components.buttons.expense_buttons.text.upload_statements'
            )}
          </Button>
        </div>
        <div className="flex space-x-2">
          <ExpenseDataTableFilter setFilterString={setFilterString} />
          {buttons.map((button, index) => (
            <Button
              disabled={
                button.key === 'applyRule' &&
                expensesWithMatchedRules?.data?.expensesWithRules?.length === 0
              }
              key={index}
              variant="purple"
              onClick={() =>
                button.key === 'showWriteOffs'
                  ? router.push(`/${user?.user?.role}/write-offs`)
                  : handleButtonClick(button.key)
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