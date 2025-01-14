import { usePathname } from 'next/navigation';
const useFindWhichUrl = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('dashboard') || false;
  const isWriteOff = pathname?.includes('write-offs') || false;
  return {
    isDashboard,
    isWriteOff,
  };
};

export default useFindWhichUrl;
