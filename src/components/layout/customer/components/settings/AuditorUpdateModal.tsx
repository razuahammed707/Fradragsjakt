'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import SharedModal from '@/components/SharedModal';
import { useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormInput';
import { Edit2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CompanyLogo from '@/components/CompanyLogo';

type AuditorFormData = {
  firstName: string;
  lastName: string;
  password: string;
};

export default function AuditorUpdateModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleSubmit, control, reset } = useForm<AuditorFormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      password: '',
    },
  });

  const onSubmit = (data: AuditorFormData) => {
    setLoading(true);

    // Simulated API call or mutation logic
    setTimeout(() => {
      console.log('Updated Auditor:', data);
      toast.success('Auditor updated successfully!');
      setLoading(false);
      setOpen(false);
      reset();
    }, 1000);
  };

  return (
    <>
      <Edit2
        className="h-4 w-4 text-[#5B52F9] cursor-pointer mr-2"
        onClick={() => setOpen(true)}
      />
      <SharedModal
        open={open}
        onOpenChange={setOpen}
        customClassName="max-w-[500px]"
      >
        <div className="flex flex-col items-center justify-center">
          <CompanyLogo color="#5B52F9" height="32" width="152" />
          <h2 className="font-medium text-lg text-black mb-2">
            You have been invited as an Auditor
          </h2>
          <p className="text-xs mb-2 text-gray-500">
            Please fill out the following fields to complete registration{' '}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <FormInput
              name="firstName"
              control={control}
              placeholder="Enter first name"
              type="text"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <FormInput
              name="lastName"
              control={control}
              placeholder="Enter last name"
              type="text"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <FormInput
              name="password"
              control={control}
              placeholder="Enter password"
              type="password"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full flex items-center text-white justify-center"
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Register
          </Button>
        </form>
      </SharedModal>
    </>
  );
}
