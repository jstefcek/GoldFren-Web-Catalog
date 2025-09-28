import { useCallback, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../services/authContext";
import { authService } from "../services/authService";

export function useAdminTokenValidation() {
  const { userInfo, logout } = useAuth();
  const { t } = useTranslation();
  const isVerifyingRef = useRef(false);
  const abortControllerRef = useRef(null);
  const hasLoggedOutRef = useRef(false);
  const transientFailureCountRef = useRef(0);

  const validateToken = useCallback(async () => {
    if (!userInfo?.access_token) {
      transientFailureCountRef.current = 0;
      return;
    }

    if (isVerifyingRef.current) {
      return;
    }

    isVerifyingRef.current = true;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const result = await authService.verifyAccessToken(userInfo.access_token, {
        signal: controller.signal,
      });

      if (result?.success) {
        transientFailureCountRef.current = 0;
        return;
      }

      if (!result) {
        return;
      }

      if (result.status === 401 || result.status === 403 || result.reason === "invalid-token") {
        if (!hasLoggedOutRef.current) {
          hasLoggedOutRef.current = true;
          logout(t("login_screen.session_expired"));
        }
        return;
      }

      transientFailureCountRef.current += 1;

      if (transientFailureCountRef.current === 1 || transientFailureCountRef.current % 3 === 0) {
        console.warn("Transient token validation failure", {
          status: result.status,
          reason: result.reason,
          networkError: result.networkError ?? false,
        });
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }

      console.warn("Token validation threw an unexpected error", error);

      if (!hasLoggedOutRef.current) {
        hasLoggedOutRef.current = true;
        logout(t("login_screen.session_expired"));
      }
    } finally {
      isVerifyingRef.current = false;
    }
  }, [logout, t, userInfo?.access_token]);

  useEffect(() => {
    hasLoggedOutRef.current = false;

    if (!userInfo?.access_token) {
      transientFailureCountRef.current = 0;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      return undefined;
    }

    // Perform initial validation on mount when token is present
    void validateToken();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, [userInfo?.access_token, validateToken]);

  return useCallback(() => {
    void validateToken();
  }, [validateToken]);
}
