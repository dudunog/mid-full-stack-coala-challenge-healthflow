"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { CircularProgress, Box } from "@mui/material";

import { useAuth } from "@/hooks/useAuth";
import { isValidRole } from "@/lib/role-utils";
import { getDashboardRoute } from "@/lib/get-dashboard-route";

type Props = {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
};

/**
 * Component to protect routes based on authentication status
 * @param requireAuth - If true, redirects to login if not authenticated
 * @param redirectTo - Custom redirect path (defaults to /login)
 */
export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: Props) {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated && user) {
        if (isValidRole(user.role)) {
          const dashboardRoute = getDashboardRoute(user.role);
          router.push(dashboardRoute);
        }
      }
    }
  }, [isAuthenticated, user, loading, requireAuth, redirectTo, router]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
