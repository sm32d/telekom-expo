import { create } from "zustand";
import authService from "../services/authService";
import storageService from "../services/storageService";
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
      await storageService.storeAuth({ bearerToken: null, refreshToken: null, phoneNumber });
    } else {
      throw new Error(response.message);
    }
  },

  validateOTP: async (otp: string) => {
    const { phoneNumber } = get();
    if (!phoneNumber) throw new Error("Phone number not found");

    const response = await authService.validateOTP(phoneNumber, otp);
    if (response.code === 0 && response.data) {
      const authData = {
        bearerToken: response.data.token,
        refreshToken: response.data.refreshToken,
        phoneNumber
      };
      set({
        isAuthenticated: true,
        ...authData
      });
      await storageService.storeAuth(authData);

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
    if (!refreshToken || !bearerToken) {
      const storedAuth = await storageService.getStoredAuth();
      if (storedAuth.refreshToken && storedAuth.bearerToken) {
        set({
          bearerToken: storedAuth.bearerToken,
          refreshToken: storedAuth.refreshToken,
          phoneNumber: storedAuth.phoneNumber
        });
        return get().refreshAuthToken();
      }
      throw new Error("No refresh token available");
    }

    try {
      const response = await authService.refreshToken(refreshToken, bearerToken);
      if (response.code === 0 && response.data) {
        const authData = {
          bearerToken: response.data.token,
          refreshToken: response.data.refreshToken,
          phoneNumber: get().phoneNumber
        };
        set(authData);
        await storageService.storeAuth(authData);

        const refreshDelay = Math.max((response.data.expires - 30) * 1000, 1000);
        // Set up next token refresh
        setTimeout(
          () => {
            get().refreshAuthToken().catch((error) => {
              console.error('Token refresh failed:', error);
              // Only logout if the error is not network-related
              if (!(error instanceof TypeError)) {
                get().logout();
              }
            });
          },
          refreshDelay
        );
      } else {
        // If refresh fails with invalid token, log out
        get().logout();
      }
    } catch (error) {
      if (error instanceof TypeError) {
        // Network error, retry after delay
        setTimeout(() => get().refreshAuthToken(), 5000);
      } else {
        get().logout();
      }
    }
  },

  logout: async () => {
    set({
      isAuthenticated: false,
      bearerToken: null,
      refreshToken: null,
      phoneNumber: null,
    });
    await storageService.clearAuth();
    router.dismissAll();
    router.replace("/login");
  },
}));

export default useAuthStore;