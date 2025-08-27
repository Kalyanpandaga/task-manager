// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NotFound from "./pages/NotFound.jsx";
import Layout from "./components/Layout.jsx"; // Added
import Register from "./pages/Register.jsx"; // Added

const queryClient = new QueryClient();

function Protected({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicOnly({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicOnly>
                  <Login />
                </PublicOnly>
              }
            />
            {/* Protected Routes Wrapped in Layout */}
            <Route
              element={
                <Protected>
                  <Layout />
                </Protected>
              }
            >
              <Route path="/" element={<Dashboard />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
