import { authClient } from "@/lib/auth-client";

const useEnsureAuth = () => {
  const { data, isPending } = authClient.useSession();

  return {
    isAuthenticated: !!data,
    isLoading: isPending,
    data,
  };
};

export default useEnsureAuth;
