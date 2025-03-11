import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput';
import { FormProvider, useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { PayloadType } from './ExpenseUpdateModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { FormReceiptInput } from '@/components/FormReceiptInput';
import { ExpenseFormData, ExpenseFormSchema } from '@/types/expense-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DatePickerFormInput } from '@/components/DatePickerFormInput';

interface ExpenseAddContentProps {
  origin?: string;
  setModalOpen: (open: boolean) => void;
  payload?: PayloadType;
  onSuccess?: () => void;
  hideFields?: string[];
}

function ExpenseAddContent({
  setModalOpen,
  origin,
  payload,
  onSuccess,
  hideFields = [],
}: ExpenseAddContentProps) {
  const { translate } = useTranslation();
  const methods = useForm<ExpenseFormData>({
    resolver: zodResolver(ExpenseFormSchema),
    defaultValues: {
      category: payload?.category || '',
      receipt: payload?.receipt || { link: '', mimeType: '' },
      description: payload?.description || '',
      transaction_date: payload?.transaction_date
        ? new Date(payload.transaction_date)
        : new Date(),
      amount: payload?.amount?.toString() || '',
      note: payload?.note || '',
      expense_type:
        (payload?.expense_type as 'business' | 'personal' | 'unknown') ||
        'unknown',
    },
    mode: 'onChange',
  });

  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();
  const { manipulatedCategories } = useManipulatedCategories();

  const createMutation = trpc.expenses.createExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      toast.success(
        translate('componentsExpenseModal.expense.toast.create_success')
      );
      methods.reset();
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
      methods.reset();
      setModalOpen(false);
      setLoading(false);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(
        error.message ||
          translate('componentsExpenseModal.expense.toast.update_failure')
      );
      setLoading(false);
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    setLoading(true);
    const modifiedAmount =
      typeof data?.amount === 'number'
        ? data.amount
        : Number(
            data?.amount?.toString().replace(/\s+/g, '').replace(',', '.') || 0
          );

    const expenseData = {
      ...data,
      amount: modifiedAmount,
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

  return (
    <div>
      <h1 className="font-medium text-lg text-black mb-4">
        {origin === 'expense update'
          ? `${payload?.description} (kr${payload?.amount})`
          : translate('componentsExpenseModal.expense.heading.add_expense')}
      </h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1 white-thumb">
            {origin !== 'expense update' && (
              <div>
                <Label htmlFor="description">
                  {translate(
                    'componentsExpenseModal.expense.label.description'
                  )}
                </Label>
                <FormInput
                  type="text"
                  name="description"
                  defaultValue={payload?.description}
                  placeholder="e.g. Starbucks"
                  control={methods.control}
                  customClassName="w-full mt-1"
                  required
                />
              </div>
            )}

            {!hideFields.includes('transaction_date') && (
              <div>
                <DatePickerFormInput
                  name="transaction_date"
                  label="Date"
                  control={methods.control}
                  defaultValue={
                    (payload?.transaction_date &&
                      new Date(payload?.transaction_date)) ||
                    undefined
                  }
                  customClassName="w-full"
                  required
                />
              </div>
            )}

            {!hideFields.includes('amount') && (
              <div>
                <Label htmlFor="amount">
                  {translate('componentsExpenseModal.expense.label.amount')}
                </Label>
                <FormInput
                  type="number"
                  name="amount"
                  defaultValue={payload?.amount?.toString()}
                  placeholder="e.g. kr5.00"
                  disabled={origin === 'expense update'}
                  control={methods.control}
                  customClassName="w-full mt-1"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="category">
                {translate('componentsExpenseModal.expense.label.category')}
              </Label>
              <SelectFormInput
                name="category"
                control={methods.control}
                customClassName="mt-1"
                placeholder="Select category"
                options={manipulatedCategories}
                defaultValue={payload?.category}
                required
                searchEnabled
              />
            </div>
            <div>
              <Label htmlFor="expense_type">Status</Label>
              <SelectFormInput
                name="expense_type"
                customClassName="w-full mt-1"
                control={methods.control}
                placeholder="Select type"
                options={[
                  { title: 'Deduction', value: 'business' },
                  { title: 'Not deductible', value: 'personal' },
                  { title: 'Ask me', value: 'unknown' },
                ]}
                defaultValue={payload?.expense_type}
                required
              />
            </div>
            <div>
              <Label htmlFor="percentage">Percentage</Label>
              <FormInput
                type="number"
                name="percentage"
                defaultValue={payload?.percentage?.toString() ?? ''}
                placeholder="e.g. 50"
                control={methods.control}
                customClassName="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="note">Add a note (optional)</Label>
              <FormInput
                type="textarea"
                name="note"
                defaultValue={payload?.note}
                placeholder="e.g. Meeting with my client Olivier"
                control={methods.control}
                customClassName="w-full mt-1"
              />
            </div>
            <div>
              <Label htmlFor="receipt">Receipt (optional)</Label>
              <FormReceiptInput
                name="receipt"
                defaultValue={payload?.receipt?.link}
                includeMimeType
                setValue={(
                  name: string,
                  value: string | { link: string; mimeType: string }
                ) => {
                  methods.setValue(name as any, value as any);
                }}
                customClassName="mt-1"
              />
            </div>
          </div>
          <Button
            disabled={loading}
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
      </FormProvider>
    </div>
  );
}

export default ExpenseAddContent;
