'use client';

import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormInput } from '@/components/FormInput';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import Placeholder from '../../../../../../public/profile-placeholder.png';
import { trpc } from '@/utils/trpc';

type ProfileFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  password: string;
  userImage: FileList | null;
};

export default function ProfilePage() {
  const { data: loggedUser } = trpc.users.getUserByEmail.useQuery();

  const [editSections, setEditSections] = useState({
    avatar: false,
    personal: false,
    password: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  console.log({ imagePreview });

  const { control, handleSubmit, register, watch, reset } =
    useForm<ProfileFormData>();

  // Set default values after data is loaded

  useEffect(() => {
    if (loggedUser) {
      reset({
        firstName: loggedUser.firstName,
        lastName: loggedUser.lastName,
        email: loggedUser.email || '',
        phone: '(213) 555-1234',
        bio: 'Product Designer',
      });
    }
  }, [loggedUser, reset]);

  const userImage = watch('userImage');

  const handleImageChange = () => {
    if (userImage && userImage.length > 0) {
      const file = userImage[0];
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleImageSubmit = () => {
    if (userImage && userImage.length > 0) {
      console.log('Uploading image:', userImage[0]);
      setEditSections((prev) => ({ ...prev, avatar: false }));
    }
  };

  const onSubmit: SubmitHandler<ProfileFormData> = (data) => {
    console.log('Profile Data:', data);
    setEditSections({
      avatar: false,
      personal: false,
      password: false,
    });
  };

  const displayImage = () => {
    if (imagePreview) return imagePreview;
    if (loggedUser?.image) return loggedUser.image;
    return Placeholder;
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-[calc(100vh-250px)] overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="space-y-2">
        {/* Avatar Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Profile Picture</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditSections((prev) => ({ ...prev, avatar: !prev.avatar }))
              }
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            <div className="flex items-center space-x-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                <Image
                  src={displayImage()}
                  alt="Profile"
                  layout="fill"
                  objectFit="cover"
                  priority
                />
              </div>
              {editSections.avatar && (
                <input
                  type="file"
                  {...register('userImage')}
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              )}
            </div>
            {editSections.avatar && imagePreview && (
              <div className="flex justify-end">
                <Button onClick={handleImageSubmit} disabled={!imagePreview}>
                  Save Image
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Personal Information Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditSections((prev) => ({
                  ...prev,
                  personal: !prev.personal,
                }))
              }
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  {editSections.personal ? (
                    <FormInput
                      name="firstName"
                      control={control}
                      type="text"
                      customClassName="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">
                      {loggedUser?.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Last Name</Label>
                  {editSections.personal ? (
                    <FormInput
                      name="lastName"
                      placeholder="Last Name"
                      control={control}
                      type="text"
                      customClassName="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">{loggedUser?.lastName}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email address</Label>
                  {editSections.personal ? (
                    <FormInput
                      name="email"
                      control={control}
                      type="email"
                      customClassName="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">{loggedUser?.email}</p>
                  )}
                </div>
                <div>
                  <Label>Phone</Label>
                  {editSections.personal ? (
                    <FormInput
                      name="phone"
                      control={control}
                      customClassName="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-600">(213) 555-1234</p>
                  )}
                </div>
              </div>
              <div>
                <Label>Bio</Label>
                {editSections.personal ? (
                  <FormInput
                    name="bio"
                    control={control}
                    type="text"
                    customClassName="mt-1"
                  />
                ) : (
                  <p className="mt-1 text-gray-600">Product Designer</p>
                )}
              </div>
              {editSections.personal && (
                <div className="flex justify-end">
                  <Button type="submit">Save Changes</Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Password Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Password</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setEditSections((prev) => ({
                  ...prev,
                  password: !prev.password,
                }))
              }
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </CardHeader>
          <CardContent>
            {editSections.password ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label>Current Password</Label>
                  <FormInput
                    name="currentPassword"
                    control={control}
                    type="password"
                    customClassName="mt-1"
                  />
                </div>
                <div>
                  <Label>New Password</Label>
                  <FormInput
                    name="password"
                    control={control}
                    type="password"
                    customClassName="mt-1"
                  />
                </div>
                <div>
                  <Label>Confirm New Password</Label>
                  <FormInput
                    name="confirmPassword"
                    control={control}
                    type="password"
                    customClassName="mt-1"
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Update Password</Button>
                </div>
              </form>
            ) : (
              <p className="text-gray-600">••••••••</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Right Grid (Blank) */}
      <div className="sr-only">Right Grid (Blank)</div>
    </div>
  );
}
