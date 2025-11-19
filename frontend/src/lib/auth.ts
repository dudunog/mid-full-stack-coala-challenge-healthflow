import type { User } from "@/app/types/user";

/**
 * Gets token from localStorage
 * @returns Token or null if not found
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/**
 * Gets user from localStorage
 * @returns User object or null if not found/invalid
 */
export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser) as User;

    if (user.id && user.email && user.role) {
      return user;
    }
  } catch {}

  return null;
}

export function isAuthenticated(): boolean {
  return getUser() !== null;
}
