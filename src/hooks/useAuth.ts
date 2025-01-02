import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth(
  options: {
    required?: boolean;
    redirectTo?: string;
    onSuccess?: () => void;
  } = {}
) {
  const { required = false, redirectTo = '/login', onSuccess } = options;
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: session, status } = useSession({
    required,
    onUnauthenticated() {
      if (required) {
        router.push(redirectTo);
      }
    },
  });

  useEffect(() => {
    // Force an immediate session check
    const checkSession = async () => {
      try {
        // This will trigger a session refresh
        await fetch('/api/auth/session');
        setIsInitialized(true);
        if (status === 'authenticated' && onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Session check failed:', error);
      }
    };

    if (!isInitialized) {
      checkSession();
    }
  }, [status, isInitialized, onSuccess]);

  return {
    session,
    status,
    isAuthenticated: status === 'authenticated',
    isLoading: !isInitialized || status === 'loading',
    isInitialized,
  };
}
