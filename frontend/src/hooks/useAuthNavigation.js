import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const useAuthNavigation = () => {
  const navigate = useNavigate();

  const navigateAfterAuth = useCallback((user) => {
    console.log("🔄 NAVIGATION: Determining route for user", user);
    
    // For new signups, always go to onboarding
    if (!user.isOnboarded) {
      console.log("📋 NAVIGATION: Going to onboarding");
      navigate("/onboarding", { replace: true });
      return;
    }
    
    // For existing users who are onboarded, go to home
    console.log("🏠 NAVIGATION: Going to home");
    navigate("/", { replace: true });
  }, [navigate]);

  const navigateToHome = useCallback(() => {
    console.log("🏠 NAVIGATION: Going to home after onboarding");
    navigate("/", { replace: true });
  }, [navigate]);

  const navigateToLogin = useCallback(() => {
    console.log("🔐 NAVIGATION: Going to login");
    navigate("/login", { replace: true });
  }, [navigate]);

  return {
    navigateAfterAuth,
    navigateToHome,
    navigateToLogin
  };
};

export default useAuthNavigation;
