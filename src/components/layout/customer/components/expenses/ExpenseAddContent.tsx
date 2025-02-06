import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput'; // Import the SelectFormInput
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { PayloadType } from './ExpenseUpdateModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { getSubCategories } from '@/utils/helpers/getSubCategories';
import { FormReceiptInput } from '@/components/FormReceiptInput';

export type FormData = {
  description: string;
  expense_type: 'unknown' | 'personal' | 'business';
  category: string; // Ensure this is a string
  deduction_status: string;
  amount: string;
  receipt: {
    link: string;
    mimeType: string;
  };
};

type CategoryType = { title: string; value: string };

interface ExpenseAddContentProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  categories?: CategoryType[];
  payload?: PayloadType;
  origin?: string;
}

function ExpenseAddContent({
  setModalOpen,
  origin,
  payload,
}: ExpenseAddContentProps) {
  const { translate } = useTranslation();
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { isValid },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const [subCategoryOptions, setSubCategoryOptions] = useState<
    { answer: string }[]
  >([]);
  const utils = trpc.useUtils();

  const selectedCategory = watch('category');
  //const query = { category_for: 'expense' };
  const { mainCategories, secondaryCategories } = useManipulatedCategories(); //query was used to call

  const createMutation = trpc.expenses.createExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      toast.success(
        translate('componentsExpenseModal.expense.toast.create_success'),
        { duration: 4000 }
      );
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(
        error.message ||
          translate('componentsExpenseModal.expense.toast.create_failure')
      );
      setLoading(false);
    },
  });
  const updateMutation = trpc.expenses.updateExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      toast.success(
        translate('componentsExpenseModal.expense.toast.update_success'),
        { duration: 4000 }
      );
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(
        error.message ||
          translate('componentsExpenseModal.expense.toast.update_failure')
      );
      setLoading(false);
    },
  });

  useEffect(() => {
    if (selectedCategory) {
      const subCategories = getSubCategories(selectedCategory);
      setSubCategoryOptions(subCategories);
    } else {
      setSubCategoryOptions([]);
    }
  }, [selectedCategory]);

  const onSubmit = (data: FormData) => {
    const modifiedAmount =
      typeof data?.amount === 'number'
        ? data.amount
        : Number(data?.amount?.replace(/\s+/g, '').replace(',', '.') || 0);

    setLoading(true);
    if (origin) {
      updateMutation.mutate({
        id: payload?._id,
        ...data,
        amount: modifiedAmount,
      });
    } else
      createMutation.mutate({
        ...data,
        amount: modifiedAmount,
      });
  };

  return (
    <div>
      <h1 className="font-medium text-lg text-black mb-4">
        {origin === 'expense update'
          ? translate('componentsExpenseModal.expense.heading.update_expense')
          : translate('componentsExpenseModal.expense.heading.add_expense')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[500px] overflow-y-auto space-y-1 pr-1 white-thumb">
          {['description', 'amount'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === 'description'
                  ? translate(
                      'componentsExpenseModal.expense.label.description'
                    )
                  : translate('componentsExpenseModal.expense.label.amount')}
              </Label>
              <FormInput
                type={field === 'amount' ? 'number' : 'text'}
                name={field}
                defaultValue={
                  field === 'amount' ? payload?.amount : payload?.description
                }
                placeholder={
                  field === 'description'
                    ? 'Enter description'
                    : 'Enter amount (NOK)'
                }
                disabled={field === 'amount' && origin === 'expense update'}
                control={control}
                customClassName="w-full mt-2"
                required
              />
            </div>
          ))}
          <div>
            <Label htmlFor="expense_type">
              {translate('componentsExpenseModal.expense.label.expense_type')}
            </Label>
            <FormInput
              name="expense_type"
              defaultValue={payload?.expense_type}
              customClassName="w-full mt-2"
              type="select"
              control={control}
              placeholder="Select expense type"
              options={[
                { title: 'Deductible', value: 'business' },
                { title: 'Personal', value: 'personal' },
                { title: 'Unknown', value: 'unknown' },
              ]}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">
              {translate(
                'componentsExpenseModal.expense.label.category',
                'category'
              )}
            </Label>
            <SelectFormInput
              name="category"
              control={control}
              placeholder="Select category"
              options={mainCategories?.map((category) => ({
                title: category.title,
                value: category.value,
              }))}
              defaultValue={payload?.category || ''}
              required
            />
          </div>
          <div>
            <Label htmlFor="sub_category">Sub Category</Label>
            <SelectFormInput
              name="sub_category"
              control={control}
              customClassName="w-full mt-2"
              placeholder="Select sub-category"
              defaultValue={payload?.sub_category}
              options={subCategoryOptions.map((q) => ({
                title: q.answer,
                value: q.answer,
              }))}
            />
          </div>
          <div>
            <Label htmlFor="sub_category">Category Tag</Label>
            <SelectFormInput
              name="tag_category"
              control={control}
              customClassName="w-full mt-2"
              placeholder="Select as Tag"
              defaultValue={payload?.tag_category}
              options={secondaryCategories}
              searchEnabled
            />
          </div>
          <div>
            <Label htmlFor="sub_category">Reciept</Label>
            <FormReceiptInput
              name="receipt"
              defaultValue={payload?.receipt?.link}
              includeMimeType
              setValue={(
                name: string,
                value: string | { link: string; mimeType: string }
              ) => {
                setValue(name as any, value as any);
              }}
              customClassName="mt-2"
            />
          </div>
        </div>
        <Button
          disabled={!isValid || loading}
          type="submit"
          className="w-full text-white"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {origin === 'expense update'
            ? translate('componentsExpenseModal.expense.button.update')
            : translate('componentsExpenseModal.expense.button.add')}{' '}
          {translate('componentsExpenseModal.expense.button.expense')}
        </Button>
      </form>
    </div>
  );
}

export default ExpenseAddContent;
