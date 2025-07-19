import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../lib/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import useAuthNavigation from "./useAuthNavigation";
import { handleApiError, validateForm, FORM_RULES } from "../utils/errorHandler";

const useLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { navigateAfterAuth } = useAuthNavigation();
  
  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log("✅ LOGIN SUCCESS:", data);
      
      // Show success message
      toast.success(`Welcome back, ${data.user.fullName}!`);
      
      // Set the user data in both React Query cache and Zustand store
      console.log("📝 Setting cache and store data:", data);
      queryClient.setQueryData(["authUser"], data);
      setUser(data.user);
      
      // Navigate based on user's onboarding status with proper React Router navigation
      console.log("🔄 Navigating based on onboarding status:", data.user.isOnboarded);
      navigateAfterAuth(data.user);
    },
    onError: (error) => {
      console.error("❌ LOGIN ERROR:", error);
      handleApiError(error, "Login failed. Please try again.");
    },
  });

  // Enhanced login function with better parameter handling
  const loginMutation = (loginData) => {
    // Validate login data
    const validation = validateForm(loginData, {
      email: FORM_RULES.email,
      password: { required: true, label: "Password" } // Simplified for login
    });
    
    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => toast.error(error));
      return;
    }
    
    mutate(loginData);
  };

  return { 
    error, 
    isPending, 
    loginMutation,
    isError: !!error 
  };
};

export default useLogin;
