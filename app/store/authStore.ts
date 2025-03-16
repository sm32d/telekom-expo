import { create } from "zustand";
import authService from "../services/authService";
import { router } from "expo-router";

interface AuthState {
  isAuthenticated: boolean;
  bearerToken: string | null;
  refreshToken: string | null;
  phoneNumber: string | null;
  requestOTP: (phoneNumber: string) => Promise<void>;
  validateOTP: (otp: string) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set, get) => ({
  isAuthenticated: false,
  bearerToken: null,
  refreshToken: null,
  phoneNumber: null,

  requestOTP: async (phoneNumber: string) => {
    const response = await authService.requestOTP(phoneNumber);
    if (response.code === 0) {
      set({ phoneNumber });
    } else {
      throw new Error(response.message);
    }
  },

  validateOTP: async (otp: string) => {
    const { phoneNumber } = get();
    if (!phoneNumber) throw new Error("Phone number not found");

    const response = await authService.validateOTP(phoneNumber, otp);
    if (response.code === 0 && response.data) {
      set({
        isAuthenticated: true,
        bearerToken: response.data.token,
        refreshToken: response.data.refreshToken,
      });

      // Set up token refresh timer
      setTimeout(
        () => {
          get().refreshAuthToken();
        },
        (response.data.expires - 30) * 1000,
      ); // Refresh 30 seconds before expiry
    } else {
      throw new Error(response.message);
    }
  },

  refreshAuthToken: async () => {
    const { refreshToken, bearerToken } = get();
    if (!refreshToken || !bearerToken)
      throw new Error("No refresh token available");

    const response = await authService.refreshToken(refreshToken, bearerToken);
    if (response.code === 0 && response.data) {
      set({
        bearerToken: response.data.token,
        refreshToken: response.data.refreshToken,
      });

      // Set up next token refresh
      setTimeout(
        () => {
          get().refreshAuthToken();
        },
        (response.data.expires - 30) * 1000,
      );
    } else {
      // If refresh fails, log out
      get().logout();
    }
  },

  logout: () => {
    set({
      isAuthenticated: false,
      bearerToken: null,
      refreshToken: null,
      phoneNumber: null,
    });
    router.dismissAll();
    router.replace("/login");
  },
}));

export default useAuthStore;