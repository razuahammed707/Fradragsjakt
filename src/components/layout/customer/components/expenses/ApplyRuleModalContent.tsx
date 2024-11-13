import React, { Dispatch, SetStateAction, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { SharedDataTable } from '@/components/SharedDataTable';
import { ApplyRuleModalContentTableColumns } from './ApplyRuleModalContentTableColumns';
import { Button } from '@/components/ui/button';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import RuleSelectInput from '@/components/layout/customer/components/expenses/RuleSelectInput';

type CategoryType = { title: string; value: string };

export type RuleType = {
  _id: string;
  description_contains: string;
  expense_type: string;
  category_title: string;
  category: string;
  user: string;
};

type ExpensePayloadType = {
  expense_type: string;
  category: string;
  rule: string;
};

type ExpenseType = {
  _id: string;
  description: string;
  amount: number;
  category: string;
  expense_type: string;
};

type ExpenseWithRulesType = {
  expenses: ExpenseType[];
  expensePayload: ExpensePayloadType;
  rule: string;
};

interface ExpenseRuleContentProps {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  expenses: {
    expensesWithRules: ExpenseWithRulesType[];
    rules: RuleType[];
  };
  setModalOpen: Dispatch<SetStateAction<boolean>>;
}

function ApplyRuleModalContent({
  expenses: { expensesWithRules, rules },
  setModalOpen,
}: ExpenseRuleContentProps) {
  const [selectedRule, setSelectedRule] = useState<string>(
    expensesWithRules[0]?.rule || ''
  );
  const [selectedInput, setSelectedInput] = useState<string>(
    expensesWithRules[0]?.rule || ''
  );

  const selectedRuleData = expensesWithRules.find(
    (exp) => exp.rule === selectedRule
  );

  const utils = trpc.useUtils();

  const handleRuleChange = (value: string) => {
    setSelectedInput(value);
    const filteredExpenses = expensesWithRules?.filter(
      (item) => item?.rule === value
    );

    if (filteredExpenses?.length > 0) {
      setSelectedRule(value);
    }
  };
  const handleRuleClick = (rule: string) => {
    setSelectedRule(rule);
    setSelectedInput(rule);
  };

  const mutation = trpc.expenses.updateBulkExpense.useMutation({
    onSuccess: () => {
      toast.success('Expenses updated successfully!', {
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
    const manipulatedPayload = () => {
      const matchedRule = rules?.find(
        (rule) => rule?.description_contains === selectedInput
      );

      if (matchedRule?._id === selectedRuleData?.expensePayload?.rule)
        return selectedRuleData?.expensePayload;
      else
        return {
          category: matchedRule?.category_title,
          expense_type: matchedRule?.expense_type,
          rule: matchedRule?._id,
        };
    };

    const expenses = selectedRuleData?.expenses?.map((expense) => ({
      expenseUpdatePayload: manipulatedPayload(),
      _id: expense._id,
    }));
    if (!expenses) return;
    mutation.mutate({ expenses });
  };

  return (
    <div className="space-y-8">
      <h1 className="font-bold text-xl text-[#5B52F9] mt-6 mb-8">
        Available rules that can be applied to the following expenses
      </h1>
      <div className="flex flex-wrap gap-2">
        {expensesWithRules.map((expenseRule) => (
          <Badge
            key={expenseRule.rule}
            className={`rounded-[28px] py-1 cursor-pointer ${
              selectedRule === expenseRule.rule
                ? 'bg-[#5B52F9] text-white'
                : 'bg-[#EEF0F4] text-[#5B52F9]'
            }`}
            onClick={() => handleRuleClick(expenseRule.rule)}
          >
            {expenseRule.rule}{' '}
            <span className="ms-1">({expenseRule.expenses.length})</span>
          </Badge>
        ))}
      </div>
      <RuleSelectInput
        rules={rules}
        onChange={handleRuleChange}
        selectedInput={selectedInput}
      />
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
