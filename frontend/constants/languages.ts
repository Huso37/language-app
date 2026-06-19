import type { ExperienceLevel, LanguageId } from "@/types/user-settings";

export type LanguageOption = {
  id: LanguageId;
  label: string;
  flag: string;
};

export type LevelOption = {
  id: ExperienceLevel;
  label: string;
};

export const NATIVE_LANGUAGES: LanguageOption[] = [
  { id: "english", label: "English", flag: "🇬🇧" },
  { id: "slovak", label: "Slovak", flag: "🇸🇰" },
];

export const LEARNING_LANGUAGES: LanguageOption[] = [
  { id: "spanish", label: "Spanish", flag: "🇪🇸" },
  { id: "german", label: "German", flag: "🇩🇪" },
  { id: "english", label: "English", flag: "🇬🇧" },
];

export const EXPERIENCE_LEVELS: LevelOption[] = [
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];
