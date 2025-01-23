import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
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
  sub_question: string;
  sub_category: string;
};

type CategoryType = { title: string; value: string };

type ExpenseRuleContentProps = {
  modalClose?: (open: boolean) => void;
  categories?: CategoryType[];
  updateRulePayload?: UpdateRuleProps;
  origin: string | undefined;
  rule_for?: 'expense' | 'income';
};

function CreateRuleModalContent({
  modalClose,
  updateRulePayload,
  origin,
}: ExpenseRuleContentProps) {
  const { handleSubmit, control, watch, formState } = useForm<RuleFormData>({
    defaultValues: {
      expense_type: 'business',
      rule_for: updateRulePayload?.rule_for || 'expense',
      category: updateRulePayload?.category_title || '',
      sub_question: updateRulePayload?.sub_question || '',
      sub_category: updateRulePayload?.sub_category || '',
    },
    mode: 'onChange',
  });

  const { translate } = useTranslation();
  const utils = trpc.useUtils();
  const [loading, setLoading] = useState(false);
  const [subQuestionOptions, setSubQuestionOptions] = useState<
    { answer: string; category: string[] }[]
  >([]);

  const categoryForValue = watch('rule_for');
  const selectedCategory = watch('category');
  const selectedSubQuestion = watch('sub_question');

  const query = {
    category_for: categoryForValue || updateRulePayload?.rule_for,
  };
  const { manipulatedCategories } = useManipulatedCategories(query);

  // Fetch sub-questions based on the selected category and rule_for
  useEffect(() => {
    if (selectedCategory && categoryForValue) {
      const subQuestions = getSubQuestions(selectedCategory, categoryForValue);
      setSubQuestionOptions(subQuestions);
    } else {
      setSubQuestionOptions([]);
    }
  }, [selectedCategory, categoryForValue]);

  // Filter sub-category options based on the selected sub-question
  const subCategoryOptions = useMemo(() => {
    if (!selectedSubQuestion) return [];

    const selectedQuestion = subQuestionOptions.find(
      (q) => q.answer === selectedSubQuestion
    );
    if (!selectedQuestion) return [];

    return manipulatedCategories.filter((cat) =>
      selectedQuestion.category.includes(cat.title)
    );
  }, [selectedSubQuestion, subQuestionOptions, manipulatedCategories]);

  // Check if the selected category has sub-questions
  const hasSubQuestions = (
    category: string,
    ruleFor: 'expense' | 'income' | 'common'
  ): boolean => {
    const subQuestions = getSubQuestions(category, ruleFor);
    return subQuestions.length > 0;
  };

  // Mutation for creating a new rule
  const ruleMutation = trpc.rules.createRule.useMutation({
    onSuccess: () => {
      toast.success(translate('toast.ruleCreatedSuccess'));
      setLoading(false);
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  // Mutation for updating an existing rule
  const ruleUpdateMutation = trpc.rules.updateRule.useMutation({
    onSuccess: () => {
      toast.success(translate('toast.ruleUpdatedSuccess'));
      setLoading(false);
      if (modalClose) {
        modalClose(false);
      }
      utils.rules.getRules.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
      setLoading(false);
    },
  });

  // Handle form submission
  const onSubmit = (data: RuleFormData) => {
    setLoading(true);
    if (origin && updateRulePayload) {
      ruleUpdateMutation.mutate({ _id: updateRulePayload?._id, ...data });
    } else {
      ruleMutation.mutate(data);
    }
  };

  // Helper function to get sub-questions for a category
  const getSubQuestions = (
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
        {/* Description Contains Field */}
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

        {/* Rule For Field */}
        <h1 className="font-medium text-lg text-black mb-4">
          {translate('componentsRuleModal.rule.then')}
        </h1>
        <div>
          <Label htmlFor="rule_for">Rule For</Label>
          <FormInput
            name="rule_for"
            id="rule_for"
            defaultValue={updateRulePayload?.rule_for}
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

        {/* Expense Type Field */}
        <div>
          <Label htmlFor="expense_type">Type</Label>
          <FormInput
            name="expense_type"
            id="expense_type"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            defaultValue={updateRulePayload?.expense_type}
            placeholder={translate('componentsRuleModal.rule.selectType')}
            options={[
              {
                title: 'Deductible',
                value: 'business',
              },
              {
                title: translate('componentsRuleModal.rule.personal'),
                value: 'personal',
              },
            ]}
            required
          />
        </div>

        {/* Category Field */}
        <div>
          <Label htmlFor="category">
            {translate('componentsRuleModal.rule.category')}
          </Label>
          <FormInput
            name="category"
            id="category"
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder={translate('componentsRuleModal.rule.selectCategory')}
            defaultValue={updateRulePayload?.category_title}
            options={categoryForValue ? manipulatedCategories : []}
            required
          />
        </div>

        {/* Sub-Question and Sub-Category Fields */}
        {selectedCategory &&
          hasSubQuestions(selectedCategory, categoryForValue) && (
            <>
              <h1 className="font-medium text-lg text-black mb-4">
                Possible dependants
              </h1>
              <div>
                <Label htmlFor="sub_question">Sub Question</Label>
                <FormInput
                  name="sub_question"
                  customClassName="w-full mt-2"
                  type="select"
                  control={control}
                  placeholder="Select Question"
                  defaultValue={updateRulePayload?.sub_question}
                  options={subQuestionOptions.map((q) => ({
                    title: q.answer,
                    value: q.answer,
                  }))}
                />
              </div>
              {selectedSubQuestion && (
                <div>
                  <Label htmlFor="sub_category">Sub Category</Label>
                  <FormInput
                    name="sub_category"
                    customClassName="w-full mt-2"
                    type="select"
                    control={control}
                    placeholder="Select sub-category"
                    defaultValue={updateRulePayload?.sub_category}
                    options={subCategoryOptions.map((cat) => ({
                      title: cat.title,
                      value: cat.value,
                    }))}
                  />
                </div>
              )}
            </>
          )}

        {/* Submit Button */}
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
