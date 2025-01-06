import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import Avatar from '../../public/images/user_avatar.png';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, Settings, Info } from 'lucide-react';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';

function ProfileDropdown({ role }: { role: string }) {
  const { data: session } = useSession();
  const logOut = () => {
    localStorage.clear();
    localStorage.removeItem('persist:root');
    signOut({ callbackUrl: '/login' });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Image
            src={Avatar}
            height={38}
            width={38}
            alt="User avatar"
            className="rounded-full"
          />
          <span className="sr-only">User avatar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[213px]">
        <DropdownMenuLabel className="text-Black font-bold p-2">
          {transformToUppercase(
            session?.user?.firstName + ' ' + session?.user?.lastName
          )}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-gray-700 font-normal p-2">
          {transformToUppercase(session?.user?.role)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center text-gray-600 font-medium p-2">
          <Link href={`/${role}/settings`} className="flex items-center w-full">
            Settings
            <Settings className="ml-auto text-gray-500" />
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center text-gray-600 font-medium p-2">
          My profile
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center text-gray-600 font-medium p-2">
          About
          <Info className="ml-auto text-gray-600" />
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center text-gray-600 font-medium p-2">
          <span className="flex-1">Language</span>
          <span className="ml-auto text-gray-400">English</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center text-gray-600 font-medium p-2"
          onClick={logOut}
        >
          Sign out
          <LogOut className="ml-auto text-gray-600" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
