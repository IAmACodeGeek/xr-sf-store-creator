import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { getCookieConfig, getRemoveConfig } from "./utils/cookieConfig";
import { CLOUD_RUN_ENDPOINTS } from "./api/cloudUtils";

const useAutoLogin = (redirectPath = "/dashboard") => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const hasCheckedRef = useRef(false);
  const isCheckingRef = useRef(false);

  const clearAuthData = useCallback(() => {
    localStorage.removeItem("user");
    // Use environment-specific remove configuration
    const removeConfig = getRemoveConfig();
    Cookies.remove("accessToken", removeConfig);
    Cookies.remove("brandName", removeConfig);
    // Also try removing without domain (fallback)
    Cookies.remove("accessToken");
    Cookies.remove("brandName");
  }, []);

  const checkAuthentication = useCallback(async () => {
    if (isCheckingRef.current || hasCheckedRef.current) {
      return;
    }

    isCheckingRef.current = true;

    try {
      const token = Cookies.get("accessToken"); // Use Cookies.get() instead of getCookie

      if (!token) {
        setIsChecking(false);
        hasCheckedRef.current = true;
        return;
      }

      console.log("Found token, validating with cloud function...");

      const response = await fetch(
        CLOUD_RUN_ENDPOINTS.COOKIE.VALIDATE,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body:JSON.stringify({
            region:"global"
          })
        }
      );

      if (response.ok) {
        const authData = await response.json();
        console.log("Cloud function response:", authData);

        if (authData.success && authData.user) {
          const urlParams = new URLSearchParams(window.location.search);
          const brandNameFromQuery = urlParams.get("brandName");
          const storedBrandName = Cookies.get("brandName"); // Use Cookies.get()

          console.log("Brand check:", {
            brandNameFromQuery,
            storedBrandName,
          });

          if (!brandNameFromQuery) {
            console.log("No brandName in query - rejecting authentication");
            clearAuthData();
            setIsChecking(false);
            hasCheckedRef.current = true;
            return;
          }

          if (storedBrandName && brandNameFromQuery !== storedBrandName) {
            console.log("Brand mismatch in cookies - clearing auth");
            clearAuthData();
            setIsChecking(false);
            hasCheckedRef.current = true;
            return;
          }

          try {
            const user = authData.user;
            console.log(
              "Verifying brand with function-15 for user:",
              user.email
            );

            const brandResponse = await fetch(
              CLOUD_RUN_ENDPOINTS.DASHBOARD.FETCH_BRAND_DETAILS,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
              }
            );

            if (!brandResponse.ok) {
              throw new Error(
                `Brand API returned status ${brandResponse.status}`
              );
            }

            const brandData = await brandResponse.json();
            console.log("Auto-login brand verification:", brandData);

            if (brandData["brand_name"] === brandNameFromQuery) {
              // Store brand name if not already stored
              if (!storedBrandName) {
                Cookies.set("brandName", brandNameFromQuery, getCookieConfig());
              }

              console.log(
                "Auto-login successful, redirecting to:",
                redirectPath
              );
              hasCheckedRef.current = true;
              setIsChecking(false);
              navigate(redirectPath, { replace: true });
              return;
            } else {
              console.log("Brand mismatch during auto-login:", {
                expected: brandNameFromQuery,
                actual: brandData["brand_name"],
              });
              clearAuthData();
              setIsChecking(false);
              hasCheckedRef.current = true;
              return;
            }
          } catch (error) {
            console.error(
              "Brand verification failed during auto-login:",
              error
            );
            clearAuthData();
            setIsChecking(false);
            hasCheckedRef.current = true;
            return;
          }
        } else {
          console.log("Cloud function returned unsuccessful response");
        }
      } else {
        console.log(
          "Cloud function validation failed with status:",
          response.status
        );
      }

      // If we reach here, authentication failed
      clearAuthData();
    } catch (error) {
      console.error("Auto login check failed:", error);
      clearAuthData();
    } finally {
      setIsChecking(false);
      isCheckingRef.current = false;
      hasCheckedRef.current = true;
    }
  }, [navigate, redirectPath, clearAuthData]);

  useEffect(() => {
    if (!hasCheckedRef.current) {
      console.log("Starting auto-login check...");
      checkAuthentication();
    }

    return () => {
      isCheckingRef.current = false;
    };
  }, [checkAuthentication]);

  return { isChecking };
};

export default useAutoLogin;