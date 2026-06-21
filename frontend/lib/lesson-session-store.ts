import type { GenerateLessonResponse, NewLessonConfig } from "@/types/lesson";

type LessonSessionStore = {
  config: NewLessonConfig | null;
  lesson: GenerateLessonResponse | null;
};

const store: LessonSessionStore = {
  config: null,
  lesson: null,
};

export function setPendingLessonConfig(config: NewLessonConfig) {
  store.config = config;
  store.lesson = null;
}

export function setCurrentLesson(lesson: GenerateLessonResponse) {
  store.lesson = lesson;
}

export function getPendingLessonConfig() {
  return store.config;
}

export function getCurrentLesson() {
  return store.lesson;
}

export function clearLessonSession() {
  store.config = null;
  store.lesson = null;
}
