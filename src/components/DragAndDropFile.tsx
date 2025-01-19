import React from 'react';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import NewUpload from '../../public/NewUpload.svg';

type DragAndDropFileProps = {
  loading: boolean;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  fileLink?: File | null;
};

const DragAndDropFile: React.FC<DragAndDropFileProps> = ({
  loading,
  getInputProps,

  fileLink,
}) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <input hidden {...getInputProps()} />
      {loading ? (
        <Loader2 size={40} className="animate-spin text-primary" />
      ) : (
        <>
          <Image
            src={NewUpload} // Replace with the correct path
            alt="Upload icon"
            width={40}
            height={40}
          />
          <p className="mt-2 text-sm text-gray-600 pb-5">
            Drag and drop your file here, or click below to upload.
          </p>
          <p className="text-xs text-gray-500">
            Only CSV and XLSX files are allowed
          </p>
          {fileLink && (
            <p className="text-xs text-gray-700 mt-1">
              Selected file: {fileLink.name}
            </p>
          )}
          <Button variant="purple" className="mt-4">
            Browse File
          </Button>
        </>
      )}
    </div>
  );
};

export default DragAndDropFile;
