import OpenAI from "openai";

type GenerateVocabularyWordsInput = {
  nativeLanguage: "English" | "Slovak";
  learningLanguage: "Spanish" | "German";
  category: string;
  level: "beginner" | "intermediate" | "advanced";
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

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing in backend/.env");
  }

  return new OpenAI({ apiKey });
}

export async function generateVocabularyWords(
  input: GenerateVocabularyWordsInput
): Promise<VocabularyWord[]> {
  const openai = getOpenAIClient();

  const excludeText =
    input.excludeWords.length > 0
      ? input.excludeWords.join(", ")
      : "No excluded words.";

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.7,
    messages: [
      {
        role: "system",
        content:
          "You generate vocabulary lessons for a mobile language learning app. Return only valid JSON. Do not include markdown.",
      },
      {
        role: "user",
        content: `
Create ${input.count} useful vocabulary items.

Native language: ${input.nativeLanguage}
Learning language: ${input.learningLanguage}
Category: ${input.category}
Level: ${input.level}

Avoid these learning-language words:
${excludeText}

Return JSON in this exact format:
{
  "words": [
    {
      "nativeWord": "word in native language",
      "targetWord": "word in learning language",
      "partOfSpeech": "noun",
      "exampleSentenceNative": "simple sentence in native language",
      "exampleSentenceTarget": "simple sentence in learning language"
    }
  ]
}

Rules:
- Return exactly ${input.count} words.
- Use common, practical vocabulary.
- If the target word is a noun in Spanish or German, include the article where natural.
- Keep sentences short and beginner-friendly for beginner level.
- Do not include excluded words.
        `.trim(),
      },
    ],
    response_format: {
      type: "json_object",
    },
  });

  const content = response.choices[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned empty response");
  }

  const parsed = JSON.parse(content);

  if (!Array.isArray(parsed.words)) {
    throw new Error("OpenAI response does not contain words array");
  }

  return parsed.words;
}