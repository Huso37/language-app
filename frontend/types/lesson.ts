import type { ExperienceLevel, LanguageId } from "@/types/user-settings";

export type LessonType = "words" | "sentences" | "phrases";

export type LessonStyle = "matching" | "typing";

export type NewLessonConfig = {
  nativeLanguage: LanguageId;
  learningLanguage: LanguageId;
  experienceLevel: ExperienceLevel;
  lessonType: LessonType;
  wordCount?: number;
  lessonStyle: LessonStyle;
};
