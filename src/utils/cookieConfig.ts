interface CookieOptions {
  expires?: number;
  secure?: boolean;
  sameSite?: "Strict" | "Lax" | "None";
  domain?: string;
}

export const getCookieConfig = (): CookieOptions => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return {
      expires: 2 / 24,      // 1 hour
      secure: false,        // No HTTPS required for localhost
      sameSite: "Lax",      // More permissive for development
      // No domain restriction for localhost
    };
  } else {
    // Determine domain based on current hostname
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    let domain: string | undefined;
    
    if (hostname.includes('shackit.in')) {
      domain = '.shackit.in';
    } else if (hostname.includes('shackit.com')) {
      domain = '.shackit.com';
    }
    
    return {
      expires: 2 / 24,      // 1 hour
      secure: true,         // Require HTTPS in production
      sameSite: "Strict",   // Strict security in production
      domain: domain        // Domain restriction based on current hostname
    };
  }
};

export const getRemoveConfig = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment) {
    return {
      path: "/",
    };
  } else {
    // Determine domain based on current hostname
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    let domain: string | undefined;
    
    if (hostname.includes('shackit.in')) {
      domain = '.shackit.in';
    } else if (hostname.includes('shackit.com')) {
      domain = '.shackit.com';
    } 
    
    return {
      domain: domain,
      path: "/",
    };
  }
};

// Helper function to check environment
export const isProduction = () => process.env.NODE_ENV === 'production';
export const isDevelopment = () => process.env.NODE_ENV === 'development';
export const getEnvironment = () => process.env.NODE_ENV;
