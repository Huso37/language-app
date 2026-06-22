import type { GenerateLessonResponse } from "@/types/lesson";

export type SavedLesson = {
  id: string;
  savedAt: number;
  lesson: GenerateLessonResponse;
};

export const MAX_SAVED_LESSONS = 10;
