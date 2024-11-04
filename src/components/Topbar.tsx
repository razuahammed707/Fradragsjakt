import React from 'react';
import MobileNav from './MobileNav';
import Link from 'next/link';
import CompanyLogo from './CompanyLogo';
import SearchInput from './SearchInput';
import { BellDot } from 'lucide-react';
import ProfileDropdown from './Dropdown';

interface TopbarProps {
  role: string;
}

const Topbar: React.FC<TopbarProps> = ({ role }) => {
  return (
    <header className="flex bg-[#00104B] justify-between h-14 items-center px-7  lg:h-[60px] lg:px-[128px]">
      <MobileNav role={role || ''} />
      <div className="hidden md:flex items-center ">
        <Link href="/" className="">
          <CompanyLogo />
          <p className="text-xs text-white font-medium">Welcome</p>
        </Link>
      </div>
      <div className="flex items-center space-x-8">
        <SearchInput className="hidden md:block" />
        <BellDot size={24} color="#FFFF" />
        <ProfileDropdown />
      </div>
    </header>
  );
};

export default Topbar;
