"use client";
import { useEffect } from "react";
import { useAuth } from "@/components/context/auth-context";
import { useRouter } from "next/navigation";
import { authToken } from "@/lib/auth";
// Import apiClient instead of axios
import { apiClient } from "@/lib/utils";

/**
 * AuthSync component handles auth validation only on page refresh
 * and ensures proper auth state is maintained
 */
export function AuthSync() {
  const { refreshUserData, loading, user } = useAuth();
  const router = useRouter();

  // We don't need to configure axios defaults here since apiClient already has interceptors
  // that handle this in utils.ts

  // Effect that runs only once on page load/refresh to validate the token
  useEffect(() => {
    const validateAuth = async () => {
      // Always try to refresh user data when the page is loaded/refreshed if token exists
      const token = authToken.get();
      if (token) {
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