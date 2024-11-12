/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SharedDataTable } from '@/components/SharedDataTable';
import { ApplyRuleModalContentTableColumns } from './ApplyRuleModalContentTableColumns';
import { Button } from '@/components/ui/button';
/* import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast'; */

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
};

function ApplyRuleModalContent({ expenses }: ExpenseRuleContentProps) {
  const [selectedRule, setSelectedRule] = useState<string>(
    expenses?.[0]?.rule || ''
  );
  //const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  //const utils = trpc.useUtils();

  /* const mutation = trpc.expenses.updateBulkExpense.useMutation({
    onSuccess: () => {
      toast.success('Expenses upadted successfully!', {
        duration: 4000,
      });
      utils.expenses.getExpenses.invalidate();
      setIsModalOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expenses');
    },
  }); */
  const selectedRuleData = expenses?.find((exp) => exp.rule === selectedRule);
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
      <Button type="submit" className="w-full text-white">
        Apply Update
      </Button>
    </div>
  );
}

export default ApplyRuleModalContent;
