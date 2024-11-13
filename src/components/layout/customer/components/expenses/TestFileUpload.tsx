'use client';

import { useState } from 'react';
import { trpc } from '@/utils/trpc';

export const FileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      // Convert file to base64
      const base64File = await convertFileToBase64(file);

      // Upload using tRPC mutation
      const result = await uploadMutation.mutateAsync({
        base64File,
        fileName: file.name,
        fileType: file.type,
        folder: 'images', // You can make this dynamic if needed
      });

      console.log('Upload success:', result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        onChange={handleFileUpload}
        disabled={isUploading}
        accept="image/*" // Adjust based on your needs
      />
      {isUploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};
