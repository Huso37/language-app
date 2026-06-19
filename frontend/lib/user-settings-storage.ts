import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  DEFAULT_USER_SETTINGS,
  type UserSettings,
} from "@/types/user-settings";

const STORAGE_KEY = "@language_app/user_settings";

export async function getUserSettings(): Promise<UserSettings | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    return { ...DEFAULT_USER_SETTINGS, ...JSON.parse(raw) } as UserSettings;
  } catch {
    return null;
  }
}

export async function saveUserSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export async function hasCompletedInitSettings(): Promise<boolean> {
  const settings = await getUserSettings();
  return settings?.initCompleted === true;
}
