import { Router } from "express";
import { z } from "zod";

import { generateVocabularyWords } from "../services/openAiService.js";

export const generateLessonRouter = Router();

const GenerateLessonRequestSchema = z.object({
  nativeLanguage: z.enum(["english", "slovak"]),
  learningLanguage: z.enum(["spanish", "german", "english"]),
  lessonType: z.enum(["words", "sentences", "phrases"]),
  lessonStyle: z.enum(["matching", "typing"]),
  category: z.string().min(1).max(50),
  level: z.enum(["beginner", "intermediate", "advanced"]),
  count: z.number().int().min(1).max(15),
  excludeWords: z.array(z.string()).default([]),
});

generateLessonRouter.post("/", async (req, res) => {
  try {
    const requestData = GenerateLessonRequestSchema.parse(req.body);

    console.log("Generate lesson request:", requestData);

    const words = await generateVocabularyWords(requestData);

    return res.json({
      nativeLanguage: requestData.nativeLanguage,
      learningLanguage: requestData.learningLanguage,
      lessonType: requestData.lessonType,
      lessonStyle: requestData.lessonStyle,
      category: requestData.category,
      level: requestData.level,
      count: words.length,
      words,
    });
  } catch (error) {
    console.error("Failed to generate lesson:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: z.treeifyError(error),
      });
    }

    const message =
      error instanceof Error ? error.message : "Failed to generate lesson";

    return res.status(500).json({
      error: message,
    });
  }
});