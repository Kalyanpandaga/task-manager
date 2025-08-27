// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  function fillManagerCreds() {
    setEmail("alice.manager@example.com");
    setPassword("Manager@123");
  }

  function fillInternCreds() {
    setEmail("dana.intern@example.com");
    setPassword("Intern@123");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-600 mt-2">
            Sign in to access the Task Management Portal.
          </p>
        </div>

        {/* Card */}
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

          {/* Recruiter Testing Section */}
          <div className="mt-8">
            <p className="text-center text-gray-500 text-sm mb-3">
              Test with below credentials
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={fillManagerCreds}
                className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition"
              >
                Get Manager Creds
              </button>
              <button
                onClick={fillInternCreds}
                className="w-full sm:w-1/2 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium transition"
              >
                Get Intern Creds
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
