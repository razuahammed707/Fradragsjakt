import React from 'react';
import { Badge } from '@/components/ui/badge';
import { SharedDataTable } from '@/components/SharedDataTable';
import { transactions } from '@/utils/dummy';
import { ApplyRuleModalContentTableColumns } from './ApplyRuleModalContentTableColumns';
import { Button } from '@/components/ui/button';

/* type RuleFormData = {
  description_contains: string;
  expense_type: 'business' | 'personal';
  category: string;
}; */

type CategoryType = { title: string; value: string };

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  expenses?: [];
};

function ApplyRuleModalContent(
  {
    /*  modalClose,
  categories = [], */
  }: ExpenseRuleContentProps
) {
  /*   const utils = trpc.useUtils();
   */ /*  const ruleMutation = trpc.rules.createRule.useMutation({
    onSuccess: () => {
      toast.success('Rule created successfully');
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate(); // Invalidate and refetch getRules query
    },
    onError: (error) => {
      toast.error(error.message);
    },
  }); */

  /*  const onSubmit = (data: RuleFormData) => {
    ruleMutation.mutate(data);
  }; */

  /*   const defaultCategories = [
    { title: 'Transport', value: 'Transport' },
    { title: 'Meals', value: 'Meals' },
    { title: 'Gas', value: 'Gas' },
  ]; */

  /* const manipulatedCategories = Array.from(
    new Map(
      [...categories, ...defaultCategories].map((cat) => [cat.value, cat])
    ).values()
  ); */

  return (
    <div className="space-y-4">
      <h1 className="font-bold text-xl text-[#5B52F9] mb-6">
        There are the available expenses to matched with the Rules
      </h1>
      <div className="grid grid-cols-12 gap-3">
        {[...Array(10)].map((_, i) => (
          <Badge
            key={i}
            className="col-span-2 rounded-[28px] py-1 bg-[#EEF0F4]  flex  justify-center   text-[#5B52F9]"
          >
            Rule{i + 1} <span className="ms-1">(1)</span>
          </Badge>
        ))}
      </div>
      <SharedDataTable
        className="max-h-[250px]  "
        columns={ApplyRuleModalContentTableColumns}
        data={transactions}
      />
      <Button type="submit" className="w-full text-white">
        Apply Update
      </Button>
    </div>
  );
}

export default ApplyRuleModalContent;
