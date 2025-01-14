import { usePathname } from 'next/navigation';
const useIsUrlHoldsOnboard = () => {
  const pathname = usePathname();
  return pathname?.includes('onboard') || false;
};

export default useIsUrlHoldsOnboard;
