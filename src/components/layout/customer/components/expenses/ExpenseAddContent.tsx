import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { PayloadType } from './ExpenseUpdateModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { getSubCategories } from '@/utils/helpers/getSubCategories';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExpenseFormData, ExpenseFormSchema } from '@/types/expense-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DependantKeys } from '@/utils/constants/DependantKeys';
import { getDefaultValue, getInputType } from '@/utils/helpers/getDefaultValue';
import { transformFormDataToPayload } from '@/utils/helpers/transformFormDataAsPayload';

interface ExpenseAddContentProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
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
    watch,
    setValue,
    formState: {
      /* isValid */
    },
    reset,
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      expense_type: 'business',
      category: payload?.category || '',
      sub_category: payload?.sub_category || '',
      tag_category: payload?.tag_category || '',
      receipt: payload?.receipt || { link: '', mimeType: '' },
    },
    mode: 'onChange',
  });
  const [loading, setLoading] = useState(false);
  const [subCategoryOptions, setSubCategoryOptions] = useState<
    { answer: string }[]
  >([]);
  const utils = trpc.useUtils();
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const selectedCategory = watch('category');
  const selectedSubCategory = watch('sub_category');

  const { mainCategories, secondaryCategories } = useManipulatedCategories();

  useEffect(() => {
    if (selectedCategory) {
      const subCategories = getSubCategories(selectedCategory);
      setSubCategoryOptions(subCategories);
    } else {
      setSubCategoryOptions([]);
    }
  }, [selectedCategory]);

  const shouldShowDependantField =
    selectedSubCategory !== '' && DependantKeys[selectedSubCategory || ''];
  const dependantKey = DependantKeys[selectedSubCategory || ''];
  const inputType = getInputType(dependantKey || '');

  const createMutation = trpc.expenses.createExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      toast.success(
        translate('componentsExpenseModal.expense.toast.create_success')
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
        translate('componentsExpenseModal.expense.toast.update_success')
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

  const updateQuestionnaires = trpc.users.updateUserQuestionnaires.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || 'User questionnaires updation failed!');
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    setLoading(true);

    if (data.sub_category && data.sub_category_dependant) {
      const questionnaireFormData = {
        [data.sub_category]: {
          [DependantKeys[data.sub_category]]: data.sub_category_dependant,
        },
      };

      const payload = transformFormDataToPayload(
        data.category,
        questionnaireFormData
      );
      updateQuestionnaires.mutate(payload);
    }

    const modifiedAmount =
      typeof data?.amount === 'number'
        ? data.amount
        : Number(
            data?.amount?.toString().replace(/\s+/g, '').replace(',', '.') || 0
          );

    const expenseData = {
      ...data,
      amount: modifiedAmount,
      sub_category_dependant: undefined,
    };

    if (origin === 'expense update' && payload?._id) {
      updateMutation.mutate({
        id: payload._id,
        ...expenseData,
      });
    } else {
      createMutation.mutate(expenseData);
    }
  };

  const renderDependantField = () => {
    if (!shouldShowDependantField) return null;

    return (
      <div>
        <Label htmlFor="sub_category_dependant">
          {inputType === 'percentage'
            ? `${DependantKeys[selectedSubCategory || '']} [in percentage]`
            : DependantKeys[selectedSubCategory || '']}
        </Label>
        {inputType === 'number' && (
          <FormInput
            type="number"
            name="sub_category_dependant"
            id="sub_category_dependant"
            placeholder={dependantKey}
            control={control}
            customClassName="w-full mt-2"
            defaultValue={getDefaultValue(
              user,
              payload?.category || '',
              payload?.sub_category || '',
              dependantKey
            )}
            maxValue
            noFraction
            required
          />
        )}
        {inputType === 'boolean' && (
          <FormInput
            type="select"
            name="sub_category_dependant"
            id="sub_category_dependant"
            placeholder={dependantKey}
            control={control}
            customClassName="w-full mt-2"
            defaultValue={getDefaultValue(
              user,
              payload?.category || '',
              payload?.sub_category || '',
              dependantKey
            )}
            options={[
              { title: 'Yes', value: 'yes' },
              { title: 'No', value: 'no' },
            ]}
            required
          />
        )}
        {inputType === 'percentage' && (
          <FormInput
            type="number"
            name="sub_category_dependant"
            id="sub_category_dependant"
            placeholder={`${dependantKey} (%)`}
            control={control}
            customClassName="w-full mt-2"
            defaultValue={getDefaultValue(
              user,
              payload?.category || '',
              payload?.sub_category || '',
              dependantKey
            )}
            maxValue
            required
          />
        )}
      </div>
    );
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
          <div>
            <Label htmlFor="description">
              {translate('componentsExpenseModal.expense.label.description')}
            </Label>
            <FormInput
              type="text"
              name="description"
              defaultValue={payload?.description}
              placeholder="Enter description"
              control={control}
              customClassName="w-full mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="amount">
              {translate('componentsExpenseModal.expense.label.amount')}
            </Label>
            <FormInput
              type="number"
              name="amount"
              defaultValue={payload?.amount}
              placeholder="Enter amount (NOK)"
              disabled={origin === 'expense update'}
              control={control}
              customClassName="w-full mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="expense_type">
              {translate('componentsExpenseModal.expense.label.expense_type')}
            </Label>
            <FormInput
              name="expense_type"
              customClassName="w-full mt-2"
              type="select"
              control={control}
              placeholder="Select expense type"
              options={[
                { title: 'Deductible', value: 'business' },
                { title: 'Personal', value: 'personal' },
              ]}
              required
            />
          </div>
          <div>
            <Label htmlFor="category">
              {translate('componentsExpenseModal.expense.label.category')}
            </Label>
            <ScrollArea className="w-full rounded-md">
              <SelectFormInput
                name="category"
                control={control}
                placeholder="Select category"
                options={mainCategories}
                defaultValue={payload?.category}
                required
              />
            </ScrollArea>
          </div>
          <div>
            <Label htmlFor="sub_category">Sub Category</Label>
            <SelectFormInput
              name="sub_category"
              control={control}
              customClassName="w-full mt-2"
              placeholder="Select sub-category"
              defaultValue={payload?.sub_category}
              options={[
                ...subCategoryOptions.map((q) => ({
                  title: q.answer,
                  value: q.answer,
                })),
                { title: 'Others', value: 'other' },
              ]}
            />
          </div>
          {renderDependantField()}
          <div>
            <Label htmlFor="tag_category">Category Tag</Label>
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
            <Label htmlFor="receipt">Receipt</Label>
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
          //disabled={!isValid || loading}
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
