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
  DEFAULT_WORD_COUNT,
  LESSON_STYLES,
  LESSON_TYPES,
} from "@/constants/lesson-options";
import {
  EXPERIENCE_LEVELS,
  LEARNING_LANGUAGES,
  NATIVE_LANGUAGES,
} from "@/constants/languages";
import type { NewLessonConfig, LessonStyle, LessonType } from "@/types/lesson";
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
  const [wordCount, setWordCount] = useState(String(DEFAULT_WORD_COUNT));
  const [lessonStyle, setLessonStyle] = useState<LessonStyle | null>("matching");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStart = async () => {
    if (!nativeLanguage) {
      Alert.alert("Missing language", "Please choose your default language.");
      return;
    }
    if (!learningLanguage) {
      Alert.alert("Missing language", "Please choose a learning language.");
      return;
    }
    if (!experienceLevel) {
      Alert.alert("Missing level", "Complete your profile settings first.");
      return;
    }
    if (!lessonType) {
      Alert.alert("Missing type", "Please choose a lesson type.");
      return;
    }
    if (!lessonStyle) {
      Alert.alert("Missing style", "Please choose a lesson style.");
      return;
    }

    let parsedWordCount: number | undefined;
    if (lessonType === "words") {
      parsedWordCount = Number(wordCount);
      if (!wordCount.trim() || Number.isNaN(parsedWordCount) || parsedWordCount < 1) {
        Alert.alert("Invalid number", "Please enter how many words you want.");
        return;
      }
    }

    const config: NewLessonConfig = {
      nativeLanguage,
      learningLanguage,
      experienceLevel,
      lessonType,
      lessonStyle,
      ...(lessonType === "words" ? { wordCount: parsedWordCount } : {}),
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
            Set up your lesson. These options will be sent to the backend in a
            later step.
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
              onChangeText={setWordCount}
              keyboardType="number-pad"
              placeholder="e.g. 10"
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
