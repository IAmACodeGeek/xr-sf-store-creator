import { useEffect, useState } from "react";
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

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = getCookie("accessToken");

        if (!token) {
          setIsChecking(false);
          return;
        }

        const response = await fetch(
          "https://your-region-your-project.cloudfunctions.net/authMe",
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

            if (brandNameFromQuery) {
              if (storedBrandName && brandNameFromQuery !== storedBrandName) {
                localStorage.removeItem("user");
                document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
                document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
                setIsChecking(false);
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
                  return;
                }
              } catch (error) {
                console.error("Brand verification failed during auto-login:", error);
                localStorage.removeItem("user");
                document.cookie = "accessToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
                document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
                setIsChecking(false);
                return;
              }
            } else {
              if (storedBrandName) {
                document.cookie = "brandName=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
              }
              navigate(redirectPath, { replace: true });
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
      }
    };

    checkAuthentication();
  }, [navigate, redirectPath]);

  return { isChecking };
};

export default useAutoLogin;
