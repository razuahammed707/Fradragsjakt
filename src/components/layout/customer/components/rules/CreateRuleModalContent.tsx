import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulateCategories';
import { UpdateRuleProps } from '@/types/questionnaire';
import { Loader2 } from 'lucide-react';
import { extended_questionnaires } from '@/lib/questionnaires';

type RuleFormData = {
  description_contains: string;
  expense_type: 'business' | 'personal';
  category: string;
  rule_for: 'expense' | 'income';
  sub_category: string;
};

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
  const { handleSubmit, control, watch, formState, reset } =
    useForm<RuleFormData>({
      defaultValues: {
        expense_type: 'business',
        rule_for: updateRulePayload?.rule_for || 'expense',
        category: updateRulePayload?.category_title || '',
        sub_category: updateRulePayload?.sub_category || '',
      },
      mode: 'onChange',
    });

  const { translate } = useTranslation();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);
  const [subCategoryOptions, setSubCategoryOptions] = useState<
    { answer: string; category: string[] }[]
  >([]);

  const categoryForValue = watch('rule_for');
  const selectedCategory = watch('category');

  const query = {
    category_for: categoryForValue || updateRulePayload?.rule_for,
  };
  const { manipulatedCategories } = useManipulatedCategories(query);

  useEffect(() => {
    if (selectedCategory && categoryForValue) {
      const subCategories = getSubCategories(
        selectedCategory,
        categoryForValue
      );
      setSubCategoryOptions(subCategories);
    } else {
      setSubCategoryOptions([]);
    }
  }, [selectedCategory, categoryForValue]);

  const hasSubCategories = (
    category: string,
    ruleFor: 'expense' | 'income' | 'common'
  ): boolean => {
    const subCategories = getSubCategories(category, ruleFor);
    return subCategories.length > 0;
  };

  const ruleMutation = trpc.rules.createRule.useMutation({
    onSuccess: () => {
      toast.success(translate('toast.ruleCreatedSuccess'));
      setLoading(false);
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate();
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const ruleUpdateMutation = trpc.rules.updateRule.useMutation({
    onSuccess: () => {
      toast.success(translate('toast.ruleUpdatedSuccess'));
      setLoading(false);
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate();
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  const onSubmit = (data: RuleFormData) => {
    setLoading(true);
    if (origin && updateRulePayload) {
      ruleUpdateMutation.mutate({ _id: updateRulePayload?._id, ...data });
    } else {
      ruleMutation.mutate(data);
    }
  };

  const getSubCategories = (
    category: string,
    ruleFor: 'expense' | 'income' | 'common'
  ): { answer: string; category: string[] }[] => {
    const categoryData = extended_questionnaires.find(
      (q) => q.question === category
    );
    if (!categoryData) return [];

    return categoryData.answers
      .filter((answer) => answer.type === ruleFor || answer.type === 'common')
      .map((answer) => ({
        answer: answer.answer,
        category: answer.category,
      }));
  };

  return (
    <div>
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
          <Label htmlFor="rule_for">Rule For</Label>
          <FormInput
            name="rule_for"
            id="rule_for"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder="Select rule for"
            options={[
              { title: 'Expense', value: 'expense' },
              { title: 'Income', value: 'income' },
            ]}
            required
          />
        </div>

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
          <SelectFormInput
            name="category"
            control={control}
            customClassName="w-full mt-2"
            placeholder={translate('componentsRuleModal.rule.selectCategory')}
            defaultValue={updateRulePayload?.category_title}
            options={categoryForValue ? manipulatedCategories : []}
            errorMessage={formState.errors.category?.message}
          />
        </div>

        {selectedCategory &&
          hasSubCategories(selectedCategory, categoryForValue) && (
            <div>
              <Label htmlFor="sub_category">Sub Category</Label>
              <SelectFormInput
                name="sub_category"
                control={control}
                customClassName="w-full mt-2"
                placeholder="Select sub-category"
                defaultValue={updateRulePayload?.sub_category}
                options={subCategoryOptions.map((q) => ({
                  title: q.answer,
                  value: q.answer,
                }))}
                errorMessage={formState.errors.sub_category?.message}
              />
            </div>
          )}

        <div className="py-3">
          <Button
            type="submit"
            className="w-full text-white"
            disabled={!formState.isValid || loading}
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
