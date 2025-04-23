'use client';

import React, { useCallback, useState } from 'react';
import SearchInput from '@/components/forms/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdTrash } from 'react-icons/io';
import ExpenseAddContent from './ExpenseAddContent';
import SharedModal from '../../../../SharedModal';
import ApplyRuleModalContent from './ApplyRuleModalContent';
import { trpc } from '@/utils/trpc';

import { cn, debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';
import useUserInfo from '@/hooks/use-user-info';
import StatementUploadContent from '@/components/StatementUploadContent';
import ConfirmationModalContent from '@/components/ConfirmationModalContent';
import DeleteConfirmationContent from '@/components/DeleteConfirmationContent';
import CreateRuleModal from '../rules/CreateRuleModal';
import { CircleEllipsis, PlusCircle } from 'lucide-react';
import UploadingStatementsWarning from '../dashboard/UploadingStatementsWarning';

type ExpenseOverviewSectionProps = {
  setSearchTerm: (value: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDeleteComplete?: () => void;
};

function ExpenseOverviewHeading({
  setSearchTerm,
  selectedIds = [],
  onSelectionChange,
  onDeleteComplete,
}: ExpenseOverviewSectionProps) {
  const { isAuditor } = useUserInfo();
  const { translate } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    key: string;
    itemIds?: string[];
  }>({
    key: '',
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: expensesWithMatchedRules } =
    trpc.expenses.getUnknownExpensesWithMatchedRules.useQuery(
      {
        page: 1,
        limit: 10,
      },
      {
        keepPreviousData: true,
      }
    ) as unknown as any;

  const handleButtonClick = (key: string, itemIds?: string[]) => {
    if (key === 'deleteRows') {
      setModalContent({ key, itemIds });
    } else {
      setModalContent({ key });
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setModalContent({ key: '' });
    if (selectedIds.length > 0) {
      onSelectionChange?.([]);
    }
  };

  const renderContent = () => {
    if (modalContent.key === 'addExpense') {
      return (
        <ExpenseAddContent setModalOpen={setModalOpen} origin={'expense add'} />
      );
    }
    if (modalContent.key === 'applyRule') {
      return (
        <ApplyRuleModalContent
          expenses={expensesWithMatchedRules?.data}
          setModalOpen={setModalOpen}
        />
      );
    }
    if (modalContent.key === 'confirmation') {
      return <ConfirmationModalContent setModalOpen={setModalOpen} />;
    }
    if (modalContent.key === 'deleteRows') {
      return (
        <DeleteConfirmationContent
          itemOrigin="expense"
          setModalOpen={setModalOpen}
          itemIds={modalContent.itemIds}
          onDeleteComplete={() => {
            onSelectionChange?.([]);
            handleModalClose();
            onDeleteComplete?.();
          }}
        />
      );
    }
    if (modalContent.key === 'uploadStatements') {
      return <StatementUploadContent setModalContent={setModalContent} />;
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
    <div>
      <UploadingStatementsWarning />
      <div className="flex justify-between gap-2">
        <SearchInput
          onChange={handleSearchChange}
          iconClassName="h-6 w-6 left-3 top-3"
          className="w-full py-6 placeholder:text-lg rounded-lg "
        />

        {!isAuditor && (
          <div>
            <div className="flex ">
              <Button
                className="bg-transparent border-none py-6 shadow-none text-lg hover:bg-[#E6E6FF]"
                onClick={() => handleButtonClick('addExpense')}
              >
                <PlusCircle className="font-bold mr-2" />{' '}
                {translate(
                  'components.buttons.expense_buttons.text.add_expense'
                )}
              </Button>
              <Button
                className="bg-transparent border-none py-6 shadow-none text-lg hover:bg-[#E6E6FF]"
                onClick={() => handleButtonClick('uploadStatements')}
              >
                <PlusCircle className="font-bold mr-2" />{' '}
                {translate(
                  'components.buttons.expense_buttons.text.upload_statements'
                )}
              </Button>

              <CreateRuleModal origin="expense-page" />
              <Button className="bg-transparent border-none py-6 shadow-none text-lg hover:bg-[#E6E6FF]">
                <CircleEllipsis className="font-bold mr-2" />
                More
              </Button>
              {selectedIds.length > 0 && (
                <Button
                  onClick={() => handleButtonClick('deleteRows', selectedIds)}
                  className="text-[#FF6347] px-0 py-6 hover:bg-transparent  bg-transparent shadow-none hover:text-[#D94F33]"
                >
                  <IoMdTrash
                    color="#FF6347"
                    size={24}
                    className="hover:text-[#D94F33]"
                  />
                  ({selectedIds.length})
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="bg-white absolute z-50">
          <SharedModal
            open={isModalOpen}
            onOpenChange={setModalOpen}
            customClassName={cn(
              modalContent.key !== 'confirmation' && 'max-w-[650px]'
            )}
          >
            <div className="bg-white">{renderContent()}</div>
          </SharedModal>
        </div>
      </div>
    </div>
  );
}

export default ExpenseOverviewHeading;
