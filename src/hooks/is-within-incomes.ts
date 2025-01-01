import { usePathname } from 'next/navigation';
const useIsWithinIncomes = () => {
  const pathname = usePathname();
  return pathname?.includes('income') || false;
};

export default useIsWithinIncomes;
