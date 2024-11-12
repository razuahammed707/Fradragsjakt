/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SharedDataTable } from '@/components/SharedDataTable';
import { ApplyRuleModalContentTableColumns } from './ApplyRuleModalContentTableColumns';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type CategoryType = { title: string; value: string };
type ExpensesType = {
  expenses: {
    [x: string]: any;
    [x: number]: any;
  }[];
  expensePayload: {
    expense_type?: any;
    category?: any;
    rule?: any;
  };
  rule?: any;
};

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  expenses?: ExpensesType[];
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};

function ApplyRuleModalContent({
  expenses,
  setModalOpen,
}: ExpenseRuleContentProps) {
  const [selectedRule, setSelectedRule] = useState<string>(
    expenses?.[0]?.rule || ''
  );
  const selectedRuleData = expenses?.find((exp) => exp.rule === selectedRule);

  const utils = trpc.useUtils();

  const mutation = trpc.expenses.updateBulkExpense.useMutation({
    onSuccess: () => {
      toast.success('Expenses upadted successfully!', {
        duration: 4000,
      });
      utils.expenses.getExpenses.invalidate();
      setModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expenses');
    },
  });

  const handleApplyRule = () => {
    const expenses = selectedRuleData?.expenses?.map((expense) => {
      return {
        expenseUpdatePayload: selectedRuleData?.expensePayload,
        _id: expense?._id,
      };
    });
    console.log({ expenses });
    if (!expenses) return;
    mutation.mutate({ expenses: expenses });
  };
  return (
    <div className="space-y-8">
      <h1 className="font-bold text-xl text-[#5B52F9] mt-6 mb-8">
        Available rules that can be applied to the following expenses
      </h1>
      <div className="flex flex-wrap gap-2">
        {expenses?.map((expenseRule) => (
          <Badge
            key={expenseRule.rule}
            className={`rounded-[28px] py-1 cursor-pointer ${
              selectedRule === expenseRule.rule
                ? 'bg-[#5B52F9] text-white'
                : 'bg-[#EEF0F4] text-[#5B52F9]'
            }`}
            onClick={() => setSelectedRule(expenseRule.rule)}
          >
            {expenseRule.rule}{' '}
            <span className="ms-1">({expenseRule.expenses.length})</span>
          </Badge>
        ))}
      </div>
      <SharedDataTable
        className="max-h-[250px]"
        columns={ApplyRuleModalContentTableColumns}
        data={selectedRuleData?.expenses || []}
      />
      <Button
        onClick={handleApplyRule}
        type="button"
        className="w-full text-white"
      >
        Apply Rule
      </Button>
    </div>
  );
}

export default ApplyRuleModalContent;
