import React from 'react';
import MobileNav from './MobileNav';
import Link from 'next/link';
import CompanyLogo from './CompanyLogo';
import SearchInput from './SearchInput';
import { BellDot } from 'lucide-react';
import ProfileDropdown from './Dropdown';
import { useTranslation } from '@/lib/TranslationProvider';
import LanguageSwitcher from './LanguageSwitcher';

interface TopbarProps {
  role: string;
}

const Topbar: React.FC<TopbarProps> = ({ role }) => {
  const { translate } = useTranslation();
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
        <SearchInput className="hidden md:block" placeholder="search" />
        <LanguageSwitcher />
        <BellDot size={24} color="#FFFF" />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
