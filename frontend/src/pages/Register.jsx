import React, { useState } from "react";
import { apiClient } from "../lib/api";
import { useAuth } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Register() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("INTERN");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Protect route: only managers can access
  if (user?.role !== "MANAGER") {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      await apiClient.createUser({ name, email, password, role });
      setSuccess(`User "${name}" created successfully!`);
      // Reset form
      setName("");
      setEmail("");
      setPassword("");
      setRole("INTERN");
    } catch (err) {
      setError(err.errorMessage || "Failed to create user.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      {/* Back arrow */}
      <button
        onClick={() => navigate("/")}
        className="mb-4 text-gray-600 hover:text-gray-800 flex items-center gap-2"
      >
        <ArrowLeft size={20} /> Back
      </button>
      <div className="max-w-lg mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Create New User
          </h2>
          <p className="text-gray-600 mb-6">
            Create an account for a new manager or intern.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="input w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              className="input w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <select
              className="input w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="INTERN">Intern</option>
              <option value="MANAGER">Manager</option>
            </select>
            <button type="submit" className="btn-primary w-full">
              Create Account
            </button>
            {success && <p className="text-green-600 mt-2">{success}</p>}
            {error && <p className="text-red-600 mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
