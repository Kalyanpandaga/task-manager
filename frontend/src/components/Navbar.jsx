import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, UserPlus, ClipboardCheck } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 h-16 flex items-center justify-between shadow-sm sticky top-0 z-10">
      {/* Logo and Brand */}
      <Link to="/" className="flex items-center gap-3">
        <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg">
          <ClipboardCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Task Manager</h1>
        </div>
      </Link>

      {/* User Menu and Actions */}
      <div className="flex items-center gap-2 sm:gap-10">
        {user?.role === "MANAGER" && (
          <Link
            to="/register"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100"
            title="Add New User"
          >
            <UserPlus size={20} />
            {/* Changed: Text is hidden on small screens */}
            <span className="hidden sm:inline">Add User</span>
          </Link>
        )}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <span className="text-xs text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-700 text-white flex items-center justify-center font-bold flex-shrink-0">
            {getInitials(user?.name)}
          </div>
        </div>
        <button
          onClick={handleLogout}
          title="Logout"
          className="text-gray-500 hover:text-gray-800 p-2 rounded-md hover:bg-gray-100"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}
