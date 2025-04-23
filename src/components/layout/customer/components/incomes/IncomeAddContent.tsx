import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/forms/SelectFormInput'; // Import the SelectFormInput
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useTranslation } from '@/lib/TranslationProvider';
import { PayloadType } from './IncomeUpdateModal';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { getSubCategories } from '@/utils/helpers/getSubCategories';
import { FormReceiptInput } from '@/components/FormReceiptInput';

export type FormData = {
  description: string;
  income_type: 'unknown' | 'personal' | 'business';
  category: string;
  deduction_status: string;
  amount: string;
  receipt: {
    link: string;
    mimeType: string;
  };
};

interface IncomeAddContentProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  payload?: PayloadType;
  origin?: string;
}

function IncomeAddContent({
  setModalOpen,
  origin,
  payload,
}: IncomeAddContentProps) {
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
  //const query = { category_for: 'income' };
  const { mainCategories, manipulatedCategories } = useManipulatedCategories(); //query was used to call

  const createMutation = trpc.incomes.createIncome.useMutation({
    onSuccess: () => {
      utils.incomes.getIncomes.invalidate();
      utils.incomes.getCategoryAndIncomeTypeWiseIncomes.invalidate();
      toast.success(
        translate('componentsIncomeModal.income.toast.create_success'),
        { duration: 4000 }
      );
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(
        error.message ||
          translate('componentsIncomeModal.income.toast.create_failure')
      );
      setLoading(false);
    },
  });
  const updateMutation = trpc.incomes.updateIncome.useMutation({
    onSuccess: () => {
      utils.incomes.getIncomes.invalidate();
      utils.incomes.getCategoryAndIncomeTypeWiseIncomes.invalidate();
      toast.success(
        translate('componentsIncomeModal.income.toast.update_success'),
        { duration: 4000 }
      );
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      console.log({ error });

      toast.error(
        error.message ||
          translate('componentsIncomeModal.income.toast.update_failure')
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
        {origin === 'income update'
          ? translate('componentsIncomeModal.income.heading.update_income')
          : translate('componentsIncomeModal.income.heading.add_income')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="max-h-[500px] space-y-1 overflow-y-auto pr-1 white-thumb">
          {['description', 'amount'].map((field) => (
            <div key={field}>
              <Label htmlFor={field}>
                {field === 'description'
                  ? translate('componentsIncomeModal.income.label.description')
                  : translate('componentsIncomeModal.income.label.amount')}
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
                disabled={field === 'amount' && origin === 'income update'}
                control={control}
                customClassName="w-full mt-2"
                required
              />
            </div>
          ))}
          <div>
            <Label htmlFor="income_type">
              {translate('componentsIncomeModal.income.label.income_type')}
            </Label>
            <SelectFormInput
              name="income_type"
              defaultValue={payload?.income_type}
              customClassName="w-full mt-2"
              control={control}
              placeholder="Select income type"
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
              {translate('componentsIncomeModal.income.label.category')}
            </Label>
            <SelectFormInput
              name="category"
              control={control}
              placeholder="Select category"
              customClassName="mt-2"
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
              options={manipulatedCategories}
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
          {origin === 'income update'
            ? translate('componentsIncomeModal.income.button.update')
            : translate('componentsIncomeModal.income.button.add')}{' '}
        </Button>
      </form>
    </div>
  );
}

export default IncomeAddContent;
