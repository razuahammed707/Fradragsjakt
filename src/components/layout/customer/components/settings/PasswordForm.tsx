import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Pencil, Loader2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { FormInput } from '@/components/FormInput';
import { useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

interface PasswordData {
  oldPassword: string;
  newPassword: string;
}

export function PasswordForm() {
  const [editMode, setEditMode] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm<PasswordData>();
  const utils = trpc.useUtils();

  const updatePasswordMutation = trpc.users.updateUserPassword.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
      toast.success('User password updated successfully!');
      reset();
      setEditMode(false);
    },
    onError: (error) => {
      toast.error(error.message || 'User password updation failed!');
    },
  });

  const onSubmitForm = (data: PasswordData) => {
    console.log('Password Data:', data);
    updatePasswordMutation.mutate(data);
  };

  // Watch the input fields
  const oldPassword = watch('oldPassword');
  const newPassword = watch('newPassword');

  const isSubmitDisabled =
    !oldPassword || !newPassword || updatePasswordMutation.isLoading;

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Change Password</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditMode(!editMode)}
          disabled={updatePasswordMutation.isLoading}
        >
          <Pencil className="w-4 h-4 mr-2" />
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </CardHeader>
      <CardContent>
        {editMode ? (
          <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
            <div className="w-[50%]">
              <Label>Current Password</Label>
              <FormInput
                name="oldPassword"
                control={control}
                type="password"
                customClassName="mt-1"
                disabled={updatePasswordMutation.isLoading}
                required
              />
            </div>
            <div className="w-[50%]">
              <Label>New Password</Label>
              <FormInput
                name="newPassword"
                control={control}
                type="password"
                customClassName="mt-1"
                disabled={updatePasswordMutation.isLoading}
                showPasswordRequirements
                required
              />
            </div>
            <div className="flex justify-end">
              <Button
                className="text-white"
                type="submit"
                disabled={isSubmitDisabled}
              >
                {updatePasswordMutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        ) : (
          <p className="text-gray-600">••••••••</p>
        )}
      </CardContent>
    </Card>
  );
}
