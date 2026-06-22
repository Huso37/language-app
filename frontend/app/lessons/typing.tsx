import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { getCurrentLesson } from "@/lib/lesson-session-store";
import type { GenerateLessonResponse } from "@/types/lesson";

export default function TypingLessonScreen() {
  const [lesson, setLesson] = useState<GenerateLessonResponse | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setLesson(getCurrentLesson());
  }, []);

  if (lesson === undefined) {
    return null;
  }

  if (lesson === null || lesson.lessonStyle !== "typing") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <AppHeader />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No typing lesson</Text>
          <Text style={styles.emptyText}>
            Start a new typing lesson to play this game.
          </Text>
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={() => router.replace("/lessons/new_lesson")}
          >
            <Text style={styles.buttonText}>New lesson</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <AppHeader />
      <View style={styles.content}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.backBtnText}>← Home</Text>
        </Pressable>

        <Text style={styles.pageTitle}>Typing</Text>
        <Text style={styles.placeholder}>
          Typing game UI coming next. Lesson data is loaded and ready.
        </Text>
        <Text style={styles.rawJson}>{JSON.stringify(lesson.words, null, 2)}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F4EF",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  backBtn: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  backBtnPressed: {
    opacity: 0.85,
  },
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    marginBottom: 16,
  },
  rawJson: {
    fontSize: 12,
    color: "#374151",
    fontFamily: "monospace",
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
