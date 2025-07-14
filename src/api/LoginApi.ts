import LoginCredentials from "../Types/LoginCredentials";
import { CLOUD_RUN_ENDPOINTS } from "./cloudUtils";

const API_ENDPOINTS = {
  LOGIN_USER: CLOUD_RUN_ENDPOINTS.LOGIN.LOGIN_USER,
  OAUTH_LOGIN: CLOUD_RUN_ENDPOINTS.LOGIN.OAUTH_LOGIN,
  GOOGLE_USER_INFO: CLOUD_RUN_ENDPOINTS.LOGIN.GOOGLE_USER_INFO,
};

export const loginUser = async (credentials: LoginCredentials) => {
    try {
      const response = await fetch(API_ENDPOINTS.LOGIN_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
          region:"global"
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(
        `Login failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
};

export const getGoogleUserInfo = async (accessToken: string) => {
    const response = await fetch(API_ENDPOINTS.GOOGLE_USER_INFO, {
        headers: { Authorization: `Bearer ${accessToken}` },
    });
    return response.json();
};

export const checkGoogleOauth = async(email: string,oauthProviderId:string,name:string) =>{
    try{
    const backendResponse = await fetch(API_ENDPOINTS.OAUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          oauth_provider_id: oauthProviderId,
          name: name,
          region:"global"
        }),
      });
      if (!backendResponse.ok) {
        throw new Error(`HTTP error! status: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    return data;
} catch (error) {
    throw new Error(
        `OAuth login failed: ${
            error instanceof Error ? error.message : "Unknown error"
        }`
    );
}
};