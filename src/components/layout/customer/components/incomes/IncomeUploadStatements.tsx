'use client';
import React, { useState, useCallback, Dispatch, SetStateAction } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { FormInput } from '@/components/FormInput';
import DragAndDropFile from '@/components/DragAndDropFile';
import { useDropzone } from 'react-dropzone';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import moment from 'moment';
import { cn } from '@/lib/utils';
import { useTranslation } from '@/lib/TranslationProvider';

type FormData = {
  Description: string;
  Amount: string;
  Date?: string;
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

type IncomeData = {
  description: string;
  amount: number;
  transaction_date?: string | null;
};

const targetColumns: Column[] = [
  {
    title: 'Date',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    key: 'amount',
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
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
      const cleanedRow = [];
      let tempValue = '';

      for (let i = 1; i < row.length; i++) {
        const cell = row[i].trim();

        if (cell.startsWith('"') && !cell.endsWith('"')) {
          tempValue = cell;
        } else if (!cell.startsWith('"') && cell.endsWith('"') && tempValue) {
          tempValue += `,${cell}`;
          cleanedRow.push(tempValue.replace(/["',]/g, ''));
          tempValue = '';
        } else if (tempValue) {
          tempValue += `,${cell}`;
        } else {
          cleanedRow.push(cell.replace(/,/g, ''));
        }
      }

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

const mapToIncomeData = (
  formData: FormData,
  fileData: FileRowData[],
  headers: Column[]
): IncomeData[] => {
  return fileData
    .map((row) => {
      const descriptionColumnIndex = headers.findIndex(
        (col) => col.title === formData.Description
      );
      const amountColumnIndex = headers.findIndex(
        (col) => col.title === formData.Amount
      );
      const dateColumnIndex = headers.findIndex(
        (col) => col.title === formData.Date
      );

      const description = row[`column_${descriptionColumnIndex}`];
      const amount = row[`column_${amountColumnIndex}`];
      const date = row[`column_${dateColumnIndex}`];

      if (description && amount) {
        const parsedAmount = parseFloat(amount.replace(/[^\d.-]/g, ''));
        if (!isNaN(parsedAmount)) {
          const parsedDate = moment.utc(date, 'DD/MM/YYYY', true);

          const payload = {
            description: description.trim(),
            amount: parsedAmount,
            transaction_date: new Date(),
          } as {
            description: string;
            amount: number;
            transaction_date?: unknown;
          };
          if (parsedDate) {
            payload.transaction_date = parsedDate || new Date();
          }
          return payload;
        }
      }
      return null;
    })
    .filter((item): item is IncomeData => item !== null);
};

type IncomeUploadStatementsProps = {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
};
const IncomeUploadStatements: React.FC<IncomeUploadStatementsProps> = ({
  setModalOpen,
}) => {
  const [loading, setLoading] = useState(false);
  const utils = trpc.useUtils();
  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, isValid },
  } = useForm<FormData>();
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
    if (!file) setMediaUploadLoading(false);
    reader.readAsText(file);
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setMediaUploadLoading(true);
    setFileLink(file);
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size cannot exceed 2MB');
        setMediaUploadLoading(false);
        return;
      }
      if (file.name.includes('csv')) {
        handleFileProcessing(file);
        return;
      }
    }
    setMediaUploadLoading(false);
    toast.error('Only CSV files are allowed!');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] },
  });

  const mutation = trpc.incomes.createBulkIncomes.useMutation({
    onSuccess: () => {
      utils.incomes.getIncomes.invalidate();
      toast.success('Incomes created successfully!', {
        duration: 4000,
      });
      reset();
      setModalOpen(false);
      setLoading(false);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create incomes');
      setLoading(false);
    },
  });

  const onSubmit = (formData: FormData): void => {
    const mappedIncomes = mapToIncomeData(formData, fileData, headers);
    setLoading(true);
    mutation.mutate(mappedIncomes);
  };

  const headerOptions = React.useMemo(
    () =>
      headers.map((header) => ({
        value: header.title,
        title: header.title,
      })),
    [headers]
  );
  const { translate } = useTranslation();

  return (
    <div className="mt-4">
      <h1 className="font-medium text-lg text-black mb-4">
        {isFileProcessed
          ? 'Return'
          : translate('componentsIncomeModal.income.uploadTitle')}
      </h1>
      {isFileProcessed ? (
        <div className="text-xs space-y-4">
          <p className="text-black font-medium mb-4">Your selected file</p>
          <span className="text-[#5B52F9] bg-[#F0EFFE] font-medium px-3 rounded-lg py-2">
            {fileLink?.name}
          </span>
          <p className="text-[#71717A] font-medium">
            The best match to each field on the selected file have been
            auto-selected.
          </p>
        </div>
      ) : (
        <div
          className={cn(
            'rounded-lg mb-5 mt-2 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9]',
            fileLink === undefined && 'mb-2'
          )}
        >
          <div
            {...getRootProps()}
            className="h-full w-full flex items-center justify-center"
          >
            <DragAndDropFile
              type="csv"
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
                  required={column.title === 'Date' ? false : true}
                />
              </div>
            ))}
            <Button
              type="submit"
              className="w-full mt-7 text-white "
              variant="purple"
              disabled={loading || !isDirty || !isValid}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Process Expense Data
            </Button>
          </form>
        </>
      )}
    </div>
  );
};

export default IncomeUploadStatements;