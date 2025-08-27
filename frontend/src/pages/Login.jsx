// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("alice.manager@example.com");
  const [password, setPassword] = useState("Manager@123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      nav("/");
    } catch (err) {
      setError(
        err.errorMessage || "Login failed. Please check your credentials."
      );
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access the Task Management Portal.
          </p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                className="input mt-1"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button type="submit" className="btn-primary w-full py-2.5">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
