'use client';

import { FormInput } from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import Image from 'next/image';
import Placeholder from '../../../../../../public/profile-placeholder.png';

import { usePathname } from 'next/navigation';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  userImage: FileList | null;
};

export default function ProfileTabContent() {
  const pathname = usePathname();

  const { control, handleSubmit, register, watch } = useForm<ProfileFormData>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    console.log('Profile Data:', data);
  };

  const userImage = watch('userImage');
  const handleImageChange = () => {
    if (userImage && userImage.length > 0) {
      const file = userImage[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Profile</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
      >
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-300">
            <Image
              src={imagePreview || Placeholder}
              alt="Profile"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <input
            type="file"
            {...register('userImage')}
            accept="image/*"
            onChange={handleImageChange}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#5B52F9] file:text-white hover:file:bg-[#4a47d5]"
          />

          <div className="flex flex-col space-y-4 w-full">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <FormInput
                name="firstName"
                type="text"
                placeholder="Enter your first name"
                control={control}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <FormInput
                name="lastName"
                type="text"
                placeholder="Enter your last name"
                control={control}
                required
              />
            </div>
            {pathname?.includes('customer') && (
              <div>
                <Label htmlFor="email">Email</Label>
                <FormInput
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  control={control}
                  required
                />
              </div>
            )}
            <div>
              <Label htmlFor="password">Password</Label>
              <FormInput
                name="password"
                type="password"
                placeholder="Enter a new password"
                control={control}
                required
              />
            </div>
            <div>
              <Label htmlFor="bio">Bio</Label>
              <FormInput
                name="bio"
                type="textarea"
                placeholder="Tell us about yourself"
                control={control}
              />
            </div>
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-[#5B52F9] hover:bg-[#4a47d5] text-white"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <div className="sr-only">Right Grid (Blank)</div>
      </form>
    </div>
  );
}
