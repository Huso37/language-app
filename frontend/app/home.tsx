import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSavedLessonCount } from "@/lib/saved-lessons-storage";

import { AppHeader } from "@/components/app-header";
import { LEARNING_LANGUAGES } from "@/constants/languages";
import { getUserSettings } from "@/lib/user-settings-storage";
import type { UserSettings } from "@/types/user-settings";

function getLearningLanguageLabel(id: string) {
  const option = LEARNING_LANGUAGES.find((lang) => lang.id === id);
  return option ? `${option.flag} ${option.label}` : id;
}

export default function HomeScreen() {
  const [settings, setSettings] = useState<UserSettings | null | undefined>(
    undefined,
  );

  const [lessonCount, setLessonCount] = useState<number | undefined>(undefined);

  useFocusEffect(
    useCallback(() => {
      getUserSettings().then(setSettings);
    }, []),
  );

  useEffect(() => {
      getSavedLessonCount().then(setLessonCount);
    }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <AppHeader />

      <View style={styles.container}>
        {settings === undefined ? (
          <ActivityIndicator style={styles.loader} color="#1F2937" />
        ) : settings === null ? (
          <>
            <Text style={styles.title}>Welcome</Text>
            <Text style={styles.subtitle}>
              Finish your initial settings to start learning.
            </Text>
          </>
        ) : (
          <>
            <Text style={styles.title}>Hi {settings.userName || "there"}</Text>
            <Text style={styles.subtitle}>
              Ready to start learning{" "}
              {settings.learningLanguages.length > 0
                ? settings.learningLanguages.map(getLearningLanguageLabel).join(", ")
                : "a new language"}
              ?
            </Text>
          </>
        )}

        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Lessons done</Text>
          {lessonCount === undefined ? (
            <ActivityIndicator color="#1F2937" />
          ) : (
            <Text style={styles.statValue}>{lessonCount}</Text>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/lessons/new_lesson")}
          >
            <Text style={styles.primaryButtonText}>Start a new lesson</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/lessons/old_lesson")}
          >
            <Text style={styles.secondaryButtonText}>Repeat a lesson</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F4EF",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  loader: {
    marginBottom: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1F2937",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#6B7280",
    lineHeight: 27,
    marginBottom: 10,
  },
  actions: {
    gap: 14,
  },
  primaryButton: {
    backgroundColor: "#1F2937",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.85,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "900",
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 36,
    fontWeight: "900",
    color: "#1F2937",
  },
});
