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
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { LogOut, Settings, Info } from 'lucide-react';
import { transformToUppercase } from '@/utils/helpers/transformToUppercase';
import DefaultAvatar from '../../public/images/user_avatar.png';
import { trpc } from '@/utils/trpc';

function ProfileDropdown({ role }: { role: string }) {
  const { data: session } = useSession();
  const { data: user } = trpc.users.getUserByEmail.useQuery();

  const logOut = () => {
    localStorage.clear();
    localStorage.removeItem('persist:root');
    signOut({ callbackUrl: '/login' });
  };

  const dropdownItems = [
    {
      label: 'Settings',
      href: `/${role}/settings`,
      icon: <Settings className="ml-auto text-gray-500" />,
    },
    { label: 'My profile' },
    {
      label: 'About',
      icon: <Info className="ml-auto text-gray-600" />,
    },
    {
      label: 'Language',
      extra: <span className="ml-auto text-gray-400">English</span>,
    },
    {
      label: 'Sign out',
      onClick: logOut,
      icon: <LogOut className="ml-auto text-gray-600" />,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="rounded-full">
          <Image
            src={user?.image || DefaultAvatar}
            height={38}
            width={38}
            alt="User avatar"
            className="rounded-full"
          />
          <span className="sr-only">User avatar</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[213px]">
        <DropdownMenuLabel className="text-black font-bold p-2">
          {transformToUppercase(
            session?.user?.firstName + ' ' + session?.user?.lastName
          )}
        </DropdownMenuLabel>
        <DropdownMenuLabel className="text-gray-700 font-normal p-2">
          {transformToUppercase(session?.user?.role)}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dropdownItems.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownMenuItem
              className="flex items-center text-gray-600 font-medium p-2 cursor-pointer"
              onClick={item.onClick}
            >
              {item.href ? (
                <Link href={item.href} className="flex items-center w-full">
                  {item.label}
                  {item.icon}
                </Link>
              ) : (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.extra || item.icon}
                </>
              )}
            </DropdownMenuItem>
            {index === 0 && <DropdownMenuSeparator />}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileDropdown;
