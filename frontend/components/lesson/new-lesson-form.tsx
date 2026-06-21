import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SelectField } from "@/components/lesson/select-field";
import {
  LESSON_CATEGORIES,
  LESSON_STYLES,
  LESSON_TYPES,
  MAX_WORD_COUNT,
  MIN_WORD_COUNT,
} from "@/constants/lesson-options";
import {
  EXPERIENCE_LEVELS,
  LEARNING_LANGUAGES,
  NATIVE_LANGUAGES,
} from "@/constants/languages";
import type {
  LessonCategory,
  LessonStyle,
  LessonType,
  NewLessonConfig,
} from "@/types/lesson";
import { parseWordCountInput } from "@/types/lesson";
import type { ExperienceLevel, LanguageId, UserSettings } from "@/types/user-settings";

type NewLessonFormProps = {
  userSettings: UserSettings;
  onStart: (config: NewLessonConfig) => void | Promise<void>;
};

function toSelectOptions<T extends string>(
  items: { id: T; label: string; flag?: string }[],
) {
  return items.map((item) => ({
    value: item.id,
    label: item.flag ? `${item.flag} ${item.label}` : item.label,
  }));
}

export function NewLessonForm({ userSettings, onStart }: NewLessonFormProps) {
  const availableLearningLanguages = LEARNING_LANGUAGES.filter((lang) =>
    userSettings.learningLanguages.includes(lang.id),
  );

  const [nativeLanguage, setNativeLanguage] = useState<LanguageId | null>(
    userSettings.nativeLanguage,
  );
  const [learningLanguage, setLearningLanguage] = useState<LanguageId | null>(
    userSettings.learningLanguages[0] ?? null,
  );
  const [experienceLevel] = useState<ExperienceLevel | null>(
    userSettings.experienceLevel,
  );
  const [lessonType, setLessonType] = useState<LessonType | null>("words");
  const [wordCount, setWordCount] = useState("");
  const [lessonStyle, setLessonStyle] = useState<LessonStyle | null>("matching");
  const [category, setCategory] = useState<LessonCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWordCountChange = (value: string) => {
    setWordCount(value.replace(/[^\d]/g, ""));
  };

  const handleStart = async () => {
    if (!nativeLanguage || !NATIVE_LANGUAGES.some((lang) => lang.id === nativeLanguage)) {
      Alert.alert("Missing language", "Please choose your default language.");
      return;
    }
    if (
      !learningLanguage ||
      !availableLearningLanguages.some((lang) => lang.id === learningLanguage)
    ) {
      Alert.alert("Missing language", "Please choose a learning language.");
      return;
    }
    if (
      !experienceLevel ||
      !EXPERIENCE_LEVELS.some((level) => level.id === experienceLevel)
    ) {
      Alert.alert("Missing level", "Complete your profile settings first.");
      return;
    }
    if (!lessonType || !LESSON_TYPES.some((type) => type.id === lessonType)) {
      Alert.alert("Missing type", "Please choose a lesson type.");
      return;
    }
    if (!lessonStyle || !LESSON_STYLES.some((style) => style.id === lessonStyle)) {
      Alert.alert("Missing style", "Please choose a lesson style.");
      return;
    }
    if (!category || !LESSON_CATEGORIES.some((item) => item.id === category)) {
      Alert.alert("Missing category", "Please choose a category.");
      return;
    }

    let parsedWordCount: number | undefined;
    if (lessonType === "words") {
      const count = parseWordCountInput(wordCount);
      if (count === null) {
        Alert.alert(
          "Invalid number",
          `Enter a whole number between ${MIN_WORD_COUNT} and ${MAX_WORD_COUNT}.`,
        );
        return;
      }
      parsedWordCount = count;
    }

    const config: NewLessonConfig = {
      nativeLanguage,
      learningLanguage,
      experienceLevel,
      lessonType,
      lessonStyle,
      category,
      ...(lessonType === "words" ? { wordCount: parsedWordCount } : {}),
      excludeWords: [],
    };

    setIsSubmitting(true);
    try {
      await onStart(config);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>New lesson</Text>
          <Text style={styles.subtitle}>
            Configure your lesson, then we'll send it to the backend.
          </Text>
        </View>

        <SelectField
          label="Default language"
          value={nativeLanguage}
          options={toSelectOptions(NATIVE_LANGUAGES)}
          onChange={setNativeLanguage}
          placeholder="Choose default language"
        />

        <SelectField
          label="Learning language"
          value={learningLanguage}
          options={toSelectOptions(availableLearningLanguages)}
          onChange={setLearningLanguage}
          placeholder="Choose learning language"
        />

        <SelectField
          label="Level"
          value={experienceLevel}
          options={toSelectOptions(EXPERIENCE_LEVELS)}
          onChange={() => {}}
          disabled
        />

        <SelectField
          label="Category"
          value={category}
          options={toSelectOptions(LESSON_CATEGORIES)}
          onChange={setCategory}
          placeholder="Choose category"
        />

        <SelectField
          label="Lesson type"
          value={lessonType}
          options={toSelectOptions(LESSON_TYPES)}
          onChange={setLessonType}
          placeholder="Choose lesson type"
        />

        {lessonType === "words" && (
          <View style={styles.section}>
            <Text style={styles.label}>Number of words</Text>
            <TextInput
              style={styles.input}
              value={wordCount}
              onChangeText={handleWordCountChange}
              keyboardType="number-pad"
              placeholder={`${MIN_WORD_COUNT}-${MAX_WORD_COUNT}`}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        )}

        <SelectField
          label="Lesson style"
          value={lessonStyle}
          options={toSelectOptions(LESSON_STYLES)}
          onChange={setLessonStyle}
          placeholder="Choose lesson style"
        />
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          (pressed || isSubmitting) && styles.buttonPressed,
        ]}
        onPress={handleStart}
        disabled={isSubmitting}
      >
        <Text style={styles.buttonText}>
          {isSubmitting ? "Starting..." : "Start lesson"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 16,
    gap: 20,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#1F2937",
  },
  button: {
    backgroundColor: "#1F2937",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
