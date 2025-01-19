import React from 'react';
import { useDropzone } from 'react-dropzone';
import DragAndDropFile from './DragAndDropFile';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  onFileProcessed: (file: File) => void;
  loading: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFileProcessed,
  loading,
}) => {
  const onDrop = React.useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          toast.error('File size cannot exceed 10MB');
          return;
        }
        const fileType = file.name.split('.').pop()?.toLowerCase();
        if (['csv', 'xlsx', 'xls'].includes(fileType || '')) {
          onFileProcessed(file);
          return;
        }
        toast.error('Only CSV and Excel files are allowed!');
      }
    },
    [onFileProcessed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
        '.xlsx',
      ],
      'application/vnd.ms-excel': ['.xls'],
    },
  });

  return (
    <div
      className="rounded-lg mb-5 mt-2 bg-[#FAFAFA] p-5 border-dashed border-2 border-[#D8D8D8]"
      {...getRootProps()}
    >
      <DragAndDropFile
        type="spreadsheet"
        fileLink={null}
        loading={loading}
        getInputProps={getInputProps}
        isDragActive={isDragActive}
      />
    </div>
  );
};
