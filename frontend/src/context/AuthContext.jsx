import { createContext, useContext, useState, useEffect } from "react";
import { apiClient } from "../lib/axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is authenticated
  const checkAuth = async () => {
    try {
      const { data } = await apiClient.get("/auth/check");
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
      const { data } = await apiClient.post("/auth/signup", formData);
      setAuthUser(data);
      toast.success("Account created successfully");
    } catch (error) {
      console.error("Error in signUp:", error);
      toast.error(error.response?.data?.message || "Sign-up failed");
    } finally {
      setIsSigningUp(false);
    }
  };

  // Log in an existing user
  const logIn = async (formData) => {
    setIsLoggingIn(true);
    try {
      const { data } = await apiClient.post("/auth/login", formData);
      setAuthUser(data);
      toast.success("Logged in successfully");
    } catch (error) {
      console.error("Error in logIn:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Log out the user
  const logOut = async () => {
    try {
      await apiClient.post("/auth/logout");
      setAuthUser(null);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Error in logOut:", error);
      toast.error(error.response?.data?.message || "Logout failed");
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
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
