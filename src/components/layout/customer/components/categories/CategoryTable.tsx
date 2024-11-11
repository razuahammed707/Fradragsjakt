'use client';
import React, { useState } from 'react';
import { SharedDataTable } from '@/components/SharedDataTable';
import { CategoryTableColumns } from './CategoryTableColumns';
import SharedPagination from '@/components/SharedPagination';
import SearchInput from '@/components/SearchInput';
import { Button } from '@/components/ui/button';
import CategoryAddModal from './CategoryAddModal';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';

export type FormData = {
  title: string;
};
export default function CategoryTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { handleSubmit, control, reset } = useForm<FormData>();
  const utils = trpc.useUtils();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const mutation = trpc.categories.createCategory.useMutation({
    onSuccess: () => {
      toast.success('Category created successfully!', {
        duration: 4000,
      });
      utils.categories.getCategories.invalidate();
      reset();
      setOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create category');
      setLoading(false);
    },
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    mutation.mutate(data);
  };

  const { data } = trpc.categories.getCategories.useQuery(
    {
      page: currentPage,
    },
    {
      keepPreviousData: true,
    }
  );
  return (
    <div className="rounded-2xl mt-2 p-6 bg-white">
      <div className="flex justify-between items-center mb-4  ">
        <h2 className="text-xl text-[#101010] font-bold">Category Overview</h2>
        <div className="flex gap-2">
          <SearchInput className="" />
          <Button onClick={() => setOpen(true)} variant="purple">
            + Add category
          </Button>
        </div>
      </div>
      <div className="mt-10">
        <SharedDataTable
          className="min-h-[500px]"
          columns={CategoryTableColumns}
          data={data?.data ?? []}
        />
        <div className="mt-10">
          <SharedPagination
            currentPage={currentPage}
            totalPages={data?.pagination?.totalPages ?? 1}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
      <CategoryAddModal
        open={open}
        setOpen={setOpen}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        control={control}
        loading={loading}
      />
    </div>
  );
}
