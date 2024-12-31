import { usePathname } from 'next/navigation';
const useIsWithinDashboard = () => {
  const pathname = usePathname();
  return pathname?.includes('dashboard') || false;
};

export default useIsWithinDashboard;
