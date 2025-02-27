'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput'; // Updated to single select component
import { Edit2, Loader2 } from 'lucide-react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';

type CategoryFor = 'expense' | 'income';

interface FormData {
  title: string;
  category_for: CategoryFor;
  reference_category: string;
}

type UpdateCategoryPayload = {
  _id: string;
  title?: string;
  reference_category?: string;
  category_for: CategoryFor;
};

interface CategoryAddModalProps {
  origin?: string;
  category?: UpdateCategoryPayload;
}

export default function CategoryAddModal({
  origin,
  category,
}: CategoryAddModalProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();
  const { translate } = useTranslation();

  const { handleSubmit, control, reset, watch } = useForm<FormData>({
    defaultValues: {
      title: category?.title || '',
      category_for: category?.category_for || undefined,
      reference_category: category?.reference_category || '',
    },
  });

  //const categoryForValue = watch('category_for');
  const categoryTitleValue = watch('title');
  const categoryMapValue = watch('reference_category');

  const { mainCategories } = useManipulatedCategories();

  const mutation = trpc.categories.createCategory.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully!', {
        duration: 4000,
      });
      utils.categories.getCategories.invalidate();
      reset();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
      setLoading(false);
    },
  });

  const updateMutation = trpc.categories.updateCategory.useMutation({
    onSuccess: () => {
      toast.success('Category updated successfully!', {
        duration: 4000,
      });
      utils.categories.getCategories.invalidate();
      reset();
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update category');
      setLoading(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    const payload = {
      ...data,
      reference_category: data.reference_category,
    };
    if (origin && category) {
      updateMutation.mutate({ id: category._id, ...payload });
    } else {
      mutation.mutate(payload);
    }
    setOpen(false);
  };

  return (
    <>
      {!origin ? (
        <Button onClick={() => setOpen(true)} variant="purple">
          {translate(
            'components.buttons.category_buttons.text.add_category',
            '+ Add Category'
          )}
        </Button>
      ) : (
        <Edit2
          className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
          onClick={() => setOpen(true)}
        />
      )}
      <div className="bg-white z-50">
        <SharedModal
          open={open}
          onOpenChange={setOpen}
          customClassName="max-w-[500px]"
        >
          <>
            <DialogTitle className="font-medium text-lg text-black leading-tight mb-6">
              {!origin
                ? translate('page.CategoryDataTableColumns.CategoryTitle')
                : translate(
                    'page.CategoryDataTableColumns.CategoryTitleUpdate'
                  )}
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label className="block mb-2 text-[#101010] text-xs font-medium">
                  {translate('page.CategoryDataTableColumns.text')}
                </Label>
                <FormInput
                  name="title"
                  control={control}
                  type="text"
                  placeholder="Bills"
                  defaultValue={category?.title}
                  required
                />
              </div>

              <div>
                <Label className="block mb-2 text-[#101010] text-xs font-medium">
                  Map with system-defined categories
                </Label>
                <SelectFormInput
                  name="reference_category"
                  control={control}
                  placeholder="Select a category..."
                  options={mainCategories.map((category) => ({
                    title: category.title,
                    value: category.value,
                  }))}
                  defaultValue={category?.reference_category || ''}
                  customClassName="w-full mt-2"
                />
              </div>

              <Button
                disabled={loading || !categoryTitleValue || !categoryMapValue}
                type="submit"
                className="w-full flex h-9 py-2 px-4 justify-center items-center gap-[10px] text-white text-sm font-medium"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{' '}
                {!origin
                  ? translate('page.CategoryDataTableColumns.CategoryTitle')
                  : translate(
                      'page.CategoryDataTableColumns.CategoryTitleUpdate'
                    )}
              </Button>
            </form>
          </>
        </SharedModal>
      </div>
    </>
  );
}
