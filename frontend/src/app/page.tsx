"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "@/components/loading-spinner";
import { useRedirectByRole } from "@/hooks/useRedirectByRole";

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useRedirectByRole(user, isAuthenticated);

  useEffect(() => {
    if (!loading && !isAuthenticated && !hasRedirected.current) {
      router.push("/login");
      hasRedirected.current = true;
    }

    if (isAuthenticated) {
      hasRedirected.current = false;
    }
  }, [isAuthenticated, loading, router]);

  return <LoadingSpinner />;
}
