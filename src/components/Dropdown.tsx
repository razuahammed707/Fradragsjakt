'use client';

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
import { signOut } from 'next-auth/react';
import { useTranslation } from '@/lib/TranslationProvider';

export default function ProfileDropdown() {
  const { translate } = useTranslation();

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
            alt={translate('profileDropdown.altText')}
            className="rounded-full"
          />
          <span className="sr-only">
            {translate('profileDropdown.altText')}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          {translate('profileDropdown.label.myAccount')}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          {translate('profileDropdown.menu.settings')}
        </DropdownMenuItem>
        <DropdownMenuItem>
          {translate('profileDropdown.menu.support')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logOut}>
          {translate('profileDropdown.menu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
