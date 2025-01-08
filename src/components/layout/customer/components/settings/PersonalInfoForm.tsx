import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FormInput } from '@/components/FormInput';
import { Label } from '@/components/ui/label';
import { Pencil, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MultiSelectFormInput } from '@/components/MultiSelectFormInput';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/utils/trpc';
import toast from 'react-hot-toast';

interface PersonalInfoData {
  firstName: string;
  lastName: string;
  email: string;
  profile: string[];
}

interface PersonalInfoFormProps {
  userData: PersonalInfoData;
}

interface FormFieldProps {
  label: string;
  editMode: boolean;
  children: React.ReactNode;
  showLabel?: boolean;
}

const FormField = ({
  label,
  editMode,
  children,
  showLabel = true,
}: FormFieldProps) => {
  if (!showLabel && !editMode) return null;

  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
};

export function PersonalInfoForm({ userData }: PersonalInfoFormProps) {
  const [editMode, setEditMode] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { isDirty },
  } = useForm<PersonalInfoData>();
  const utils = trpc.useUtils();

  const { mutate, isLoading } = trpc.users.updateUserPersonalInfo.useMutation({
    onSuccess: () => {
      utils.users.getUserByEmail.invalidate();
      toast.success('User updated successfully with personal infos!');
      reset();
      setEditMode(false);
    },
    onError: (error) => {
      toast.error(error.message || 'User personal info updation failed!');
    },
  });

  useEffect(() => {
    reset(userData);
  }, [userData, reset]);

  const renderValue = (value: string | string[]) => {
    if (Array.isArray(value)) {
      return (
        <div className="space-x-2">
          {value.map((item, i) => (
            <Badge className="bg-slate-200" key={i}>
              {item}
            </Badge>
          ))}
        </div>
      );
    }
    return <p className="text-gray-600">{value}</p>;
  };

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Personal Information</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditMode(!editMode)}
        >
          <Pencil className="w-4 h-4 mr-2" />
          {editMode ? 'Cancel' : 'Edit'}
        </Button>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="space-y-4"
        >
          <FormField label="First Name" editMode={editMode}>
            {editMode ? (
              <FormInput name="firstName" control={control} type="text" />
            ) : (
              renderValue(userData?.firstName)
            )}
          </FormField>

          <FormField
            label="Last Name"
            editMode={editMode}
            showLabel={Boolean(editMode || userData?.lastName)}
          >
            {editMode ? (
              <FormInput
                name="lastName"
                placeholder="Last Name"
                control={control}
                type="text"
              />
            ) : (
              renderValue(userData?.lastName)
            )}
          </FormField>

          <FormField label="Email" editMode={editMode}>
            {editMode ? (
              <FormInput disabled name="email" control={control} type="email" />
            ) : (
              renderValue(userData?.email)
            )}
          </FormField>

          <FormField
            label="Profile"
            editMode={editMode}
            showLabel={Boolean(editMode || userData?.profile?.length)}
          >
            {editMode ? (
              <MultiSelectFormInput name="profile" control={control} />
            ) : (
              renderValue(userData?.profile || [])
            )}
          </FormField>

          {editMode && (
            <div className="flex justify-end">
              <Button
                className="text-white"
                type="submit"
                disabled={!isDirty || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
