import React from 'react';
import { CloudUpload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      (fileInput as HTMLInputElement).click();
    }
  };

  const inputProps = getInputProps();

  return (
    <div className="flex flex-col items-center justify-center">
      <input
        {...inputProps}
        onClick={(e) => {
          e.stopPropagation();
          inputProps.onClick?.(e);
        }}
      />

      {loading ? (
        <Loader2 size={40} className="animate-spin text-primary" />
      ) : (
        <CloudUpload size={40} className="text-[#9C9CAA]" />
      )}
      <p className="mt-2 text-gray-600">
        Drag an xlsx, csv or txt file here, or click to browse.
      </p>
      <p className="text-sm text-gray-500">Maximum file size: 5MB</p>
      {fileLink && (
        <p className="text-xs text-gray-700">Selected file: {fileLink.name}</p>
      )}
      <Button
        variant="purple"
        className="mt-2 px-6"
        onClick={handleButtonClick}
        type="button"
      >
        Browse File
      </Button>
    </div>
  );
};

export default DragAndDropFile;
