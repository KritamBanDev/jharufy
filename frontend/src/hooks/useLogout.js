import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import useAuthNavigation from "./useAuthNavigation";

const useLogout = () => {
  const queryClient = useQueryClient();
  const { clearUser } = useAuthStore();
  const { navigateToLogin } = useAuthNavigation();

  const { mutate: logoutMutation, isPending } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      console.log("✅ LOGOUT SUCCESS");
      toast.success("Logged out successfully");
      
      // Clear user data from both React Query cache and Zustand store
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear(); // Clear all cached queries
      clearUser();
      
      // Navigate to login page
      navigateToLogin();
    },
    onError: (error) => {
      console.error("❌ LOGOUT ERROR:", error);
      // Even if logout API fails, clear local state
      queryClient.setQueryData(["authUser"], null);
      queryClient.clear();
      clearUser();
      navigateToLogin();
      toast.error("Logged out");
    },
  });

  return { 
    logoutMutation, 
    isPending 
  };
};
export default useLogout;