import type { LessonCategory, LessonStyle, LessonType } from "@/types/lesson";

export type LessonOption<T extends string> = {
  id: T;
  label: string;
};

export const LESSON_TYPES: LessonOption<LessonType>[] = [
  { id: "words", label: "Words" },
  { id: "sentences", label: "Sentences" },
  { id: "phrases", label: "Phrases" },
];

export const LESSON_STYLES: LessonOption<LessonStyle>[] = [
  { id: "matching", label: "Matching" },
  { id: "typing", label: "Typing" },
];

export const LESSON_CATEGORIES: LessonOption<LessonCategory>[] = [
  { id: "kitchen", label: "Kitchen" },
  { id: "bathroom", label: "Bathroom" },
  { id: "living room", label: "Living room" },
  { id: "bedroom", label: "Bedroom" },
  { id: "car", label: "Car" },
  { id: "restaurant", label: "Restaurant" },
];

export const MIN_WORD_COUNT = 1;
export const MAX_WORD_COUNT = 15;
export const DEFAULT_NON_WORDS_COUNT = 10;

export const LESSON_CATEGORY_IDS = LESSON_CATEGORIES.map((item) => item.id);
