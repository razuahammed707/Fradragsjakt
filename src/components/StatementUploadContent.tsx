import React, {
  Dispatch,
  FC,
  SetStateAction,
  useState,
  useCallback,
} from 'react';
import { Loader2 } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { FileUploader } from './FileUploader';
import { useTranslation } from '@/lib/TranslationProvider';
import {
  processCsvFile,
  processExcelFile,
} from '@/utils/helpers/fileProcessors';
import { mapToExpenseData, parseFileData } from '@/utils/helpers/dataMappers';
import toast from 'react-hot-toast';
import { findBestMatch, targetColumns } from '@/utils/helpers/columnMatcher';
import useIsUrlHoldsOnboard from '@/hooks/use-is-url-holds-onboard';
import { Column, FormData } from '@/types/upload-statements';
import Image from 'next/image';
import FileIcon from '../../public/icons/file-icon.svg';
import UploadIcon from '../../public/icons/upload-icon.svg';
import ProcessingIcon from '../../public/icons/processing-icon.svg';

const MESSAGES = {
  SUCCESS: 'Statements populated successfully!',
  FILE_PROCESSING_ERROR: 'Error processing file',
  UNSUPPORTED_FILE_TYPE: 'Unsupported file type',
  MINIMUM_COLUMNS_ERROR: 'File must contain at least 2 columns of data',
  REQUIRED_FIELDS_ERROR: 'Could not match all required fields from your file',
  MUTATION_ERROR: 'Failed to create expenses',
};

const FILE_TYPES = {
  CSV: 'csv',
  TXT: 'txt',
  XLSX: 'xlsx',
  XLS: 'xls',
};

interface StatementUploadContentProps {
  setModalContent: Dispatch<SetStateAction<{ key: string }>>;
  setModalOpen?: Dispatch<SetStateAction<boolean>>;
}

const useFileProcessor = () => {
  const [loading, setLoading] = useState(false);
  const [fileLink, setFileLink] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const utils = trpc.useUtils();

  const mutation = trpc.expenses.populateStatement.useMutation({
    onSuccess: (data, variables, context) => {
      utils.expenses.getExpenses.invalidate();
      utils.incomes.getIncomes.invalidate();
      utils.expenses.getWriteOffs.invalidate();
      return { data, variables, context };
    },
    onError: (error) => {
      toast.error(error.message || MESSAGES.MUTATION_ERROR);
      setLoading(false);
      setIsProcessing(false);
    },
  });

  return {
    loading,
    fileLink,
    isProcessing,
    setLoading,
    setFileLink,
    setIsProcessing,
    mutation,
  };
};

const ProcessingView: FC<{ fileName: string | undefined }> = ({ fileName }) => (
  <div className="flex flex-col">
    <div className="bg-[#F0EFFE] rounded-lg p-4 mb-6">
      <div className="flex items-center mb-3">
        <div className="w-8 h-8 rounded-full bg-[#5B52F9] flex items-center justify-center mr-3">
          <Image src={FileIcon} alt="File" width={16} height={16} />
        </div>
        <p className="text-black font-medium">Selected File</p>
      </div>
      <div className="flex items-center">
        <span className="text-[#5B52F9] bg-white font-medium px-3 rounded-lg py-2 shadow-sm">
          {fileName}
        </span>
      </div>
    </div>

    <div className="flex flex-col items-center justify-center mt-8 bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <Loader2 className="h-10 w-10 animate-spin text-[#5B52F9] mb-4" />
      <p className="text-gray-800 font-medium">
        Processing your statement data...
      </p>
      <p className="text-gray-500 text-sm mt-2">
        This may take a moment while we analyze your file
      </p>
    </div>
  </div>
);

const StatementUploadContent: FC<StatementUploadContentProps> = ({
  setModalContent,
  setModalOpen,
}) => {
  const isOnboard = useIsUrlHoldsOnboard();
  const { translate } = useTranslation();
  const {
    loading,
    fileLink,
    isProcessing,
    setLoading,
    setFileLink,
    setIsProcessing,
    mutation,
  } = useFileProcessor();

  const handleMutationSuccess = useCallback(() => {
    if (!isOnboard) {
      setModalContent({ key: 'confirmation' });
    } else {
      toast.success(MESSAGES.SUCCESS);
      if (setModalOpen) {
        setModalOpen(false);
      }
    }
    setLoading(false);
    setIsProcessing(false);
  }, [isOnboard, setModalContent, setModalOpen, setLoading, setIsProcessing]);

  const matchColumns = (headers: Column[]): FormData => {
    const formValues: FormData = {};

    targetColumns.forEach((column) => {
      const matchedHeader = findBestMatch(column.title, headers);
      if (matchedHeader) {
        formValues[column.title] = matchedHeader;
      }
    });

    return formValues;
  };

  const validateRequiredFields = (formValues: FormData) => {
    const hasRequiredFields = targetColumns.every(
      (col) => formValues[col.title] !== undefined
    );

    if (!hasRequiredFields) {
      throw new Error(MESSAGES.REQUIRED_FIELDS_ERROR);
    }
  };

  const processExpenseData = (fileData: {
    fileData: any;
    headers: Column[];
  }) => {
    const { fileData: rows, headers } = fileData;
    const formValues = matchColumns(headers);

    validateRequiredFields(formValues);

    const mappingData = {
      Date: formValues.Date || '',
      Description: formValues.Description || '',
      Withdrawal: formValues.Withdrawal || '',
      Deposit: formValues.Deposit || '',
    };
    console.log({ mappingData });

    return mapToExpenseData(mappingData, rows, headers);
  };

  const extractFileData = async (file: File) => {
    const fileType = file.name.split('.').pop()?.toLowerCase();
    let rawData;

    switch (fileType) {
      case FILE_TYPES.CSV:
      case FILE_TYPES.TXT:
        rawData = await processCsvFile(file);
        break;
      case FILE_TYPES.XLSX:
      case FILE_TYPES.XLS:
        rawData = await processExcelFile(file);
        break;
      default:
        throw new Error(MESSAGES.UNSUPPORTED_FILE_TYPE);
    }

    const { fileData, headers } = parseFileData(rawData);

    if (headers.length < 2) {
      throw new Error(MESSAGES.MINIMUM_COLUMNS_ERROR);
    }

    return { fileData, headers };
  };

  const handleFileProcessing = async (file: File) => {
    try {
      setLoading(true);
      setIsProcessing(true);
      setFileLink(file);

      const fileData = await extractFileData(file);
      const mappedExpenses = processExpenseData(fileData);
      console.log({ mappedExpenses });

      mutation.mutate(mappedExpenses, {
        onSuccess: () => handleMutationSuccess(),
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : MESSAGES.FILE_PROCESSING_ERROR;
      toast.error(errorMessage);
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-4">
      <h1 className="font-medium text-xl text-black mb-4 flex items-center">
        {isProcessing ? (
          <>
            <Image
              src={ProcessingIcon}
              alt="Processing"
              width={20}
              height={20}
              className="mr-2"
            />
            Processing Statement Data
          </>
        ) : (
          <>
            <Image
              src={UploadIcon}
              alt="Upload"
              width={20}
              height={20}
              className="mr-2"
            />
            {translate('componentsExpenseModal.expense.uploadTitle')}
          </>
        )}
      </h1>

      {isProcessing ? (
        <ProcessingView fileName={fileLink?.name} />
      ) : (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <p className="text-gray-600 mb-6">
            Upload your bank statement to automatically import your
            transactions. We support CSV, Excel, and text files.
          </p>
          <FileUploader
            onFileProcessed={handleFileProcessing}
            loading={loading}
          />
        </div>
      )}
    </div>
  );
};

export default StatementUploadContent;
