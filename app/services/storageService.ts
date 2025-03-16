import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  BEARER_TOKEN: '@auth_bearer_token',
  REFRESH_TOKEN: '@auth_refresh_token',
  PHONE_NUMBER: '@auth_phone_number',
};

const storageService = {
  getStoredAuth: async () => {
    try {
      const [bearerToken, refreshToken, phoneNumber] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.BEARER_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.getItem(STORAGE_KEYS.PHONE_NUMBER),
      ]);

      return {
        bearerToken,
        refreshToken,
        phoneNumber,
      };
    } catch (error) {
      console.error('Error getting stored auth:', error);
      return {
        bearerToken: null,
        refreshToken: null,
        phoneNumber: null,
      };
    }
  },

  storeAuth: async ({
    bearerToken,
    refreshToken,
    phoneNumber,
  }: {
    bearerToken: string | null;
    refreshToken: string | null;
    phoneNumber: string | null;
  }) => {
    try {
      const promises = [];

      if (bearerToken) {
        promises.push(AsyncStorage.setItem(STORAGE_KEYS.BEARER_TOKEN, bearerToken));
      } else {
        promises.push(AsyncStorage.removeItem(STORAGE_KEYS.BEARER_TOKEN));
      }

      if (refreshToken) {
        promises.push(AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken));
      } else {
        promises.push(AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN));
      }

      if (phoneNumber) {
        promises.push(AsyncStorage.setItem(STORAGE_KEYS.PHONE_NUMBER, phoneNumber));
      } else {
        promises.push(AsyncStorage.removeItem(STORAGE_KEYS.PHONE_NUMBER));
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error storing auth:', error);
    }
  },

  clearAuth: async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.BEARER_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN),
        AsyncStorage.removeItem(STORAGE_KEYS.PHONE_NUMBER),
      ]);
    } catch (error) {
      console.error('Error clearing auth:', error);
    }
  },
};

export default storageService;