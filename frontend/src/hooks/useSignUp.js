import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signup } from "../lib/api";
import toast from "react-hot-toast";
import useAuthStore from "../store/useAuthStore";
import useAuthNavigation from "./useAuthNavigation";
import { handleApiError, validateForm, FORM_RULES } from "../utils/errorHandler";

const useSignUp = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  const { navigateAfterAuth } = useAuthNavigation();

  const { mutate, isPending, error } = useMutation({
    mutationFn: signup,
    onSuccess: (data) => {
      console.log("✅ SIGNUP SUCCESS:", data);
      
      // Show personalized success message
      toast.success(`Welcome to Jharufy, ${data.user.fullName}! Let's set up your profile.`);
      
      // Set the user data in both React Query cache and Zustand store
      console.log("📝 Setting cache and store data:", data);
      queryClient.setQueryData(["authUser"], data);
      setUser(data.user);
      
      // For signup, always navigate to onboarding (new users are never onboarded)
      console.log("📋 Navigating to onboarding page");
      navigateAfterAuth(data.user);
    },
    onError: (error) => {
      console.error("❌ SIGNUP ERROR:", error);
      handleApiError(error, "Signup failed. Please try again.");
    },
  });

  // Enhanced signup function with comprehensive validation
  const signupMutation = (signupData) => {
    // Validate signup data
    const validation = validateForm(signupData, {
      fullName: FORM_RULES.fullName,
      email: FORM_RULES.email,
      password: FORM_RULES.password
    });
    
    if (!validation.isValid) {
      Object.values(validation.errors).forEach(error => toast.error(error));
      return;
    }
    
    // Additional password confirmation check
    if (signupData.confirmPassword && signupData.password !== signupData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    mutate(signupData);
  };

  return { 
    isPending, 
    error, 
    signupMutation,
    isError: !!error 
  };
};

export default useSignUp;