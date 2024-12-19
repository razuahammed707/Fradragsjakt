import { trpc } from '../utils/trpc';

const useUserInfo = () => {
  const { data, error, isLoading, isError } =
    trpc.users.getUserByEmail.useQuery();

  return {
    role: data?.role ?? null,
    email: data?.email ?? null,
    firstName: data?.firstName ?? null,
    lastName: data?.lastName ?? null,
    isVerified: data?.isVerified ?? null,
    isAuditor: data?.role === 'auditor' ? true : false,
    isLoading,
    isError,
    error,
  };
};

export default useUserInfo;
