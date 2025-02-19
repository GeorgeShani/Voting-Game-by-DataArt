import { useAuth } from "../context/AuthContext";
import { LogIn, LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function NavigationBar() { 
  const { authUser, logOut } = useAuth();

  return (
    <nav className="w-full flex items-center justify-between px-6 py-6 bg-transparent z-50">
      {/* Left Side - Logo */}
      <Link to="/" className="text-2xl font-bold">
        DailyJokes
      </Link>
      {/* Right Side - Authentication Links */}
      <div className="flex items-center space-x-4">
        {authUser ? (
          <>
            <Link to="/profile" className="flex items-center gap-2">
              <User size={20} />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <button onClick={logOut} className="flex items-center gap-2">
              <LogOut size={20} />
              <span className="hidden sm:inline">Log Out</span>
            </button>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2">
            <LogIn size={20} />
            <span className="hidden sm:inline">Log In</span>
          </Link>
        )}
      </div>
    </nav>
  );
}
