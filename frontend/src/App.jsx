import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";

// Lazy-loaded components
const HomePage = lazy(() => import("./pages/HomePage"));
const SignUpPage = lazy(() => import("./pages/SignUpPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotificationsPage = lazy(() => import("./pages/NotificationsPage"));
const CallPage = lazy(() => import("./pages/CallPage"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const ChatListPage = lazy(() => import("./pages/ChatListPage"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));
const FriendsPage = lazy(() => import("./pages/FriendsPage"));
const StatusFeedPage = lazy(() => import("./pages/StatusFeedPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

// Components
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import IncomingCallModal from "./components/IncomingCallModal";
import OutgoingCallModal from "./components/OutgoingCallModal";

// Contexts and Providers
import { CallProvider } from "./contexts/CallContext";

// Hooks
import useAuthUser from "./hooks/useAuthUser";
import useCall from "./hooks/useCall";

// Store
import useAuthStore from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-error mb-4">
          Something went wrong:
        </h2>
        <p className="text-base-content/70 mb-4">{error.message}</p>
        <button className="btn btn-primary" onClick={resetErrorBoundary}>
          Try again
        </button>
      </div>
    </div>
  );
}

// App Content component that uses call hooks
const AppContent = () => {
  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore();
  const location = useLocation();
  const authStore = useAuthStore();
  const { incomingCall, outgoingCall, callStatus, acceptCall, declineCall, cancelCall } = useCall();

  // Primary source of truth is Zustand store (persisted), fallback to React Query
  const isAuthenticated = authStore.isAuthenticated || Boolean(authUser);
  const isOnboarded = authStore.user?.isOnboarded || authUser?.isOnboarded;

  // Sync authentication state
  useEffect(() => {
    // Only log in development
    if (import.meta.env.DEV) {
      console.log("🚀 APP STATE CHANGE:", {
        isLoading,
        authUser,
        isAuthenticated,
        isOnboarded,
        currentPath: location.pathname,
      });
    }
  }, [
    isLoading,
    authUser,
    isAuthenticated,
    isOnboarded,
    location.pathname,
    authStore.isAuthenticated,
    authStore.user,
  ]);

  if (isLoading || authStore.isLoading) {
    return <PageLoader />;
  }

  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <div className="h-screen" data-theme={theme}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated && isOnboarded ? (
                  <Layout showSidebar={true}>
                    <HomePage />
                  </Layout>
                ) : (
                  <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
                )
              }
            />
          <Route
            path="/friends"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <FriendsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/status"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <StatusFeedPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/signup"
            element={
              !isAuthenticated ? (
                <SignUpPage />
              ) : (
                <Navigate to={isOnboarded ? "/" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <Navigate to={isOnboarded ? "/" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <NotificationsPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />
          <Route
            path="/call"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <CallPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/chat"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <ChatListPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/chat/:id"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <ChatPage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/profile"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/profile/:userId"
            element={
              isAuthenticated && isOnboarded ? (
                <Layout showSidebar={true}>
                  <ProfilePage />
                </Layout>
              ) : (
                <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
              )
            }
          />

          <Route
            path="/onboarding"
            element={
              isAuthenticated ? (
                isOnboarded ? (
                  <Layout showSidebar={true}>
                    <OnboardingPage />
                  </Layout>
                ) : (
                  <OnboardingPage />
                )
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
        </Suspense>

        {/* Call Modals */}
        {incomingCall && (
          <IncomingCallModal 
            isOpen={!!incomingCall}
            callerName={incomingCall.callerName}
            callerAvatar={incomingCall.callerAvatar}
            callType={incomingCall.callType}
            onAccept={acceptCall}
            onDecline={declineCall}
          />
        )}
        {outgoingCall && (
          <OutgoingCallModal 
            isOpen={!!outgoingCall}
            receiverName={outgoingCall.receiverName}
            receiverAvatar={outgoingCall.receiverAvatar}
            callType={outgoingCall.callType}
            callStatus={callStatus}
            onCancel={cancelCall}
          />
        )}

        <Toaster />
      </div>
    </ErrorBoundary>
  );
};

// Main App component with CallProvider
const App = () => {
  return (
    <CallProvider>
      <AppContent />
    </CallProvider>
  );
};

export default App;