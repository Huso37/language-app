import { API_BASE_URL } from "@/constants/api";
import {
  buildGenerateLessonRequest,
  type GenerateLessonRequest,
  type GenerateLessonResponse,
  LessonValidationError,
  type NewLessonConfig,
} from "@/types/lesson";

export class LessonServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = "LessonServiceError";
    this.status = status;
  }
}

export async function generateLesson(
  config: NewLessonConfig,
): Promise<GenerateLessonResponse> {
  let request: GenerateLessonRequest;

  try {
    request = buildGenerateLessonRequest(config);
  } catch (error) {
    const message =
      error instanceof LessonValidationError
        ? error.message
        : "Invalid lesson configuration.";
    throw new LessonServiceError(message);
  }

  const response = await fetch(`${API_BASE_URL}/generate-lesson`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let message = "Failed to generate lesson";

    try {
      const body = (await response.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // ignore JSON parse errors
    }

    throw new LessonServiceError(message, response.status);
  }

  return response.json() as Promise<GenerateLessonResponse>;
}
