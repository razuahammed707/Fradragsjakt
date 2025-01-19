/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { FileUploader } from './FileUploader';
import { FieldMapper } from './FieldMapper';
import { useTranslation } from '@/lib/TranslationProvider';
import { Column, FileRowData, FormData } from '@/types/upload-statements';
import {
  processCsvFile,
  processExcelFile,
  processTxtFile,
} from '@/utils/helpers/fileProcessors';
import { mapToExpenseData, parseFileData } from '@/utils/helpers/dataMappers';
import toast from 'react-hot-toast';
import { findBestMatch, targetColumns } from '@/utils/helpers/columnMatcher';
import useIsUrlHoldsOnboard from '@/hooks/use-is-url-holds-onboard';

interface StatementUploadContentProps {
  setModalContent: Dispatch<SetStateAction<{ key: string }>>;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
}

const StatementUploadContent: FC<StatementUploadContentProps> = ({
  setModalContent,
  setModalOpen,
}) => {
  const isOnboard = useIsUrlHoldsOnboard();
  const [loading, setLoading] = useState(false);
  const [fileLink, setFileLink] = useState<File | null>(null);
  const [fileData, setFileData] = useState<FileRowData[]>([]);
  const [headers, setHeaders] = useState<Column[]>([]);
  const [isFileProcessed, setIsFileProcessed] = useState(false);
  const utils = trpc.useUtils();
  const { translate } = useTranslation();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const handleFileProcessing = async (file: File) => {
    try {
      setLoading(true);
      const fileType = file.name.split('.').pop()?.toLowerCase();
      let rawData;

      switch (fileType) {
        case 'csv':
          rawData = await processCsvFile(file);
          break;
        case 'txt':
          rawData = await processTxtFile(file);
          console.log({ rawData });
          break;
        case 'xlsx':
        case 'xls':
          rawData = await processExcelFile(file);
          break;
        default:
          throw new Error('Unsupported file type');
      }
      console.log({ rawData });

      const { fileData: parsedData, headers: parsedHeaders } =
        parseFileData(rawData);

      if (parsedHeaders.length < 2) {
        throw new Error('File must contain at least 2 columns of data');
      }

      setHeaders(parsedHeaders);
      setFileData(parsedData);
      setFileLink(file);
      setIsFileProcessed(true);
    } catch (error: any) {
      toast.error(error.message || 'Error processing file');
    } finally {
      setLoading(false);
    }
  };

  const mutation = trpc.expenses.populateStatement.useMutation({
    onSuccess: () => {
      utils.expenses.getExpenses.invalidate();
      utils.incomes.getIncomes.invalidate();
      reset();

      if (!isOnboard) {
        setModalContent({ key: 'confirmation' });
      } else {
        toast.success('Statements populated successfully!');
        if (setModalOpen) {
          setModalOpen(false);
        }
      }
      setLoading(false);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create expenses');
      setLoading(false);
    },
  });

  const onSubmit = (formData: FormData) => {
    const mappedExpenses = mapToExpenseData(formData, fileData, headers);
    setLoading(true);
    mutation.mutate(mappedExpenses);
  };

  return (
    <div className="mt-4">
      <h1 className="font-medium text-lg text-black mb-4">
        {isFileProcessed
          ? 'Review Mapped Fields'
          : translate('componentsExpenseModal.expense.uploadTitle')}
      </h1>

      {isFileProcessed ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="text-xs space-y-4 mb-6">
            <p className="text-black font-medium mb-4">Selected File</p>
            <span className="text-[#5B52F9] bg-[#F0EFFE] font-medium px-3 rounded-lg py-2">
              {fileLink?.name}
            </span>
            <p className="text-[#71717A] font-medium">
              Fields have been auto-matched based on your file headers. Please
              review and adjust if needed.
            </p>
          </div>

          <FieldMapper
            control={control}
            headers={headers}
            targetColumns={targetColumns}
            findBestMatch={findBestMatch}
          />

          <Button
            type="submit"
            className="w-full mt-7 text-white"
            variant="purple"
            disabled={loading || !isValid}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Process Statements Data
          </Button>
        </form>
      ) : (
        <FileUploader
          onFileProcessed={handleFileProcessing}
          loading={loading}
        />
      )}
    </div>
  );
};

export default StatementUploadContent;
