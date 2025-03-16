import AsyncStorage from '@react-native-async-storage/async-storage';

interface Profile {
  phoneNumber: string;
  label?: string;
  lastUsed: number;
}

const STORAGE_KEY = '@phone_profiles';

const profileService = {
  getProfiles: async (): Promise<Profile[]> => {
    try {
      const profilesJson = await AsyncStorage.getItem(STORAGE_KEY);
      return profilesJson ? JSON.parse(profilesJson) : [];
    } catch (error) {
      console.error('Error getting profiles:', error);
      return [];
    }
  },

  addProfile: async (phoneNumber: string, label?: string): Promise<void> => {
    try {
      const profiles = await profileService.getProfiles();
      const existingProfileIndex = profiles.findIndex(
        (profile) => profile.phoneNumber === phoneNumber
      );

      const newProfile: Profile = {
        phoneNumber,
        label,
        lastUsed: Date.now(),
      };

      if (existingProfileIndex >= 0) {
        profiles[existingProfileIndex] = newProfile;
      } else {
        profiles.push(newProfile);
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch (error) {
      console.error('Error adding profile:', error);
    }
  },

  updateLastUsed: async (phoneNumber: string): Promise<void> => {
    try {
      const profiles = await profileService.getProfiles();
      const profileIndex = profiles.findIndex(
        (profile) => profile.phoneNumber === phoneNumber
      );

      if (profileIndex >= 0) {
        profiles[profileIndex].lastUsed = Date.now();
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  },

  deleteProfile: async (phoneNumber: string): Promise<void> => {
    try {
      const profiles = await profileService.getProfiles();
      const filteredProfiles = profiles.filter(
        (profile) => profile.phoneNumber !== phoneNumber
      );
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredProfiles));
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  },
};

export default profileService;