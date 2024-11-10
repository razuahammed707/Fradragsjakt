// import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export type FormData = {
  description: string;
  expense_type: 'unknown' | 'personal' | 'business';
  category: string;
  deduction_status: string;
  amount: number;
};
const defaultCategories = [
  { title: 'Transport', value: 'Transport' },
  { title: 'Meals', value: 'Meals' },
  { title: 'Gas', value: 'Gas' },
];

type CategoryType = { title: string; value: string };

interface ExpenseAddContentProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  categories?: CategoryType[];
}
function ExpenseAddContent({
  categories = [],
  setModalOpen,
}: ExpenseAddContentProps) {
  const { handleSubmit, control, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();

  const manipulatedCategories = Array.from(
    new Map(
      [...categories, ...defaultCategories].map((cat) => [cat.value, cat])
    ).values()
  );

  const mutation = trpc.expenses.createExpense.useMutation({
    onSuccess: () => {
      toast.success('Expense created successfully!', {
        duration: 4000,
      });
      utils.expenses.getExpenses.invalidate();
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expense');
      setLoading(false);
    },
  });
  const onSubmit = (data: FormData) => {
    console.log('expense_data', data);

    setLoading(true);
    mutation.mutate({ ...data, amount: Number(data?.amount) });
  };
  return (
    <div>
      <h1 className="font-bold text-xl text-[#5B52F9] mb-4">
        Manually add expense
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="description">Description</Label>
          <FormInput
            type="text"
            name="description"
            placeholder="Description"
            control={control}
            customClassName="w-full mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="expense-type">Expense type</Label>
          <FormInput
            name="expense_type"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder="Select type"
            options={[
              { title: 'Business', value: 'business' },
              { title: 'Personal', value: 'personal' },
              { title: 'Unknown', value: 'unknown' },
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
            options={manipulatedCategories}
            required
          />
        </div>
        <div>
          <Label htmlFor="description">Amount</Label>
          <FormInput
            type="number"
            name="amount"
            placeholder="Amount"
            control={control}
            customClassName="w-full mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="category">Deduction status</Label>
          <FormInput
            name="deduction_status"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder="Select status"
            options={[
              { title: 'Deductible', value: 'deductible' },
              { title: 'Non Deductible', value: 'non-deductible' },
            ]}
            required
          />
        </div>
        <div className="py-3">
          <Button
            disabled={loading}
            type="submit"
            className="w-full text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Expense
          </Button>
          <Button className="w-full bg-[#F0EFFE] text-[#FF4444] hover:bg-[#F0EFFE] mt-3">
            Discard
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseAddContent;
