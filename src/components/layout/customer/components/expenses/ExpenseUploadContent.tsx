'use client';
import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormInput';
import DragAndDropFile from '@/components/DragAndDropFile';
import { useDropzone } from 'react-dropzone';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

type FormData = {
  Description: string;
  Amount: string;
};

type Column = {
  title: string;
  dataIndex: string;
  key: string;
};

type FileRowData = {
  key: string;
  [key: string]: string;
};

type ExpenseData = {
  description: string;
  amount: number;
};

const targetColumns: Column[] = [
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
];

interface ParsedFileResult {
  fileData: FileRowData[];
  headers: Column[];
}

const parseFileData = (data: string[][]): ParsedFileResult => {
  const headers: Column[] = data[0].slice(1).map((header, index) => ({
    title: header,
    dataIndex: `column_${index}`,
    key: `column_${index}`,
  }));

  console.log('headers', headers);

  const parsedData: FileRowData[] = data
    .slice(1)
    .filter((row) => row.slice(1).some((cell) => cell && cell.trim() !== ''))
    .map((row, rowIndex) => {
      // Clean and merge split numeric cells for each row
      const cleanedRow = [];
      let tempValue = '';

      for (let i = 1; i < row.length; i++) {
        const cell = row[i].trim();

        // Detect if the cell starts or ends with a quote, indicating a split value
        if (cell.startsWith('"') && !cell.endsWith('"')) {
          // Start of a new quoted value
          tempValue = cell;
        } else if (!cell.startsWith('"') && cell.endsWith('"') && tempValue) {
          // End of a split value
          tempValue += `,${cell}`;
          cleanedRow.push(tempValue.replace(/["',]/g, '')); // Remove quotes and commas
          tempValue = ''; // Reset tempValue
        } else if (tempValue) {
          // Continuation of a split value
          tempValue += `,${cell}`;
        } else {
          // Normal cell value, push as is after removing commas
          cleanedRow.push(cell.replace(/,/g, ''));
        }
      }

      // Convert cleaned row to the correct format with column indexes
      const processedRow = cleanedRow.reduce(
        (acc: FileRowData, val: string, colIndex: number) => {
          if (val && val.trim() !== '') {
            acc[`column_${colIndex}`] = val.trim();
          }
          return acc;
        },
        { key: `row_${rowIndex}` }
      );

      return Object.keys(processedRow).length > 1 ? processedRow : null;
    })
    .filter((row): row is FileRowData => row !== null);

  return {
    fileData: parsedData,
    headers: headers,
  };
};

const mapToExpenseData = (
  formData: FormData,
  fileData: FileRowData[],
  headers: Column[]
): ExpenseData[] => {
  return fileData
    .map((row) => {
      const descriptionColumnIndex = headers.findIndex(
        (col) => col.title === formData.Description
      );
      const amountColumnIndex = headers.findIndex(
        (col) => col.title === formData.Amount
      );

      const description = row[`column_${descriptionColumnIndex}`];
      const amount = row[`column_${amountColumnIndex}`];

      if (description && amount) {
        const parsedAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
        if (!isNaN(parsedAmount)) {
          return {
            description: description.trim(),
            amount: parsedAmount,
          };
        }
      }
      return null;
    })
    .filter((item): item is ExpenseData => item !== null);
};

type ExpenseUploadContentProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};
const ExpenseUploadContent: React.FC<ExpenseUploadContentProps> = ({
  setModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();
  const { handleSubmit, control, reset } = useForm<FormData>();
  const [fileLink, setFileLink] = useState<File | null>(null);

  const [mediaUploadLoading, setMediaUploadLoading] = useState(false);
  const [fileData, setFileData] = useState<FileRowData[]>([]);

  const [headers, setHeaders] = useState<Column[]>([]);
  const [isFileProcessed, setIsFileProcessed] = useState(false);

  const handleFileProcessing = (file: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const { fileData: parsedData, headers: parsedHeaders } = parseFileData(
        text.split('\n').map((line) => line.split(','))
      );
      setHeaders(parsedHeaders);
      setFileData(parsedData);
      setIsFileProcessed(true);
      setMediaUploadLoading(false);
    };
    reader.readAsText(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setFileLink(file);
    setMediaUploadLoading(true);
    handleFileProcessing(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
  });

  const mutation = trpc.expenses.createBulkExpenses.useMutation({
    onSuccess: () => {
      toast.success('Expenses created successfully!', {
        duration: 4000,
      });
      utils.expenses.getExpenses.invalidate();
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expenses');
      setLoading(false);
    },
  });

  const onSubmit = (formData: FormData): void => {
    const mappedExpenses = mapToExpenseData(formData, fileData, headers);
    setLoading(true);
    mutation.mutate(mappedExpenses);
  };

  const headerOptions = React.useMemo(
    () =>
      headers.map((header) => ({
        value: header.title,
        title: header.title,
      })),
    [headers]
  );

  return (
    <div className="mt-4">
      <h1 className="font-bold text-xl text-[#5B52F9] mb-4">
        {fileLink?.name ? 'Return' : 'Upload expense statement'}
      </h1>
      {fileLink?.name ? (
        <div className="text-xs space-y-4">
          <p className="text-black font-medium mb-4">Your selected file</p>
          <span className="text-[#5B52F9] bg-[#F0EFFE] font-medium px-3 rounded-lg py-2">
            {fileLink?.name}
          </span>
          <p className="text-[#71717A] font-medium ">
            The best match to each field on the selected file have been
            auto-selected.
          </p>
        </div>
      ) : (
        <div className="rounded-lg mb-5 mt-2 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9]">
          <div
            {...getRootProps()}
            className="h-full w-full flex items-center justify-center"
          >
            <DragAndDropFile
              setFileLink={setFileLink}
              fileLink={fileLink}
              loading={mediaUploadLoading}
              getInputProps={getInputProps}
              isDragActive={isDragActive}
            />
          </div>
        </div>
      )}

      {isFileProcessed && (
        <>
          <div className="grid grid-cols-2 gap-4 my-6">
            <p className="text-gray-400 border-b border-gray-200 text-xs pb-2">
              Required Field
            </p>
            <p className="text-gray-400 border-b border-gray-200 text-xs pb-2">
              CSV Column Headers
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            {targetColumns.map((column, i) => (
              <div
                key={i}
                className="grid grid-cols-2 gap-4 space-y-2 items-center"
              >
                <p className="text-gray-800 text-xs pt-2 font-semibold">
                  {column.title}
                </p>
                <FormInput
                  name={column.title}
                  control={control}
                  type="select"
                  placeholder={column.title}
                  options={headerOptions}
                  required
                />
              </div>
            ))}
            <Button
              type="submit"
              className="w-full mt-7 text-white "
              variant="purple"
              disabled={loading}
            >
              Process Expense Data
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default ExpenseUploadContent;
