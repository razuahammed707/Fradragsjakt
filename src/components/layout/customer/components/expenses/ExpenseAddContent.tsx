import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { SelectFormInput } from '@/components/SelectFormInput'; // Import the SelectFormInput
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import DragAndDropFile from '@/components/DragAndDropFile';
import { useDropzone } from 'react-dropzone';
import SharedTooltip from '@/components/SharedTooltip';
import Link from 'next/link';
import Image from 'next/image';
import { PayloadType } from './ExpenseUpdateModal';
import { useTranslation } from '@/lib/TranslationProvider';
import { useManipulatedCategories } from '@/hooks/useManipulatedCategories';

type UploadedImageType = {
  link: string;
  mimeType: string;
  width?: number;
  height?: number;
};

export type FormData = {
  description: string;
  expense_type: 'unknown' | 'personal' | 'business';
  category: string; // Ensure this is a string
  deduction_status: string;
  amount: string;
  receipt: {
    link: string;
    mimeType: string;
  };
};

type CategoryType = { title: string; value: string };

interface ExpenseAddContentProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  categories?: CategoryType[];
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
    reset,
    formState: { isValid },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [fileLink, setFileLink] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImageType | null>(
    null
  );
  const utils = trpc.useUtils();
  const query = { category_for: 'expense' };
  const { manipulatedCategories } = useManipulatedCategories(query);

  const createMutation = trpc.expenses.createExpense.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.expenses.getCategoryAndExpenseTypeWiseExpenses.invalidate();
      toast.success(
        translate('componentsExpenseModal.expense.toast.create_success'),
        { duration: 4000 }
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
        translate('componentsExpenseModal.expense.toast.update_success'),
        { duration: 4000 }
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

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileUpload = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setIsUploading(true);
      try {
        const base64File = await convertFileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          base64File,
          fileName: file.name,
          fileType: file.type,
          folder: 'files',
        });
        if (file?.size > 2 * 1024 * 1024) {
          toast.error('File size cannot exceed 10MB');
          return;
        }
        setUploadedImage(result?.data);
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation, fileLink] // Include fileLink as a dependency
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileLink(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'application/pdf': [],
    },
  });

  useEffect(() => {
    if (fileLink) handleFileUpload(fileLink);
  }, [fileLink]);

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
        receipt: {
          link: uploadedImage?.link || '',
          mimeType: uploadedImage?.mimeType || '',
        },
      });
    } else
      createMutation.mutate({
        ...data,
        amount: modifiedAmount,
        receipt: {
          link: uploadedImage?.link || '',
          mimeType: uploadedImage?.mimeType || '',
        },
      });
  };

  return (
    <div>
      <h1 className="font-medium text-lg text-black mb-4">
        {origin === 'expense update'
          ? translate('componentsExpenseModal.expense.heading.update_expense')
          : translate('componentsExpenseModal.expense.heading.add_expense')}
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {['description', 'amount'].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>
              {field === 'description'
                ? translate('componentsExpenseModal.expense.label.description')
                : translate('componentsExpenseModal.expense.label.amount')}
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
              disabled={field === 'amount' && origin === 'expense update'}
              control={control}
              customClassName="w-full mt-2"
              required
            />
          </div>
        ))}
        <div>
          <Label htmlFor="expense_type">
            {translate('componentsExpenseModal.expense.label.expense_type')}
          </Label>
          <FormInput
            name="expense_type"
            defaultValue={payload?.expense_type}
            customClassName="w-full mt-2"
            type="select"
            control={control}
            placeholder="Select expense type"
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
            {translate(
              'componentsExpenseModal.expense.label.category',
              'category'
            )}
          </Label>
          <SelectFormInput
            name="category"
            control={control}
            placeholder="Select category"
            options={manipulatedCategories.map((category) => ({
              title: category.title,
              value: category.value,
            }))}
            defaultValue={payload?.category || ''}
          />
        </div>
        <div className="rounded-lg mb-5 mt-2 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9]">
          <div
            {...getRootProps()}
            className="h-full w-full flex items-center justify-center"
          >
            <DragAndDropFile
              fileLink={fileLink}
              loading={isUploading}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          </div>
        </div>
        {uploadedImage && !uploadedImage.mimeType.includes('csv') && (
          <SharedTooltip
            visibleContent={
              <Link href="/" className="underline font-medium text-blue-500">
                {translate('componentsExpenseModal.expense.uploaded_receipt')}
              </Link>
            }
          >
            <Image
              alt="image"
              src={uploadedImage.link}
              width={uploadedImage.width ? uploadedImage.width / 3 : 100}
              height={uploadedImage.height ? uploadedImage.height / 3 : 100}
            />
          </SharedTooltip>
        )}
        <div className="py-3">
          <Button
            disabled={!isValid || loading || isUploading}
            type="submit"
            className="w-full text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {origin === 'expense update'
              ? translate('componentsExpenseModal.expense.button.update')
              : translate('componentsExpenseModal.expense.button.add')}{' '}
            {translate('componentsExpenseModal.expense.button.expense')}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseAddContent;
