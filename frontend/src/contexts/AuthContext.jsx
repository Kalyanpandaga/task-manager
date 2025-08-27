// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { apiClient } from "../lib/api";

const AuthContext = createContext(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(Cookies.get("token") || null); // Initialize token from cookie
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUserFromToken() {
      const currentToken = Cookies.get("token");
      if (currentToken) {
        try {
          const data = await apiClient.getCurrentUser();
          if (data?.user) {
            setUser(data.user);
          }
        } catch (error) {
          console.error("Failed to fetch user:", error);
          if (error.statusCode === 401 || error.statusCode === 403) {
            Cookies.remove("token");
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    }
    loadUserFromToken();
  }, []);

  async function login(email, password) {
    const data = await apiClient.login(email, password);
    if (data?.token) {
      Cookies.set("token", data.token, { expires: 1 });
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  }

  function logout() {
    Cookies.remove("token");
    setUser(null);
    setToken(null);
  }

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
