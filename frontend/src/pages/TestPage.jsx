import { useState } from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const TestPage = () => {
  const [testResult, setTestResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const testAPI = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/test");
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const testSignup = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/signup", {
        email: `test${Date.now()}@example.com`,
        password: "password123",
        fullName: "Test User",
      });
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setTestResult(
        `Signup Error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    setIsLoading(false);
  };

  const testUserExists = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        "/test-user/kritamban2003@gmail.com"
      );
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setTestResult(
        `User Check Error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    setIsLoading(false);
  };

  const testLogin = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        email: "kritamban2003@gmail.com",
        password: "12345678",
      });
      setTestResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setTestResult(
        `Login Error: ${
          error.response?.data?.message || error.message
        }`
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-200" data-theme="forest">
      {/* Header */}
      <header className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost btn-sm">
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
        </div>
        <div className="flex-none">
          <span className="text-xl font-semibold">API Test Page</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4 max-w-4xl">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title">API Testing</h2>
            <p>Test various API endpoints to ensure they're working properly.</p>

            <div className="mt-4 space-y-4">
              <button
                className="btn btn-primary"
                onClick={testAPI}
                disabled={isLoading}
              >
                Test API Connection
              </button>

              <button
                className="btn btn-secondary"
                onClick={testSignup}
                disabled={isLoading}
              >
                Test Signup API
              </button>

              <button
                className="btn btn-accent"
                onClick={testUserExists}
                disabled={isLoading}
              >
                Check User: kritamban2003@gmail.com
              </button>

              <button
                className="btn btn-warning"
                onClick={testLogin}
                disabled={isLoading}
              >
                Test Login: kritamban2003@gmail.com
              </button>

              {isLoading && (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner loading-sm"></span>
                  <span>Testing...</span>
                </div>
              )}

              {testResult && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Result:</h3>
                  <pre className="bg-base-200 p-4 rounded text-sm overflow-auto">
                    {testResult}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TestPage;