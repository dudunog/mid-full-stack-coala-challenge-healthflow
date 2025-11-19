import type { User } from "@/app/types/user";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { getDashboardRoute } from "@/lib/get-dashboard-route";

/**
 * Hook to redirect authenticated users to their role-based dashboard
 * Only redirects once when user becomes available
 */
export function useRedirectByRole(user: User | null, isAuthenticated: boolean) {
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !hasRedirected.current) {
      const dashboardRoute = getDashboardRoute(user.role);
      router.push(dashboardRoute);
      hasRedirected.current = true;
    }

    if (!isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, user, router]);
}
