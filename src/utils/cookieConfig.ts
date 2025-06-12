interface CookieOptions {
  expires?: number;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  domain?: string;
}

export const getCookieConfig = (): CookieOptions => {
  // Use Vite's environment detection
  const isDevelopment = import.meta.env.DEV;
  
  console.log('Environment check:', {
    isDevelopment,
    mode: import.meta.env.MODE,
    prod: import.meta.env.PROD
  });
  
  if (isDevelopment) {
    return {
      expires: 2 / 24,      // 2 hours
      secure: false,        // No HTTPS required for localhost
      sameSite: "Lax",      // More permissive for development
      // No domain restriction for localhost
    };
  } else {
    return {
      expires: 2 / 24,      // 2 hours
      secure: true,         // Require HTTPS in production
      sameSite: "None",     // Required for cross-domain cookies
      domain: ".strategyfox.in"  // Domain restriction for production
    };
  }
};

export const getRemoveConfig = () => {
  const isDevelopment = import.meta.env.DEV;
  
  if (isDevelopment) {
    return {
      path: "/",
    };
  } else {
    return {
      domain: ".strategyfox.in",
      path: "/",
    };
  }
};

// Helper function to check environment
export const isProduction = () => import.meta.env.PROD;
export const isDevelopment = () => import.meta.env.DEV;
export const getEnvironment = () => import.meta.env.MODE;
