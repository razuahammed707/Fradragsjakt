import { trpc } from '../utils/trpc';

const useUserInfo = () => {
  const { data, error, isLoading, isError } =
    trpc.users.getUserByEmail.useQuery();

  return {
    role: data?.user.role ?? null,
    email: data?.user.email ?? null,
    firstName: data?.user.firstName ?? null,
    lastName: data?.user.lastName ?? null,
    isVerified: data?.user.isVerified ?? null,
    isLoading,
    isError,
    error,
  };
};

export default useUserInfo;
