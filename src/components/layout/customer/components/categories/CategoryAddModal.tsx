import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { Edit2, Loader2 } from 'lucide-react';
import { FormData } from './CategoryTable';
import { DialogTitle } from '@radix-ui/react-dialog';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type UpdateCategoryPayload = {
  _id: string;
  title?: string;
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
  const { handleSubmit, control, reset } = useForm<FormData>();
  const utils = trpc.useUtils();

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
      toast.success('Category is updated successfully!', {
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

  const onSubmit = (data: FormData) => {
    setLoading(true);
    if (origin && category) {
      updateMutation.mutate({ id: category._id, ...data });
    } else {
      mutation.mutate(data);
    }
    setOpen(false);
  };

  return (
    <>
      {!origin ? (
        <Button onClick={() => setOpen(true)} variant="purple">
          + Add category
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
              {!origin ? 'Add Category' : 'Update Category'}
            </DialogTitle>

            <>
              <Label className="block mb-2 text-[#101010] text-xs font-medium">
                Category Name
              </Label>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <FormInput
                  name="title"
                  control={control}
                  type="text"
                  placeholder="Bills"
                  defaultValue={category?.title}
                  required
                />
                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full flex h-9 py-2 px-4 justify-center items-center gap-[10px] text-white text-sm font-medium"
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{' '}
                  {!origin ? 'Add' : 'Update'}
                </Button>
              </form>
            </>
          </>
        </SharedModal>
      </div>
    </>
  );
}
