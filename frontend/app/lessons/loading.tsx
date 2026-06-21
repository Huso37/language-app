import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { generateLesson, LessonServiceError } from "@/lib/lesson-service";
import {
  getPendingLessonConfig,
  setCurrentLesson,
} from "@/lib/lesson-session-store";

export default function LessonLoadingScreen() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const config = getPendingLessonConfig();

    if (!config) {
      setError("No lesson configuration found. Go back and try again.");
      return;
    }

    let isActive = true;

    const loadLesson = async () => {
      try {
        const lesson = await generateLesson(config);

        if (!isActive) return;

        setCurrentLesson(lesson);
        router.replace("/lessons/lesson_session");
      } catch (err) {
        if (!isActive) return;

        const message =
          err instanceof LessonServiceError
            ? err.message
            : "Could not reach the backend. Check your connection and API URL.";

        setError(message);
      }
    };

    loadLesson();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <AppHeader />
      <View style={styles.container}>
        {error ? (
          <>
            <Text style={styles.errorTitle}>Something went wrong</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable
              style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Go back</Text>
            </Pressable>
          </>
        ) : (
          <>
            <ActivityIndicator size="large" color="#1F2937" />
            <Text style={styles.title}>Preparing your lesson...</Text>
            <Text style={styles.subtitle}>
              The backend is generating content based on your settings.
            </Text>
          </>
        )}
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
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "center",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#B91C1C",
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "center",
  },
  button: {
    marginTop: 8,
    backgroundColor: "#1F2937",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
