import { Loader2 } from 'lucide-react';
import React from 'react';
import UploadIcon from '../../public/upload.png';
import Image from 'next/image';

type DragAndDropFileProps = {
  loading: boolean;
  getInputProps: () => React.InputHTMLAttributes<HTMLInputElement>;
  isDragActive: boolean;
  fileLink?: File | null;
  setFileLink?: React.Dispatch<React.SetStateAction<File | null>>;
};

const DragAndDropFile: React.FC<DragAndDropFileProps> = ({
  loading,
  getInputProps,
  isDragActive,
  // dispute,
  // fileLink,
  // setFileLink,
}) => {
  return (
    <div>
      <input hidden accept=".csv, text/csv" {...getInputProps()} />
      {isDragActive ? (
        <p className="text-[#71717A] p-6">Drop the CSV file here ...</p>
      ) : (
        <div className="flex flex-col space-y-5 justify-center items-center">
          {loading ? <Loader2 /> : <Image src={UploadIcon} alt="upload icon" />}
          <p className="text-[#71717A]">Drag a file or click to browse</p>
        </div>
      )}
    </div>
  );
};

export default DragAndDropFile;
