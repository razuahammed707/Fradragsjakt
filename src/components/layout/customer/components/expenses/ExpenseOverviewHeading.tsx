'use client';

import React, { useCallback, useState } from 'react';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdAdd, IoMdTrash } from 'react-icons/io';
import Image from 'next/image';
import RuleIcon from '../../../../../../public/images/expenses/rule.png';
import WriteOffIcon from '../../../../../../public/images/expenses/writeoff.png';
import ExpenseAddContent from './ExpenseAddContent';
import SharedModal from '../../../../SharedModal';
import ApplyRuleModalContent from './ApplyRuleModalContent';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn, debounce } from '@/lib/utils';
import ExpenseDataTableFilter from './ExpenseDataTableFilter';
import { useTranslation } from '@/lib/TranslationProvider';
import useUserInfo from '@/hooks/use-user-info';
import StatementUploadContent from '@/components/StatementUploadContent';
import DeleteConfirmationContent from '@/components/DeleteConfirmationContent';

type ExpenseOverviewSectionProps = {
  setSearchTerm: (value: string) => void;
  setFilterString: (value: string) => void;
  selectedRows?: any[];
  onSelectionChange?: (rows: any[]) => void;
};

function ExpenseOverviewHeading({
  setSearchTerm,
  setFilterString,
  selectedRows = [],
  onSelectionChange,
}: ExpenseOverviewSectionProps) {
  const { isAuditor } = useUserInfo();
  const { translate } = useTranslation();
  const router = useRouter();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    key: string;
    itemIds?: string[];
  }>({
    key: '',
  });
  const { data: user } = useSession();

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

  const handleButtonClick = (key: string, itemIds?: string[]) => {
    setModalContent({ key: '' });
    setModalOpen(false);

    setTimeout(() => {
      setModalContent({ key, itemIds });
      setModalOpen(true);
    }, 100);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalContent({ key: '' });
    if (selectedRows.length > 0) {
      onSelectionChange?.([]);
    }
  };

  const renderContent = () => {
    switch (modalContent.key) {
      case 'addExpense':
        return <ExpenseAddContent setModalOpen={setModalOpen} />;
      case 'applyRule':
        return (
          <ApplyRuleModalContent
            expenses={expensesWithMatchedRules?.data || []}
            setModalOpen={setModalOpen}
          />
        );
      case 'confirmation':
        return (
          <DeleteConfirmationContent
            itemOrigin="expense"
            itemIds={modalContent.itemIds}
            setModalOpen={setModalOpen}
            onDeleteComplete={() => {
              onSelectionChange?.([]);
              handleModalClose();
            }}
          />
        );
      case 'uploadStatements':
        return (
          <StatementUploadContent
            setModalContent={setModalContent}
            setModalOpen={handleModalClose}
          />
        );
      default:
        return null;
    }
  };

  const debouncedSetSearchTerm = useCallback(
    (value: string) => debounce(setSearchTerm)(value),
    [setSearchTerm]
  );

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
              'Total Expense Overview'
            )}
          </h1>
        </div>
        {!isAuditor && (
          <SearchInput
            className="hidden md:block"
            onChange={handleSearchChange}
            placeholder={translate(
              'components.expenseOverview.search',
              'Search'
            )}
          />
        )}
      </div>
      <div className="flex justify-between mt-5">
        {isAuditor ? (
          <SearchInput
            className="hidden md:block"
            onChange={handleSearchChange}
            placeholder={translate(
              'components.expenseOverview.search',
              'Search'
            )}
          />
        ) : (
          <div className="flex gap-2">
            {selectedRows.length > 0 ? (
              <Button
                variant="destructive"
                onClick={() =>
                  handleButtonClick(
                    'confirmation',
                    selectedRows.map((row) => row._id)
                  )
                }
                className="bg-red-600 hover:bg-red-700"
              >
                <IoMdTrash className="font-bold mr-2" />
                Delete ({selectedRows.length})
              </Button>
            ) : (
              <>
                <Button
                  variant="purple"
                  onClick={() => handleButtonClick('addExpense')}
                >
                  <IoMdAdd className="font-bold mr-2" />
                  {translate(
                    'components.buttons.expense_buttons.text.add_expense'
                  )}
                </Button>
                <Button
                  variant="purple"
                  onClick={() => handleButtonClick('uploadStatements')}
                >
                  <IoMdAdd className="font-bold mr-2" />
                  {translate(
                    'components.buttons.expense_buttons.text.upload_statements'
                  )}
                </Button>
              </>
            )}
          </div>
        )}
        <div className="flex space-x-2">
          <ExpenseDataTableFilter setFilterString={setFilterString} />
          {!isAuditor && (
            <>
              <Button
                disabled={!expensesWithMatchedRules?.data?.length}
                variant="purple"
                onClick={() => handleButtonClick('applyRule')}
              >
                <Image src={RuleIcon} alt="button icon" className="mr-2" />{' '}
                Apply Rule
              </Button>
              <Button
                variant="purple"
                onClick={() => router.push(`/${user?.user?.role}/write-offs`)}
              >
                <Image src={WriteOffIcon} alt="button icon" className="mr-2" />{' '}
                Write-offs
              </Button>
            </>
          )}
        </div>
      </div>
      <SharedModal
        open={isModalOpen}
        onOpenChange={handleModalClose}
        customClassName={cn(
          modalContent.key !== 'confirmation' && 'max-w-[650px]'
        )}
      >
        <div className="bg-white">{renderContent()}</div>
      </SharedModal>
    </>
  );
}

export default ExpenseOverviewHeading;
