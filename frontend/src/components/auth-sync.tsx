"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useRouter } from "next/navigation";
import { authToken } from "@/lib/auth";

/**
 * AuthSync component handles auth validation only on page refresh
 */
export function AuthSync() {
  const { refreshUserData, loading, user } = useAuth();
  const router = useRouter();

  // Effect that runs only once on page load/refresh to validate the token
  useEffect(() => {
    const validateAuth = async () => {
      // Only try to refresh user data when the page is loaded/refreshed
      if (authToken.get() && !user) {
        try {
          await refreshUserData();
          console.log("Auth refreshed successfully");
        } catch (error) {
          console.error("Failed to refresh authentication:", error);
        }
      }
    };

    if (!loading) {
      validateAuth();
    }
  }, [loading]); // Only re-run when loading changes

  return null;
}