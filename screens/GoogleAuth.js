import * as WebBrowser from "expo-web-browser";
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Google from "expo-auth-session/providers/google";

const googleConfig = {
  clientId:
    "333100533712-1b0lq975alnqoq0ugjbji1cps26in40v.apps.googleusercontent.com",
  redirectUrl: "https://nahor.coinsway.games",
  responseType: "token",
  scopes: ["openid", "profile", "email"],
};

export const googleSignIn = async () => {
  try {
    const authUrl =
      `https://accounts.google.com/o/oauth2/auth` +
      `?client_id=${googleConfig.clientId}` +
      `&redirect_uri=${encodeURIComponent(googleConfig.redirectUrl)}` +
      `&response_type=${googleConfig.responseType}` +
      `&scope=${encodeURIComponent(googleConfig.scopes.join(" "))}`;

    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      googleConfig.redirectUrl,
      { showInRecents: true }
    );

    if (result.type === "success") {
      // Extract access token from the result
      const accessToken = result.params.access_token;

      // Fetch user information using the access token
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (userInfoResponse.ok) {
        const userInfo = await userInfoResponse.json();

        // Handle the user information
        console.log("User Information:", userInfo);

        // Return the user information
        return userInfo;
      } else {
        console.error("Failed to fetch user information");
        return null;
      }
    } else {
      console.error("Google sign-in failed");
      return null;
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
    return null;
  }
};
