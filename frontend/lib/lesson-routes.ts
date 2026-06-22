import type { Href } from "expo-router";

import type { GenerateLessonResponse, LessonStyle } from "@/types/lesson";

export function getLessonGameRoute(lesson: GenerateLessonResponse): Href {
  const routes: Record<LessonStyle, Href> = {
    matching: "/lessons/matching",
    typing: "/lessons/typing",
  };

  return routes[lesson.lessonStyle];
}
