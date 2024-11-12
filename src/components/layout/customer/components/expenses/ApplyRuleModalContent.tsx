import { Button } from '@/components/ui/button';
import React from 'react';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

// Define the form data type to match the expected fields
type RuleFormData = {
  description_contains: string;
  expense_type: 'business' | 'personal';
  category: string;
};

type CategoryType = { title: string; value: string };

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
};

function ApplyRuleModalContent({
  modalClose,
  categories = [],
}: ExpenseRuleContentProps) {
  const { handleSubmit, control } = useForm<RuleFormData>({
    defaultValues: { expense_type: 'business' }, // Optional default value
  });

  const utils = trpc.useUtils();
  const ruleMutation = trpc.rules.createRule.useMutation({
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
  });

  const onSubmit = (data: RuleFormData) => {
    ruleMutation.mutate(data);
  };

  const defaultCategories = [
    { title: 'Transport', value: 'Transport' },
    { title: 'Meals', value: 'Meals' },
    { title: 'Gas', value: 'Gas' },
  ];

  const manipulatedCategories = Array.from(
    new Map(
      [...categories, ...defaultCategories].map((cat) => [cat.value, cat])
    ).values()
  );

  return (
    <div>
      <h1 className="font-bold text-xl text-[#5B52F9] mb-6">
        There are the available expenses to matched with the Rules
      </h1>
      <div>
        <Badge>wejw</Badge>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid cols-12 grid-flow-col">
          <div className="col-span-3">
            <Label htmlFor="description_contains">Description contain</Label>
            <FormInput
              type="text"
              name="description_contains"
              placeholder="Description contain"
              control={control}
              customClassName="w-full mt-2"
              required
            />
          </div>
          <div className="col-span-3">
            <Label htmlFor="category">Category</Label>
            <FormInput
              name="category"
              customClassName="w-full mt-2"
              type="select"
              control={control}
              placeholder="Select category"
              options={manipulatedCategories}
              required
            />
          </div>
          <div className="col-span-3">
            <Label htmlFor="category">Category</Label>
            <FormInput
              name="category"
              customClassName="w-full mt-2"
              type="select"
              control={control}
              placeholder="Select category"
              options={manipulatedCategories}
              required
            />
          </div>

          <div className="col-span-3">
            <Label htmlFor="expense_type">Expense type</Label>
            <FormInput
              name="expense_type"
              customClassName="w-full mt-2"
              type="select"
              control={control}
              placeholder="Select type"
              options={[
                { title: 'Business', value: 'business' },
                { title: 'Personal', value: 'personal' },
              ]}
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full text-white">
          Apply update
        </Button>
      </form>
    </div>
  );
}

export default ApplyRuleModalContent;
