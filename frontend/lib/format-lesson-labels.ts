import {
  LESSON_CATEGORIES,
  LESSON_STYLES,
  LESSON_TYPES,
} from "@/constants/lesson-options";
import {
  LEARNING_LANGUAGES,
  NATIVE_LANGUAGES,
} from "@/constants/languages";
import type { GenerateLessonResponse } from "@/types/lesson";

function getLanguageLabel(id: string) {
  const option = [...NATIVE_LANGUAGES, ...LEARNING_LANGUAGES].find(
    (lang) => lang.id === id,
  );
  return option ? `${option.flag} ${option.label}` : id;
}

function getOptionLabel<T extends string>(
  id: string,
  options: { id: T; label: string }[],
) {
  return options.find((option) => option.id === id)?.label ?? id;
}

export function formatLessonSummary(lesson: GenerateLessonResponse) {
  return {
    languages: `${getLanguageLabel(lesson.nativeLanguage)} → ${getLanguageLabel(lesson.learningLanguage)}`,
    category: getOptionLabel(lesson.category, LESSON_CATEGORIES),
    lessonType: getOptionLabel(lesson.lessonType, LESSON_TYPES),
    lessonStyle: getOptionLabel(lesson.lessonStyle, LESSON_STYLES),
  };
}
