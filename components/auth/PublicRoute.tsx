"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is fully logged in and onboarded, keep them away from signup
    if (!loading && user && profile) {
      router.push("/dashboard");
    }
  }, [user, profile, loading, router]);

  if (loading) return null;

  // We allow access if not logged in OR if logged in but onboarding incomplete
  return !user || !profile ? <>{children}</> : null;
}
