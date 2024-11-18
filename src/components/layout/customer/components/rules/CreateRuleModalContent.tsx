import { Button } from '@/components/ui/button';
import React from 'react';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

// Define the form data type to match the expected fields
type RuleFormData = {
  description_contains: string;
  expense_type: 'business' | 'personal';
  category: string;
};

type UpdateRuleProps = {
  _id: string;
  description_contains: string;
  category: string;
  category_title: string;
  expense_type: string;
};

type CategoryType = { title: string; value: string };

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  updateRulePayload?: UpdateRuleProps;
  origin: string | undefined;
};

function CreateRuleModalContent({
  modalClose,
  categories = [],
  updateRulePayload,
  origin,
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

  const ruleUpdateMutation = trpc.rules.updateRule.useMutation({
    onSuccess: () => {
      toast.success('Rule is updated successfully');
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
    if (origin && updateRulePayload) {
      ruleUpdateMutation.mutate({ _id: updateRulePayload?._id, ...data });
    } else {
      ruleMutation.mutate(data);
    }
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
      <h1 className="font-bold text-xl text-[#5B52F9] mb-4">IF</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="description_contains">Description contain</Label>
          <FormInput
            type="text"
            name="description_contains"
            placeholder="Description contain"
            control={control}
            customClassName="w-full mt-2"
            defaultValue={updateRulePayload?.description_contains}
            required
          />
        </div>

        <h1 className="font-bold text-xl text-[#5B52F9] mb-4">Then</h1>
        <div>
          <Label htmlFor="expense_type">Expense type</Label>
          <FormInput
            name="expense_type"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            defaultValue={updateRulePayload?.expense_type}
            placeholder="Select type"
            options={[
              { title: 'Business', value: 'business' },
              { title: 'Personal', value: 'personal' },
            ]}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Category</Label>
          <FormInput
            name="category"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder="Select category"
            defaultValue={updateRulePayload?.category_title}
            options={manipulatedCategories}
            required
          />
        </div>

        <div className="py-3">
          <Button type="submit" className="w-full text-white">
            {!origin ? 'Create' : 'Update'}
          </Button>
          <Button
            type="button" // Change to button to avoid form submission
            className="w-full bg-[#F0EFFE] text-[#FF4444] hover:bg-[#F0EFFE] mt-3"
            onClick={() => modalClose && modalClose(false)} // Close modal on discard
          >
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateRuleModalContent;
