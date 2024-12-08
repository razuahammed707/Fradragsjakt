import React, { useRef, useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { menuConfig } from '@/utils/dummy';
import HelpAskingCard from './HelpAskingCard';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './ui/accordion';
import { usePathname } from 'next/navigation';
import { Dot } from 'lucide-react';

type MenuItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  subItems?: MenuItem[];
};

type MenuConfig = {
  [role: string]: MenuItem[];
};

interface SidebarProps {
  role: string;
}

const Sidebar: React.FC<SidebarProps> = ({ role }) => {
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  const menuItems: MenuItem[] = useMemo(
    () => (menuConfig as MenuConfig)[role] || [],
    [role]
  );

  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);

  useEffect(() => {
    if (menuRef.current) {
      const activeLink = menuRef.current.querySelector('.active');
      activeLink?.scrollIntoView({ block: 'nearest' });
    }

    const currentMenu = menuItems.find((item) => pathname.includes(item.href));
    if (currentMenu) {
      setSelectedMenu(currentMenu.href);
    }
  }, [pathname, menuItems]);

  const handleMenuClick = (href: string) => {
    setSelectedMenu(href);
  };

  return (
    <div
      ref={menuRef}
      className="hidden md:block w-[250px] h-[calc(100vh-84px)] px-4 py-12 bg-white border border-[#EEF0F4] rounded-b-2xl"
    >
      <div className="flex flex-col h-full justify-between">
        <nav className="grid items-start text-sm font-medium gap-2">
          {menuItems.map(({ href, label, icon: Icon, badge, subItems }) =>
            subItems ? (
              <Accordion
                type="single"
                collapsible
                className="space-y-4"
                key={label}
              >
                <AccordionItem value={label} className="border-none">
                  <AccordionTrigger className="flex hover:hover:no-underline text-[#71717A] justify-between items-center px-3 py-2 rounded-lg hover:bg-violet-100">
                    <span className="flex items-center">
                      <Icon className="mr-3 h-[20px] w-[20px] text-[#71717A]" />
                      {label}
                    </span>
                    {badge && (
                      <Badge className="ml-auto flex h-6 w-6 border-red-700 shrink-0 items-center justify-center rounded-full">
                        {badge}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="ml-4 space-y-2 mt-2">
                      {subItems.map(({ href: subHref, label: subLabel }) => (
                        <Link
                          href={`/${role}/${subHref}`}
                          key={subLabel}
                          onClick={() => handleMenuClick(subHref)}
                          className={cn(
                            'pl-4 py-1 flex items-center text-sm  rounded-md transition-colors duration-200 w-full text-left hover:bg-violet-100',
                            selectedMenu === subHref
                              ? 'bg-[#5B52F9] text-white'
                              : 'text-gray-600'
                          )}
                        >
                          <span className="flex items-center">
                            <Dot />
                            <p>{subLabel}</p>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            ) : (
              <Link
                key={href}
                href={`/${role}/${href}`}
                onClick={() => handleMenuClick(href)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 hover:bg-violet-100 py-2 text-muted-foreground transition-all hover:text-primary w-full text-left',
                  selectedMenu === href ? 'bg-[#5B52F9] text-white' : ''
                )}
              >
                <Icon
                  className={cn(
                    'h-[20px] w-[20px] text-[#71717A]',
                    selectedMenu === href && 'text-white'
                  )}
                />
                <span
                  className={cn(
                    'font-semibold text-sm text-[#71717A]',
                    selectedMenu === href && 'text-white'
                  )}
                >
                  {label}
                </span>
                {badge && (
                  <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                    {badge}
                  </Badge>
                )}
              </Link>
            )
          )}
        </nav>
        <HelpAskingCard />
      </div>
    </div>
  );
};

export default Sidebar;
