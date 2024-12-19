'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { Loader2 } from 'lucide-react';
import CompanyLogo from '@/components/CompanyLogo';

type AuditorFormData = {
  firstName: string;
  lastName: string;
  password: string;
};

type UpdateAuditorModalProps = {
  onSubmit: (data: AuditorFormData) => void;
};

export default function UpdateAuditorModal({
  onSubmit,
}: UpdateAuditorModalProps) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm<AuditorFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const handleFormSubmit = (data: AuditorFormData) => {
    setLoading(true);
    onSubmit(data);
    setLoading(false);
    setOpen(false);
    reset();
  };

  return (
    <SharedModal open={open} onOpenChange={setOpen}>
      <div className="flex flex-col items-center justify-center">
        <CompanyLogo color="#5B52F9" height="32" width="152" />
        <h2 className="font-medium text-lg text-black ">
          You have been invited as an Auditor
        </h2>
        <h2 className="font-medium text-lg text-black mb-2">by Customer</h2>
        <p className="text-xs mb-2 text-gray-500">
          Please fill out the following fields to complete registration{' '}
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="space-y-6 mt-4 text-start"
      >
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <FormInput
            name="firstName"
            control={control}
            placeholder="Enter first name"
            type="text"
            required
            customClassName="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <FormInput
            name="lastName"
            control={control}
            placeholder="Enter last name"
            type="text"
            required
            customClassName="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <FormInput
            name="password"
            control={control}
            placeholder="Create a password"
            type="password"
            required
            customClassName="mt-1"
          />
        </div>

        <div className="w-full">
          <Button
            className="w-full h-11 text-white"
            disabled={loading}
            type="submit"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </SharedModal>
  );
}
