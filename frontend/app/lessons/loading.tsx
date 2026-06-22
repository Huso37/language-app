import { router, type Href } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { generateLesson, LessonServiceError } from "@/lib/lesson-service";
import { getLessonGameRoute } from "@/lib/lesson-routes";
import {
  getPendingLessonConfig,
  setCurrentLesson,
} from "@/lib/lesson-session-store";
import { saveLesson } from "@/lib/saved-lessons-storage";

export default function LessonLoadingScreen() {
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    const config = getPendingLessonConfig();

    if (!config) {
      setError("No lesson configuration found. Go back and try again.");
      return;
    }

    const requestId = ++requestIdRef.current;

    const loadLesson = async () => {
      try {
        const lesson = await generateLesson(config);

        if (requestId !== requestIdRef.current) return;

        await saveLesson(lesson);
        setCurrentLesson(lesson);
        router.replace(getLessonGameRoute(lesson) as Href);
      } catch (err) {
        if (requestId !== requestIdRef.current) return;

        const message =
          err instanceof LessonServiceError
            ? err.message
            : err instanceof Error && err.message === "Lesson storage is full."
              ? err.message
              : "Could not reach the backend. Check your connection and API URL.";

        setError(message);
      }
    };

    loadLesson();

    return () => {
      requestIdRef.current += 1;
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
