'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { Loader2, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

type AddAuditorFormData = {
  email: string;
  message?: string;
};

export default function AddAuditorModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm<AddAuditorFormData>({
    defaultValues: {
      email: '',
      message: '',
    },
  });

  const onSubmit = (data: AddAuditorFormData) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Invite Sent:', data);
      toast.success('Invite sent successfully!');
      setLoading(false);
      setOpen(false);
      reset();
    }, 1000);
  };

  return (
    <>
      <Button variant="purple" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4 mr-2" /> Add Auditor
      </Button>

      <SharedModal open={open} onOpenChange={setOpen}>
        <h2 className="text-lg font-medium  mb-4">Add Auditor</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <FormInput
              name="email"
              control={control}
              placeholder="Enter auditor's email"
              type="email"
              required
              customClassName="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="message">Message (optional)</Label>
            <FormInput
              name="message"
              control={control}
              placeholder="Add a message..."
              type="textarea"
              customClassName="mt-1"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center text-white"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Send
            Invite
          </Button>
        </form>
      </SharedModal>
    </>
  );
}
