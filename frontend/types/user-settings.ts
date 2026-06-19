export type LanguageId = "english" | "slovak" | "spanish" | "german";

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";

export type UserSettings = {
  userName: string;
  nativeLanguage: LanguageId | null;
  learningLanguages: LanguageId[];
  experienceLevel: ExperienceLevel | null;
  initCompleted: boolean;
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  userName: "",
  nativeLanguage: null,
  learningLanguages: [],
  experienceLevel: null,
  initCompleted: false,
};
