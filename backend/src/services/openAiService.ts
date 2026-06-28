import OpenAI from "openai";

type NativeLanguage = "english" | "slovak";
type LearningLanguage = "spanish" | "german" | "english";
type LessonType = "words" | "sentences" | "phrases";
type LessonStyle = "matching" | "typing";
type LessonLevel = "beginner" | "intermediate" | "advanced";

export type GenerateVocabularyInput = {
  nativeLanguage: NativeLanguage;
  learningLanguage: LearningLanguage;
  lessonType: LessonType;
  lessonStyle: LessonStyle;
  category: string;
  level: LessonLevel;
  count: number;
  excludeWords: string[];
};

export type VocabularyWord = {
  nativeWord: string;
  targetWord: string;
  partOfSpeech: "noun" | "verb" | "adjective" | "phrase" | "other";
  exampleSentenceNative: string;
  exampleSentenceTarget: string;
};

const languageLabels: Record<NativeLanguage | LearningLanguage, string> = {
  english: "English",
  slovak: "Slovak",
  spanish: "Spanish",
  german: "German",
};

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing in backend/.env");
  }

  return new OpenAI({ apiKey });
}

export async function generateVocabularyWords(
  input: GenerateVocabularyInput
): Promise<VocabularyWord[]> {
  const openai = getOpenAIClient();

  const nativeLanguageLabel = languageLabels[input.nativeLanguage];
  const learningLanguageLabel = languageLabels[input.learningLanguage];

  const excludeText =
    input.excludeWords.length > 0
      ? input.excludeWords.join(", ")
      : "No excluded words.";

  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [
      {
        role: "system",
        content:
          "You generate vocabulary lesson content for a mobile language learning app. Return only structured lesson data.",
      },
      {
        role: "user",
        content: `
Create a ${input.lessonType} lesson.

Native language: ${nativeLanguageLabel}
Learning language: ${learningLanguageLabel}
Category: ${input.category}
Experience level: ${input.level}
Game style: ${input.lessonStyle}
Number of items: ${input.count}

Avoid these learning-language words/items:
${excludeText}

Rules:
- Return exactly ${input.count} items.
- Use practical, common vocabulary for the selected category.
- For beginner level, use very common words and short simple sentences.
- For intermediate level, use more specific everyday vocabulary.
- For advanced level, use more nuanced vocabulary.
- If the learning language is Spanish and the target item is a noun, targetWord must include the article "el" or "la".
- If the learning language is German and the target item is a noun, targetWord must include the article "der", "die", or "das".
- nativeWord must be in ${nativeLanguageLabel}.
- targetWord must be in ${learningLanguageLabel}.
- exampleSentenceNative must be in ${nativeLanguageLabel}.
- exampleSentenceTarget must be in ${learningLanguageLabel}.
- Do not include any excluded words/items.
        `.trim(),
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "lesson_words",
        strict: true,
        schema: {
          type: "object",
          additionalProperties: false,
          properties: {
            words: {
              type: "array",
              minItems: input.count,
              maxItems: input.count,
              items: {
                type: "object",
                additionalProperties: false,
                properties: {
                  nativeWord: {
                    type: "string",
                  },
                  targetWord: {
                    type: "string",
                  },
                  partOfSpeech: {
                    type: "string",
                    enum: ["noun", "verb", "adjective", "phrase", "other"],
                  },
                  exampleSentenceNative: {
                    type: "string",
                  },
                  exampleSentenceTarget: {
                    type: "string",
                  },
                },
                required: [
                  "nativeWord",
                  "targetWord",
                  "partOfSpeech",
                  "exampleSentenceNative",
                  "exampleSentenceTarget",
                ],
              },
            },
          },
          required: ["words"],
        },
      },
    },
  });

  const textOutput = response.output_text;

  if (!textOutput) {
    throw new Error("OpenAI returned empty response");
  }

  const parsed = JSON.parse(textOutput) as { words: VocabularyWord[] };

  if (!Array.isArray(parsed.words)) {
    throw new Error("OpenAI response does not contain words array");
  }

  if (parsed.words.length !== input.count) {
    throw new Error(
      `OpenAI returned ${parsed.words.length} words, expected ${input.count}`
    );
  }

  return parsed.words;
}