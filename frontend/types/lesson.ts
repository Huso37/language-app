import {
  LESSON_CATEGORY_IDS,
  DEFAULT_NON_WORDS_COUNT,
  MAX_WORD_COUNT,
  MIN_WORD_COUNT,
} from "@/constants/lesson-options";
import type { ExperienceLevel, LanguageId } from "@/types/user-settings";

export type LessonType = "words" | "sentences" | "phrases";

export type LessonStyle = "matching" | "typing";

export type LessonCategory =
  | "kitchen"
  | "bathroom"
  | "living room"
  | "bedroom"
  | "car"
  | "restaurant";

export type ApiNativeLanguage = "english" | "slovak";

export type ApiLearningLanguage = "spanish" | "german" | "english";

export type NewLessonConfig = {
  nativeLanguage: LanguageId;
  learningLanguage: LanguageId;
  experienceLevel: ExperienceLevel;
  lessonType: LessonType;
  wordCount?: number;
  lessonStyle: LessonStyle;
  category: LessonCategory;
  excludeWords?: string[];
};

export type GenerateLessonRequest = {
  nativeLanguage: ApiNativeLanguage;
  learningLanguage: ApiLearningLanguage;
  lessonType: LessonType;
  lessonStyle: LessonStyle;
  category: LessonCategory;
  level: ExperienceLevel;
  count: number;
  excludeWords: string[];
};

export type LessonWord = {
  nativeWord: string;
  targetWord: string;
  partOfSpeech: string;
  exampleSentenceNative: string;
  exampleSentenceTarget: string;
};

export type GenerateLessonResponse = {
  nativeLanguage: string;
  learningLanguage: string;
  lessonType: LessonType;
  lessonStyle: LessonStyle;
  category: string;
  level: ExperienceLevel;
  count: number;
  words: LessonWord[];
};

const API_NATIVE_LANGUAGES: ApiNativeLanguage[] = ["english", "slovak"];
const API_LEARNING_LANGUAGES: ApiLearningLanguage[] = [
  "spanish",
  "german",
  "english",
];
const API_LESSON_TYPES: LessonType[] = ["words", "sentences", "phrases"];
const API_LESSON_STYLES: LessonStyle[] = ["matching", "typing"];
const API_LEVELS: ExperienceLevel[] = [
  "beginner",
  "intermediate",
  "advanced",
];

export class LessonValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LessonValidationError";
  }
}

function isOneOf<T extends string>(value: string, allowed: readonly T[]): value is T {
  return (allowed as readonly string[]).includes(value);
}

export function parseWordCountInput(value: string): number | null {
  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) return null;

  const count = Number(trimmed);
  if (!Number.isInteger(count) || count < MIN_WORD_COUNT || count > MAX_WORD_COUNT) {
    return null;
  }

  return count;
}

export function buildGenerateLessonRequest(
  config: NewLessonConfig,
): GenerateLessonRequest {
  if (!isOneOf(config.nativeLanguage, API_NATIVE_LANGUAGES)) {
    throw new LessonValidationError("Invalid native language.");
  }

  if (!isOneOf(config.learningLanguage, API_LEARNING_LANGUAGES)) {
    throw new LessonValidationError("Invalid learning language.");
  }

  if (!isOneOf(config.lessonType, API_LESSON_TYPES)) {
    throw new LessonValidationError("Invalid lesson type.");
  }

  if (!isOneOf(config.lessonStyle, API_LESSON_STYLES)) {
    throw new LessonValidationError("Invalid lesson style.");
  }

  if (!isOneOf(config.experienceLevel, API_LEVELS)) {
    throw new LessonValidationError("Invalid experience level.");
  }

  if (!isOneOf(config.category, LESSON_CATEGORY_IDS)) {
    throw new LessonValidationError("Invalid category.");
  }

  let count: number;

  if (config.lessonType === "words") {
    if (
      config.wordCount === undefined ||
      !Number.isInteger(config.wordCount) ||
      config.wordCount < MIN_WORD_COUNT ||
      config.wordCount > MAX_WORD_COUNT
    ) {
      throw new LessonValidationError(
        `Word count must be an integer between ${MIN_WORD_COUNT} and ${MAX_WORD_COUNT}.`,
      );
    }
    count = config.wordCount;
  } else {
    count = DEFAULT_NON_WORDS_COUNT;
  }

  const excludeWords = config.excludeWords ?? [];
  if (
    !Array.isArray(excludeWords) ||
    excludeWords.some((word) => typeof word !== "string")
  ) {
    throw new LessonValidationError("Invalid exclude words list.");
  }

  return {
    nativeLanguage: config.nativeLanguage,
    learningLanguage: config.learningLanguage,
    lessonType: config.lessonType,
    lessonStyle: config.lessonStyle,
    category: config.category,
    level: config.experienceLevel,
    count,
    excludeWords,
  };
}
