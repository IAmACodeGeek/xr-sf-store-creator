import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const useAutoLogin = (redirectPath = "/dashboard") => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const hasCheckedRef = useRef(false); // Prevent multiple executions
  const isCheckingRef = useRef(false); // Prevent concurrent requests

  const checkAuthentication = useCallback(async () => {
    if (isCheckingRef.current || hasCheckedRef.current) {
      return;
    }

    isCheckingRef.current = true;

    try {
      const token = getCookie("accessToken");

      if (!token) {
        setIsChecking(false);
        hasCheckedRef.current = true;
        return;
      }

      const response = await fetch(
        "https://function-cookie-validate-201137466588.asia-south1.run.app",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const authData = await response.json();

        if (authData.success && authData.user) {
          const urlParams = new URLSearchParams(window.location.search);
          const brandNameFromQuery = urlParams.get("brandName");
          const storedBrandName = getCookie("brandName");

          if (!brandNameFromQuery) {
            console.log("No brandName in query - rejecting authentication");
            localStorage.removeItem("user");
            document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            if (storedBrandName) {
              document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            }
            setIsChecking(false);
            hasCheckedRef.current = true;
            return;
          }

          if (storedBrandName && brandNameFromQuery !== storedBrandName) {
            localStorage.removeItem("user");
            document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            setIsChecking(false);
            hasCheckedRef.current = true;
            return;
          }

          try {
            const user = authData.user;
            const brandResponse = await fetch(
              "https://function-15-201137466588.asia-south1.run.app",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: user.email }),
              }
            );

            if (!brandResponse.ok) {
              throw new Error(`Brand API returned status ${brandResponse.status}`);
            }

            const brandData = await brandResponse.json();
            console.log("Auto-login brand verification:", brandData);

            if (brandData["brand_name"] === brandNameFromQuery) {
              if (!storedBrandName) {
                document.cookie = `brandName=${brandNameFromQuery};expires=${new Date(Date.now() + 60*60*1000).toUTCString()};path=/;secure;samesite=strict`;
              }
              hasCheckedRef.current = true;
              setIsChecking(false);
              navigate(redirectPath, { replace: true });
              return;
            } else {
              console.log("Brand mismatch during auto-login:", {
                expected: brandNameFromQuery,
                actual: brandData["brand_name"]
              });
              localStorage.removeItem("user");
              document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
              document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
              setIsChecking(false);
              hasCheckedRef.current = true;
              return;
            }
          } catch (error) {
            console.error("Brand verification failed during auto-login:", error);
            localStorage.removeItem("user");
            document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
            setIsChecking(false);
            hasCheckedRef.current = true;
            return;
          }
        }
      }

      document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      
    } catch (error) {
      console.error("Auto login check failed:", error);
      localStorage.removeItem("user");
      document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
      document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
    } finally {
      setIsChecking(false);
      isCheckingRef.current = false;
      hasCheckedRef.current = true;
    }
  }, [navigate, redirectPath]);

  useEffect(() => {
    if (!hasCheckedRef.current) {
      checkAuthentication();
    }

    return () => {
      isCheckingRef.current = false;
    };
  }, []); 

  return { isChecking };
};

export default useAutoLogin;