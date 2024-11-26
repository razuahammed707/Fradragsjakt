import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Control } from 'react-hook-form';
import UploadIcon from '../../public/upload.png';
import { trpc } from '../utils/trpc';
type FormReceiptInputProps = {
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>;
  customClassName?: string;
  required?: boolean;
  setValue: (name: string, value: string) => void;
};

export function FormReceiptInput({
  name,
  customClassName,
  setValue,
}: FormReceiptInputProps) {
  const [isUploading, setIsUploading] = useState(false);

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
    async (file: File) => {
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
          setValue(name, result.data.link);
        }
      } catch (error) {
        console.error('Upload error:', error);
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation, name, setValue]
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    accept: {
      'image/*': [],
    },
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div
      {...getRootProps()}
      className={`rounded-lg mb-5 mt-2 bg-[#F0EFFE] p-5 border-dashed border-2 border-[#5B52F9] ${customClassName}`}
    >
      <input {...getInputProps()} hidden accept="image/*" />
      {isDragActive ? (
        <p className="text-[#71717A] p-6">Drop the image file here ...</p>
      ) : (
        <div
          className="h-full w-full flex items-center justify-center flex-col space-y-5"
          onClick={open}
        >
          {isUploading ? (
            <Loader2 size={40} className="animate-spin text-primary" />
          ) : (
            <>
              <Image src={UploadIcon} alt="upload icon" />
              <p className="text-[#71717A]">Drag an image or click to browse</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
