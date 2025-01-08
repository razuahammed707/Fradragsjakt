import { trpc } from '@/utils/trpc';
import { AvatarForm } from './AvatarForm';
import { PersonalInfoForm } from './PersonalInfoForm';
import { PasswordForm } from './PasswordForm';

export default function ProfileTabContent() {
  const { data: loggedUser } = trpc.users.getUserByEmail.useQuery();

  return (
    <div className="grid grid-cols-1 space-y-2 gap-6 h-[calc(100vh-250px)] overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden">
      <div className="space-y-2">
        <AvatarForm userData={loggedUser} />
        <PersonalInfoForm userData={loggedUser} />
        {loggedUser?.provider === 'credentials' && <PasswordForm />}
      </div>
    </div>
  );
}
