import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";
import useAuthStore from "../store/useAuthStore";
import { useEffect } from "react";

const useAuthUser = () => {
  const { setUser, clearUser, setLoading } = useAuthStore();
  
  const authUser = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // Auth Check
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes (was previously cacheTime)
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: true, // Always enabled for auth checks
    suspense: false, // Disable suspense to prevent component suspension
  });
  
  // Sync React Query state with Zustand store
  useEffect(() => {
    if (authUser.isLoading) {
      setLoading(true);
    } else {
      setLoading(false);
      if (authUser.data?.user) {
        setUser(authUser.data.user);
      } else if (authUser.error) {
        clearUser();
      }
    }
  }, [authUser.isLoading, authUser.data, authUser.error, setUser, clearUser, setLoading]);
  
  // Only log in development
  if (import.meta.env.DEV) {
    console.log("🔍 useAuthUser DEBUG:", { 
      isLoading: authUser.isLoading, 
      data: authUser.data, 
      user: authUser.data?.user,
      error: authUser.error,
      status: authUser.status
    });
  }
  
  return {
    isLoading: authUser.isLoading,
    authUser: authUser.data?.user,
  };
};
export default useAuthUser;
