import React from 'react';
import MobileNav from './MobileNav';
import Link from 'next/link';
import CompanyLogo from './CompanyLogo';

import ProfileDropdown from './Dropdown';
import { useTranslation } from '@/lib/TranslationProvider';
import LanguageSwitcher from './LanguageSwitcher';
import { useSession } from 'next-auth/react';

interface TopbarProps {
  role: string;
}

const Topbar: React.FC<TopbarProps> = ({ role }) => {
  const { translate } = useTranslation();
  const { data: session } = useSession();

  console.log('session from topbar', session);
  return (
    <header className="flex bg-[#00104B] justify-between h-14 items-center px-7  lg:h-[60px] lg:px-[128px]">
      <MobileNav role={role || ''} />
      <div className="hidden md:flex items-center ">
        <Link href="/" className="">
          <CompanyLogo />
          <p className="text-xs text-white font-medium">
            {translate('page.welcome.message')}
          </p>
        </Link>
      </div>
      <div className="flex items-center space-x-8">
        <LanguageSwitcher />
        <div className="border-l-2 border-r-2 px-2 py-1">
          <p className="text-xs text-white font-semibold">View Mode</p>
          <small className=" text-xs text-white font-extralight">
            {session?.user?.customer_email}
          </small>
        </div>
        <ProfileDropdown role={role || ''} />
      </div>
    </header>
  );
};

export default Topbar;
