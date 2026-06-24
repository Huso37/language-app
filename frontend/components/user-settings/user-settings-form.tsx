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

import { LanguageCard } from "@/components/user-settings/language-card";
import { LevelOption } from "@/components/user-settings/level-option";
import {
  EXPERIENCE_LEVELS,
  LEARNING_LANGUAGES,
  NATIVE_LANGUAGES,
} from "@/constants/languages";
import {
  DEFAULT_USER_SETTINGS,
  type ExperienceLevel,
  type LanguageId,
  type UserSettings,
} from "@/types/user-settings";

type UserSettingsFormProps = {
  initialValues?: Partial<UserSettings>;
  onSubmit: (settings: UserSettings) => void | Promise<void>;
  submitLabel?: string;
  showHeader?: boolean;
  showWelcome?: boolean;
  title?: string;
  subtitle?: string;
};

export function UserSettingsForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  showHeader = true,
  showWelcome = false,
  title = "Profile settings",
  subtitle = "Update your language preferences anytime.",
}: UserSettingsFormProps) {
  const [userName, setUserName] = useState(
    initialValues?.userName ?? DEFAULT_USER_SETTINGS.userName,
  );
  const [nativeLanguage, setNativeLanguage] = useState<LanguageId | null>(
    initialValues?.nativeLanguage ?? DEFAULT_USER_SETTINGS.nativeLanguage,
  );
  const [learningLanguages, setLearningLanguages] = useState<LanguageId[]>(
    initialValues?.learningLanguages ?? DEFAULT_USER_SETTINGS.learningLanguages,
  );
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    initialValues?.experienceLevel ?? DEFAULT_USER_SETTINGS.experienceLevel,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLearningLanguage = (id: LanguageId) => {
    setLearningLanguages((current) =>
      current.includes(id)
        ? current.filter((lang) => lang !== id)
        : [...current, id],
    );
  };

  const handleSubmit = async () => {
    if (!userName.trim()) {
      Alert.alert("Missing name", "Please enter your name.");
      return;
    }
    if (!nativeLanguage) {
      Alert.alert("Missing language", "Please choose your native language.");
      return;
    }
    if (learningLanguages.length === 0) {
      Alert.alert(
        "Missing language",
        "Please choose at least one language to learn.",
      );
      return;
    }
    if (!experienceLevel) {
      Alert.alert("Missing level", "Please choose your experience level.");
      return;
    }

    const settings: UserSettings = {
      userName: userName.trim(),
      nativeLanguage,
      learningLanguages,
      experienceLevel,
      initCompleted: initialValues?.initCompleted ?? false,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(settings);
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
        {showHeader && (
          <View style={styles.header}>
            <Text style={styles.title}>
              {showWelcome ? "Welcome to Language App" : title}
            </Text>
            <Text style={styles.subtitle}>
              {showWelcome
                ? "Let's set up your profile. You can change these later in settings."
                : subtitle}
            </Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Your name</Text>
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="words"
            autoCorrect={false}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Native language</Text>
          <View style={styles.cardRow}>
            {NATIVE_LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.id}
                flag={lang.flag}
                label={lang.label}
                selected={nativeLanguage === lang.id}
                onPress={() => setNativeLanguage(lang.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Languages to learn</Text>
          <View style={styles.cardRow}>
            {LEARNING_LANGUAGES.map((lang) => (
              <LanguageCard
                key={lang.id}
                flag={lang.flag}
                label={lang.label}
                selected={learningLanguages.includes(lang.id)}
                onPress={() => toggleLearningLanguage(lang.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Experience level</Text>
          <View style={styles.levelRow}>
            {EXPERIENCE_LEVELS.map((level) => (
              <LevelOption
                key={level.id}
                label={level.label}
                selected={experienceLevel === level.id}
                onPress={() => setExperienceLevel(level.id)}
              />
            ))}
          </View>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            (pressed || isSubmitting) && styles.buttonPressed,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.buttonText}>
            {isSubmitting ? "Saving..." : submitLabel}
          </Text>
        </Pressable>    

      </ScrollView>

      
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
    gap: 24,
  },
  header: {},
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
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
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  levelRow: {
    flexDirection: "row",
    gap: 10,
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
