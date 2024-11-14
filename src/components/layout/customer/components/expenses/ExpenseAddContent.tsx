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
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import DragAndDropFile from '@/components/DragAndDropFile';
import { useDropzone } from 'react-dropzone';
import SharedTooltip from '@/components/SharedTooltip';
import Link from 'next/link';
import Image from 'next/image';

type UploadedImageType = {
  link: string;
  mimeType: string;
  width?: number;
  height?: number;
};

export type FormData = {
  description: string;
  expense_type: 'unknown' | 'personal' | 'business';
  category: string;
  deduction_status: string;
  amount: number;
  receipt: {
    link: string;
    mimeType: string;
  };
};

const defaultCategories = [
  { title: 'Transport', value: 'Transport' },
  { title: 'Meals', value: 'Meals' },
  { title: 'Gas', value: 'Gas' },
];

type CategoryType = { title: string; value: string };

interface ExpenseAddContentProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  categories?: CategoryType[];
}

function ExpenseAddContent({
  categories = [],
  setModalOpen,
}: ExpenseAddContentProps) {
  const { handleSubmit, control, reset } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [fileLink, setFileLink] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImageType | null>(
    null
  );
  const utils = trpc.useUtils();

  const manipulatedCategories = Array.from(
    new Map(
      [...categories, ...defaultCategories].map((cat) => [cat.value, cat])
    ).values()
  );

  const mutation = trpc.expenses.createExpense.useMutation({
    onSuccess: () => {
      toast.success('Expense created successfully!', { duration: 4000 });
      utils.expenses.getExpenses.invalidate();
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expense');
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
        setUploadedImage(result?.data);
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation]
  );

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileLink(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
  });

  useEffect(() => {
    if (fileLink) handleFileUpload(fileLink);
  }, []);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    mutation.mutate({
      ...data,
      amount: Number(data.amount),
      receipt: {
        link: uploadedImage?.link || '',
        mimeType: uploadedImage?.mimeType || '',
      },
    });
  };

  console.log('uploaded file', uploadedImage);
  return (
    <div>
      <h1 className="font-bold text-xl text-[#5B52F9] mb-4">
        Manually add expense
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {['description', 'amount'].map((field) => (
          <div key={field}>
            <Label htmlFor={field}>
              {field === 'description' ? 'Description' : 'Amount'}
            </Label>
            <FormInput
              type={field === 'amount' ? 'number' : 'text'}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              control={control}
              customClassName="w-full mt-2"
              required
            />
          </div>
        ))}
        {[
          {
            name: 'expense_type',
            label: 'Expense type',
            options: [
              { title: 'Business', value: 'business' },
              { title: 'Personal', value: 'personal' },
              { title: 'Unknown', value: 'unknown' },
            ],
          },
          {
            name: 'category',
            label: 'Category',
            options: manipulatedCategories,
          },
        ].map(({ name, label, options }) => (
          <div key={name}>
            <Label htmlFor={name}>{label}</Label>
            <FormInput
              name={name}
              customClassName="w-full mt-2"
              type="select"
              control={control}
              placeholder={`Select ${label.toLowerCase()}`}
              options={options}
              required
            />
          </div>
        ))}
        <div className="rounded-lg mb-5 mt-2 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9]">
          <div
            {...getRootProps()}
            className="h-full w-full flex items-center justify-center"
          >
            <DragAndDropFile
              setFileLink={setFileLink}
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
                {'Uploaded Receipt'}
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
            disabled={loading || isUploading}
            type="submit"
            className="w-full text-white"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Expense
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseAddContent;
