// Centralized Cloud Function Endpoints Configuration
// All functions run in asia‑south1 under a single base URL.

// Base URL for every Cloud Function revision
const CLOUD_FUNCTION_BASE_URL = 'https://asia-south1-nodal-vigil-460311-q8.cloudfunctions.net';
/** Helper to build the full URL for a Cloud Function by name */
const fn = (name: string): string => `${CLOUD_FUNCTION_BASE_URL}/${name}`;

export const CLOUD_RUN_ENDPOINTS = {
  // Asset Management API
  ASSETS: {
    UPLOAD: fn('assets-uploading'),
    IMPORT: fn('assets-importing'),
    DELETE: fn('asset-deletion'),
    OWN_STORE: fn('ownstoreasset')
  },

  // Brand Form API
  BRAND_FORM: {
    GET_BRAND_DETAILS: fn('get-brand-details-via-customurl')
  },

  // Environment Store API
  ENV_STORE: {
    GET_ENV_DATA: fn('get-env-data'),
    STORE_ENV_DATA: fn('storeenvdata')
  },

  // Login API
  LOGIN: {
    LOGIN_USER: fn('function-login-dashboard'),
    OAUTH_LOGIN: fn('function-oauth-login'),
    GOOGLE_USER_INFO: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json"
  },

  // Own Store API
  OWN_STORE: {
    FETCH_PRODUCTS: fn('fetch-products-by-vendor')
  },

  // Product Fetch API
  PRODUCT_FETCH: {
    SHOPIFY_PRODUCTS: fn('function-14')
  },

  // Dashboard API
  DASHBOARD: {
    FETCH_BRAND_DETAILS: fn('function-15')
  },

  // Cookie Validation API
  COOKIE: {
    VALIDATE: fn('function-cookie-validate')
  }
}; 