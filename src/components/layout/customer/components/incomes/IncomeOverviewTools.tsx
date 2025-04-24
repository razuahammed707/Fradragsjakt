'use client';

import React, { useCallback, useState } from 'react';
import SearchInput from '@/components/forms/SearchInput';
import { Button } from '@/components/ui/button';
import { IoMdAdd, IoMdTrash } from 'react-icons/io';
import SharedModal from '@/components/SharedModal';
import ApplyRuleModalContent from './ApplyRuleModalContent';
import { trpc } from '@/utils/trpc';
//import RuleIcon from '../../../../../../public/images/expenses/rule.png';
import { cn, debounce } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';
//import Image from 'next/image';
import IncomeAddContent from './IncomeAddContent';
import IncomeDataTableFilter from './IncomeDataTableFilter';
import useUserInfo from '@/hooks/use-user-info';
import StatementUploadContent from '@/components/StatementUploadContent';
import ConfirmationModalContent from '@/components/ConfirmationModalContent';
import DeleteConfirmationContent from '@/components/DeleteConfirmationContent';

type IncomeOverviewToolsProps = {
  setSearchTerm: (value: string) => void;
  setFilterString: (value: string) => void;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onDeleteComplete?: () => void;
};

function IncomeOverviewTools({
  setSearchTerm,
  setFilterString,
  selectedIds = [],
  onSelectionChange,
  onDeleteComplete,
}: IncomeOverviewToolsProps) {
  const { isAuditor } = useUserInfo();
  const { translate } = useTranslation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    key: string;
    itemIds?: string[];
  }>({
    key: '',
  });
  const { data: incomesWithMatchedRules } =
    trpc.incomes.getUnknownIncomesWithMatchedRules.useQuery(
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
    if (modalContent.key === 'addIncome') {
      return <IncomeAddContent setModalOpen={setModalOpen} />;
    }
    if (modalContent.key === 'applyRule') {
      return (
        <ApplyRuleModalContent
          incomes={incomesWithMatchedRules?.data || []}
          setModalOpen={setModalOpen}
        />
      );
    }
    if (modalContent.key === 'confirmation') {
      return <ConfirmationModalContent setModalOpen={setModalOpen} />;
    }
    if (modalContent.key === 'uploadStatements') {
      return <StatementUploadContent setModalContent={setModalContent} />;
    }
    if (modalContent.key === 'deleteRows') {
      return (
        <DeleteConfirmationContent
          itemOrigin="income"
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
    return null;
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
        {!isAuditor && (
          <SearchInput
            className="hidden md:block"
            onChange={handleSearchChange}
            placeholder={translate(
              'components.incomeOverview.search',
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
              'components.incomeOverview.search',
              'Search'
            )}
          />
        ) : (
          <div className="flex gap-2">
            <Button
              variant="purple"
              onClick={() => handleButtonClick('addIncome')}
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
            {selectedIds.length > 0 && (
              <Button
                onClick={() => handleButtonClick('deleteRows', selectedIds)}
                className="text-[#FF6347]  hover:bg-transparent  bg-transparent shadow-none hover:text-[#D94F33]"
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
        )}
        <div className="flex space-x-2">
          <IncomeDataTableFilter setFilterString={setFilterString} />
          {/* {!isAuditor && (
            <Button
              disabled={
                incomesWithMatchedRules?.data?.incomesWithRules?.length === 0
              }
              variant="purple"
              onClick={() => handleButtonClick('applyRule')}
            >
              <Image src={RuleIcon} alt="button icon" className="mr-2" /> Apply
              Rule
            </Button>
          )} */}
        </div>
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
    </>
  );
}

export default IncomeOverviewTools;
