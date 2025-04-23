import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/forms/FormInput';
import { SelectFormInput } from '@/components/forms/SelectFormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { UpdateRuleProps } from '@/types/questionnaire';
import { Loader2 } from 'lucide-react';
import { RuleFormData, RuleFormSchema } from '@/types/rule-form';
import { zodResolver } from '@hookform/resolvers/zod';

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  updateRulePayload?: UpdateRuleProps;
  origin: string | undefined;
};

function CreateRuleModalContent({
  modalClose,
  updateRulePayload,
  origin,
}: ExpenseRuleContentProps) {
  const {
    handleSubmit,
    control,
    formState: { isValid },
    reset,
  } = useForm<RuleFormData>({
    resolver: zodResolver(RuleFormSchema),
    defaultValues: {
      expense_type: updateRulePayload?.expense_type,
      category: updateRulePayload?.category_title || '',
    },
    mode: 'onChange',
  });

  const { translate } = useTranslation();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);

  const { manipulatedCategories } = useManipulatedCategories();

  const ruleMutation = trpc.rules.createAndApplyRule.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message || translate('toast.ruleCreatedSuccess'));
      setLoading(false);
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate();
      utils.expenses.getExpenses.invalidate();
      utils.incomes.getIncomes.invalidate();
      utils.expenses.getWriteOffs.invalidate();
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const ruleUpdateMutation = trpc.rules.updateAndApplyRule.useMutation({
    onSuccess: ({ message }) => {
      toast.success(message || translate('toast.ruleUpdatedSuccess'));
      setLoading(false);
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate();
      utils.expenses.getExpenses.invalidate();
      utils.incomes.getIncomes.invalidate();
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const onSubmit = (data: RuleFormData) => {
    setLoading(true);

    const ruleMutationData = {
      ...data,
    };

    if (origin && updateRulePayload) {
      ruleUpdateMutation.mutate({
        _id: updateRulePayload?._id,
        ...ruleMutationData,
      });
    } else {
      ruleMutation.mutate(ruleMutationData);
    }
  };

  return (
    <div>
      <h1 className="font-medium text-xl text-black mb-3">
        {!origin
          ? 'Create a rule'
          : origin === 'expense-page'
            ? 'Create a rule'
            : 'Update a rule'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <h2 className="font-medium text-lg text-black">
          {translate('componentsRuleModal.rule.if')}
        </h2>
        <div>
          <Label htmlFor="merchant_name">Merchant name</Label>
          <FormInput
            type="text"
            name="description_contains"
            id="merchant_name"
            placeholder="e.g. Netflix"
            control={control}
            customClassName="w-full mt-1"
            defaultValue={updateRulePayload?.description_contains}
            required
          />
        </div>
        <h2 className="font-medium text-lg text-black pt-4">
          {translate('componentsRuleModal.rule.then')}
        </h2>
        <div>
          <Label htmlFor="expense_type">Status</Label>
          <SelectFormInput
            name="expense_type"
            customClassName="w-full mt-1"
            control={control}
            defaultValue={updateRulePayload?.expense_type}
            placeholder={translate('componentsRuleModal.rule.selectType')}
            options={[
              {
                title: 'Essential Expense (e.g. Job, School, or Project)',
                value: 'business',
              },
              {
                title:
                  'Everyday Spending (e.g. Groceries, Fuel for personal use )',
                value: 'personal',
              },
              {
                title: 'Ask me',
                value: 'unknown',
              },
            ]}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">
            {translate('componentsRuleModal.rule.category')}
          </Label>
          <SelectFormInput
            name="category"
            control={control}
            customClassName="w-full mt-1"
            placeholder={translate('componentsRuleModal.rule.selectCategory')}
            defaultValue={updateRulePayload?.category_title}
            options={manipulatedCategories}
            required
            searchEnabled
          />
        </div>

        <div className="py-3">
          <Button
            type="submit"
            className="w-full text-white"
            disabled={!isValid || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {/* {!origin
              ? translate('componentsRuleModal.rule.create')
              : translate('componentsRuleModal.rule.update')} */}
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateRuleModalContent;
