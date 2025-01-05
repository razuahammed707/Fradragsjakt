type UserRole = 'customer' | 'auditor' | string;

interface AuthUser {
  role: UserRole;
  hasAnswers: boolean;
  email: string;
}

// utils/auth.ts
export const getAuthRedirectPath = (user: AuthUser | null): string => {
  if (!user || !user.role) return '/login';

  if (user.role === 'customer') {
    return user.hasAnswers ? '/customer/dashboard' : '/onboard';
  }

  return `/${user.role}/dashboard`;
};
