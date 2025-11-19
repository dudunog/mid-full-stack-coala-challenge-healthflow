"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRedirectByRole } from "@/hooks/useRedirectByRole";

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, user } = useAuth();

  useRedirectByRole(user, isAuthenticated);

  return <>{children}</>;
}
