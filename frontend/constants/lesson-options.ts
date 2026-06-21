import type { LessonStyle, LessonType } from "@/types/lesson";

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

export const DEFAULT_WORD_COUNT = 10;
