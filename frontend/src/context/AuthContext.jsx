import { createContext, useContext, useState, useEffect } from "react";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000/api" : "/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Helper function for making requests with fetch
  const request = async (url, method = "GET", body = null) => {
    try {
      const options = {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Ensures cookies (auth token) are sent
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${BASE_URL}${url}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const data = await request("/auth/check");
      setAuthUser(data);
    } catch (error) {
      console.error("Error in checkAuth:", error);
      setAuthUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  // Sign up a new user
  const signUp = async (formData) => {
    setIsSigningUp(true);
    try {
      const data = await request("/auth/signup", "POST", formData);
      setAuthUser(data);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error in signUp:", error);
      toast.error(error.message);
    } finally {
      setIsSigningUp(false);
    }
  };

  // Log in an existing user
  const logIn = async (formData) => {
    setIsLoggingIn(true);
    try {
      const data = await request("/auth/login", "POST", formData);
      setAuthUser(data);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Error in logIn:", error);
      toast.error(error.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Log out the user
  const logOut = async () => {
    try {
      await request("/auth/logout", "POST");
      setAuthUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error in logOut:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        authUser,
        isSigningUp,
        isLoggingIn,
        isCheckingAuth,
        signUp,
        logIn,
        logOut,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);