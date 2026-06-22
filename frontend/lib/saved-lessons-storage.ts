import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  MAX_SAVED_LESSONS,
  type SavedLesson,
} from "@/types/saved-lesson";
import type { GenerateLessonResponse } from "@/types/lesson";

const STORAGE_KEY = "@language_app/saved_lessons";

function createLessonId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export async function getSavedLessons(): Promise<SavedLesson[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as SavedLesson[];
    if (!Array.isArray(parsed)) return [];

    return parsed.sort((a, b) => b.savedAt - a.savedAt);
  } catch {
    return [];
  }
}

export async function getSavedLessonCount(): Promise<number> {
  const lessons = await getSavedLessons();
  return lessons.length;
}

export async function canSaveNewLesson(): Promise<boolean> {
  const count = await getSavedLessonCount();
  return count < MAX_SAVED_LESSONS;
}

export async function saveLesson(
  lesson: GenerateLessonResponse,
): Promise<SavedLesson> {
  const existing = await getSavedLessons();

  if (existing.length >= MAX_SAVED_LESSONS) {
    throw new Error("Lesson storage is full.");
  }

  const savedLesson: SavedLesson = {
    id: createLessonId(),
    savedAt: Date.now(),
    lesson,
  };

  const nextLessons = [savedLesson, ...existing];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextLessons));

  return savedLesson;
}

export async function deleteSavedLessons(ids: string[]): Promise<void> {
  if (ids.length === 0) return;

  const existing = await getSavedLessons();
  const idsToDelete = new Set(ids);
  const nextLessons = existing.filter((item) => !idsToDelete.has(item.id));

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextLessons));
}

export async function getSavedLessonById(
  id: string,
): Promise<SavedLesson | null> {
  const lessons = await getSavedLessons();
  return lessons.find((item) => item.id === id) ?? null;
}
