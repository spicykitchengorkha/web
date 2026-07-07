"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get("/user");
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("auth_token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    setUser(null);
  }, []);

  const isAdmin = user?.role === "admin";

  return { user, loading, error, isAdmin, logout, refetch: fetchUser };
}
