import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudUpload, Loader2, FileText, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { trpc } from '../../utils/trpc';
import SharedTooltip from '../SharedTooltip';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

type FormReceiptInputProps = {
  name: string;
  customClassName?: string;
  setValue: (
    name: string,
    value: string | { link: string; mimeType: string }
  ) => void;
  defaultValue?: string;
  includeMimeType?: boolean;
};

export function FormReceiptInput({
  name,
  customClassName,
  setValue,
  defaultValue,
  includeMimeType = false,
}: FormReceiptInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedLink, setUploadedLink] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [fileType, setFileType] = useState<string>('');
  const [error, setError] = useState<string>('');

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  useEffect(() => {
    if (defaultValue) {
      setUploadedLink(defaultValue);
    }
  }, [defaultValue]);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
    });
  };

  const handleFileUpload = useCallback(
    async (file: File) => {
      setError('');
      setIsUploading(true);
      try {
        const base64File = await convertFileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          base64File,
          fileName: file.name,
          fileType: file.type,
          folder: 'files',
        });

        if (result?.data?.link) {
          if (includeMimeType) {
            setValue(name, {
              link: result.data.link,
              mimeType: file.type,
            });
          } else {
            setValue(name, result.data.link);
          }
          setUploadedLink(result.data.link);
          setFileName(file.name);
          setFileType(file.type);
        }
      } catch (error) {
        console.error('Upload error:', error);
        setError('Failed to upload file');
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation, name, setValue, includeMimeType]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (_acceptedFiles, rejectedFiles) => {
      if (rejectedFiles.length > 0) {
        const fileSize = rejectedFiles[0].file.size;
        if (fileSize > MAX_FILE_SIZE) {
          setError(
            `File size exceeds 5MB limit (${(fileSize / (1024 * 1024)).toFixed(1)}MB)`
          );
        }
        setUploadedLink(defaultValue || null);
        setFileName('');
        setFileType('');
        return;
      }

      const file = _acceptedFiles[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    accept: {
      'image/*': [],
      'application/pdf': ['.pdf'],
    },
    noClick: true,
    noKeyboard: true,
    maxSize: MAX_FILE_SIZE,
    preventDropOnDocument: true,
  });

  const imageSrc = uploadedLink || defaultValue;

  const renderPreview = () => {
    if (!imageSrc) return null;

    return (
      <SharedTooltip
        visibleContent={
          <Link
            href={imageSrc}
            className="underline text-xs font-medium text-blue-500"
          >
            {fileName || 'Uploaded File'}
          </Link>
        }
      >
        {fileType.startsWith('image/') ? (
          <Image
            alt="image"
            src={imageSrc}
            width={100}
            height={100}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded">
            <FileText className="text-gray-600" size={24} />
            <span className="text-sm text-gray-600">
              {fileName || 'Uploaded File'}
            </span>
          </div>
        )}
      </SharedTooltip>
    );
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={cn(
          'rounded-lg  bg-[#F0EFFE] border-[#9C9CAA] p-5 border-dashed border-2',
          error && 'border-red-500 ',
          customClassName
        )}
      >
        <input {...getInputProps()} hidden accept="image/*,.pdf" />
        {isDragActive ? (
          <p className="text-[#71717A] p-6">Drop the file here ...</p>
        ) : (
          <div
            className="h-full w-full flex items-center justify-center flex-col space-y-2"
            onClick={open}
          >
            {isUploading ? (
              <Loader2 size={40} className="animate-spin text-primary" />
            ) : (
              <CloudUpload
                size={40}
                className={error ? 'text-red-500' : 'text-[#9C9CAA]'}
              />
            )}
            <div className="text-center">
              <p className="text-[#71717A] text-sm">
                Drag an image or PDF, or click to browse
              </p>
              <p className="text-xs text-gray-500">Maximum file size: 5MB</p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="flex items-center space-x-2 text-red-500">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      {renderPreview()}
    </>
  );
}
