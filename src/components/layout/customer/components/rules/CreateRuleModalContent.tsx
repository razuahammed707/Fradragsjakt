import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';
import { UpdateRuleProps } from '@/types/questionnaire';
import { Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
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
      expense_type: 'business',
      category: updateRulePayload?.category_title || '',
    },
    mode: 'onChange',
  });

  const { translate } = useTranslation();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);

  const { mainCategories } = useManipulatedCategories();

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
      <h1 className="font-medium text-2xl text-black mb-4">
        {!origin ? 'Create a rule' : 'Update rule'}
      </h1>
      <h1 className="font-medium text-lg text-black mb-4">
        {translate('componentsRuleModal.rule.if')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div>
          <Label htmlFor="description_contains">
            {translate('componentsRuleModal.rule.descriptionContains')}
          </Label>
          <FormInput
            type="text"
            name="description_contains"
            id="description_contains"
            placeholder={translate(
              'componentsRuleModal.rule.descriptionContains'
            )}
            control={control}
            customClassName="w-full mt-2"
            defaultValue={updateRulePayload?.description_contains}
            required
          />
        </div>
        <h1 className="font-medium text-lg text-black mb-4">
          {translate('componentsRuleModal.rule.then')}
        </h1>
        <div>
          <Label htmlFor="expense_type">Type</Label>
          <FormInput
            name="expense_type"
            id="expense_type"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder={translate('componentsRuleModal.rule.selectType')}
            options={[
              { title: 'Deductible', value: 'business' },
              {
                title: translate('componentsRuleModal.rule.personal'),
                value: 'personal',
              },
            ]}
            required
          />
        </div>
        <div>
          <Label htmlFor="category">
            {translate('componentsRuleModal.rule.category')}
          </Label>
          <ScrollArea className="w-full rounded-md">
            <SelectFormInput
              name="category"
              control={control}
              customClassName="w-full mt-2"
              placeholder={translate('componentsRuleModal.rule.selectCategory')}
              defaultValue={updateRulePayload?.category_title}
              options={mainCategories}
              required
            />
          </ScrollArea>
        </div>

        <div className="py-3">
          <Button
            type="submit"
            className="w-full text-white"
            disabled={!isValid || loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!origin
              ? translate('componentsRuleModal.rule.create')
              : translate('componentsRuleModal.rule.update')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateRuleModalContent;
