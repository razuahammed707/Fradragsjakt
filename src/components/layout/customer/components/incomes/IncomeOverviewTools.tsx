'use client';

import React, { useCallback, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdAdd } from 'react-icons/io';
import ExpenseAddContent from './ExpenseAddContent';
import SharedModal from '../../../../SharedModal';
import ApplyRuleModalContent from './ApplyRuleModalContent';
import { trpc } from '@/utils/trpc';

import { debounce } from '@/lib/utils';
import ExpenseDataTableFilter from './ExpenseDataTableFilter';
import { useTranslation } from '@/lib/TranslationProvider';
import IncomeUploadStatements from './IncomeUploadStatements';

type ExpenseOverviewSectionProps = {
  setSearchTerm: (value: string) => void;
  setFilterString: (value: string) => void;
};

function IncomeOverviewTools({
  setSearchTerm,
  setFilterString,
}: ExpenseOverviewSectionProps) {
  const { translate } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
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
      return <IncomeUploadStatements setModalOpen={setModalOpen} />;
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
              'components.incomeOverview.heading',
              'Total Income Overview'
            )}
          </h1>
        </div>
        <SearchInput
          className="hidden md:block"
          onChange={handleSearchChange}
          placeholder={translate('components.incomeOverview.search', 'Search')}
        />
      </div>
      <div className="flex justify-between mt-5">
        <div className="flex gap-2">
          <Button
            variant="purple"
            onClick={() => handleButtonClick('addExpense')}
          >
            <IoMdAdd className="font-bold mr-2" />{' '}
            {translate('components.buttons.income_buttons.text.add_income')}
          </Button>
          <Button
            variant="purple"
            onClick={() => handleButtonClick('uploadStatements')}
          >
            <IoMdAdd className="font-bold mr-2" />{' '}
            {translate(
              'components.buttons.income_buttons.text.upload_statements'
            )}
          </Button>
        </div>
        <div className="flex space-x-2">
          <ExpenseDataTableFilter setFilterString={setFilterString} />
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

export default IncomeOverviewTools;
