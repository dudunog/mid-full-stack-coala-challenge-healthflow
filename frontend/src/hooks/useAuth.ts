"use client";

import type { User } from "@/app/types/user";

import { useState, useCallback } from "react";

import { getUser, getToken } from "@/lib/auth";
import { signIn as signInService } from "@/lib/services/auth/signin.service";

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  return getUser();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [loading] = useState(false);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const response = await signInService({ email, password });
      localStorage.setItem("token", response.access_token);
      localStorage.setItem("user", JSON.stringify(response.user));

      setUser(response.user);
      return { success: true, user: response.user };
    } catch (error: unknown) {
      return {
        success: false,
        error: (error as Error).message || "Login failed",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }, []);

  const isAuthenticated = !!user;
  const token = getToken();

  return {
    user,
    loading,
    signIn,
    logout,
    isAuthenticated,
    token,
  };
}
