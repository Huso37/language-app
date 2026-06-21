import { Router } from "express";
import { z } from "zod";

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

type PartOfSpeech = "noun" | "verb" | "adjective" | "phrase" | "other";

type MockWord = {
  nativeWord: string;
  targetWord: string;
  partOfSpeech: PartOfSpeech;
  exampleSentenceNative: string;
  exampleSentenceTarget: string;
};

const mockWords: MockWord[] = [
  {
    nativeWord: "spoon",
    targetWord: "la cuchara",
    partOfSpeech: "noun",
    exampleSentenceNative: "I need a spoon.",
    exampleSentenceTarget: "Necesito una cuchara.",
  },
  {
    nativeWord: "plate",
    targetWord: "el plato",
    partOfSpeech: "noun",
    exampleSentenceNative: "The plate is on the table.",
    exampleSentenceTarget: "El plato está en la mesa.",
  },
  {
    nativeWord: "fork",
    targetWord: "el tenedor",
    partOfSpeech: "noun",
    exampleSentenceNative: "The fork is clean.",
    exampleSentenceTarget: "El tenedor está limpio.",
  },
  {
    nativeWord: "glass",
    targetWord: "el vaso",
    partOfSpeech: "noun",
    exampleSentenceNative: "I want a glass of water.",
    exampleSentenceTarget: "Quiero un vaso de agua.",
  },
  {
    nativeWord: "knife",
    targetWord: "el cuchillo",
    partOfSpeech: "noun",
    exampleSentenceNative: "The knife is sharp.",
    exampleSentenceTarget: "El cuchillo está afilado.",
  },
  {
    nativeWord: "table",
    targetWord: "la mesa",
    partOfSpeech: "noun",
    exampleSentenceNative: "The table is small.",
    exampleSentenceTarget: "La mesa es pequeña.",
  },
  {
    nativeWord: "chair",
    targetWord: "la silla",
    partOfSpeech: "noun",
    exampleSentenceNative: "The chair is near the table.",
    exampleSentenceTarget: "La silla está cerca de la mesa.",
  },
  {
    nativeWord: "cup",
    targetWord: "la taza",
    partOfSpeech: "noun",
    exampleSentenceNative: "The cup is white.",
    exampleSentenceTarget: "La taza es blanca.",
  },
  {
    nativeWord: "pan",
    targetWord: "la sartén",
    partOfSpeech: "noun",
    exampleSentenceNative: "The pan is hot.",
    exampleSentenceTarget: "La sartén está caliente.",
  },
  {
    nativeWord: "fridge",
    targetWord: "la nevera",
    partOfSpeech: "noun",
    exampleSentenceNative: "The fridge is full.",
    exampleSentenceTarget: "La nevera está llena.",
  },
];

generateLessonRouter.post("/", async (req, res) => {
  try {
    const requestData = GenerateLessonRequestSchema.parse(req.body);

    console.log("Generate lesson request:", requestData);

    const words = mockWords.slice(0, requestData.count);

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
    console.error("Failed to generate mock lesson:", error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: "Invalid request body",
        details: error.flatten(),
      });
    }

    return res.status(500).json({
      error: "Failed to generate mock lesson",
    });
  }
});