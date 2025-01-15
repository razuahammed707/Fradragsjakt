import { usePathname } from 'next/navigation';
const useFindWhichUrl = () => {
  const pathname = usePathname();
  const isDashboard = pathname?.includes('dashboard') || false;
  const isWriteOff = pathname?.includes('write-offs') || false;
  const isIncome = pathname?.includes('income') || false;
  return {
    isDashboard,
    isWriteOff,
    isIncome,
  };
};

export default useFindWhichUrl;
