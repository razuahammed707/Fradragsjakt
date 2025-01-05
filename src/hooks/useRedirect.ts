import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export const useRedirect = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    } else if (status === 'authenticated' && session?.user) {
      const { role, hasAnswers } = session.user;
      const targetRoute =
        role === 'customer'
          ? hasAnswers
            ? '/customer/dashboard'
            : '/onboard'
          : role === 'auditor'
            ? '/auditor/dashboard'
            : `/${role}/dashboard`;

      router.replace(targetRoute);
    }
  }, [session, status, router]);
};
