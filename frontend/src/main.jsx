import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";

// Styles
import "stream-chat-react/dist/css/v2/index.css";
import "./index.css";

// Components
import App from "./App";
import PageLoader from "./components/PageLoader";

// Create React Query client with optimized settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
      suspense: false, // Disable suspense globally to prevent suspension errors
    },
  },
});

// Error Fallback UI
const ErrorFallback = ({ error }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <div className="text-center p-8 rounded-2xl shadow-xl border border-error/20 max-w-md mx-4">
        <h2 className="text-2xl font-bold text-error mb-4">Something went wrong</h2>
        <pre className="text-sm bg-base-200/50 p-4 rounded-xl overflow-auto max-h-48 mb-4">
          {error.message}
        </pre>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-error"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");

const root = createRoot(container);

root.render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <App />
          {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
          <Toaster
            position="top-center"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
              duration: 5000,
              style: {
                background: "hsl(var(--b1))",
                color: "hsl(var(--bc))",
                border: "1px solid hsl(var(--b3))",
              },
            }}
          />
        </QueryClientProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
