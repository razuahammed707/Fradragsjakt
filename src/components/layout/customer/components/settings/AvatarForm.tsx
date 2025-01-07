'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, Pencil } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

const FALLBACK_AVATAR = 'https://github.com/shadcn.png';

const avatarSchema = z.object({
  avatar: z
    .instanceof(FileList)
    .optional()
    .refine(
      (files) => !files || files.length <= 1,
      'Only one file is allowed.'
    ),
});

type AvatarFormInput = z.infer<typeof avatarSchema>;

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
};

export function AvatarForm({ userImage }: { userImage?: string }) {
  const [editMode, setEditMode] = useState(false);
  const [preview, setPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const utils = trpc.useUtils();

  const form = useForm<AvatarFormInput>({
    resolver: zodResolver(avatarSchema),
    defaultValues: { avatar: undefined },
  });

  const uploadMutation = trpc.upload.uploadFile.useMutation();
  const updateUserAvatarMutation = trpc.users.updateUserAvatar.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
      toast.success('Profile avater updated successfully!');
      handleEditComplete();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update profile avater!');
    },
  });

  const handleEditComplete = useCallback(() => {
    setEditMode(false);
    setPreview('');
    form.reset();
  }, [form]);

  const handleFileUpload = useCallback(
    async (file: File): Promise<string | null> => {
      setIsUploading(true);
      try {
        const base64File = await convertFileToBase64(file);
        const result = await uploadMutation.mutateAsync({
          base64File,
          fileName: file.name,
          fileType: file.type,
          folder: 'files',
        });
        return result?.data.link || null;
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        return null;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadMutation]
  );

  const handleImageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        form.setValue('avatar', event.target.files as FileList);

        // Cleanup previous preview URL
        return () => URL.revokeObjectURL(previewUrl);
      }
    },
    [form]
  );

  const handleSubmit = async (data: AvatarFormInput) => {
    if (!data.avatar?.length) return;

    const uploadedImageUrl = await handleFileUpload(data.avatar[0]);
    if (uploadedImageUrl) {
      await updateUserAvatarMutation.mutateAsync({
        image: uploadedImageUrl,
      });
    }
  };

  const displayedImage = preview || userImage || FALLBACK_AVATAR;
  const showSaveButton = editMode && preview !== '';

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Profile Picture</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (editMode ? handleEditComplete() : setEditMode(true))}
        >
          <Pencil className="w-4 h-4 mr-2" />
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
            <Avatar className="w-24 h-24">
              <AvatarImage src={displayedImage} />
              <AvatarFallback>PP</AvatarFallback>
            </Avatar>
          </div>
          {editMode && (
            <Form {...form}>
              <FormField
                control={form.control}
                name="avatar"
                render={() => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          )}
        </div>
        {showSaveButton && (
          <div className="flex justify-end">
            <Button
              className="text-white"
              onClick={form.handleSubmit(handleSubmit)}
              disabled={isUploading}
            >
              {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Image
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default AvatarForm;
