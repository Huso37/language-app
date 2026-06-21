import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import { getCurrentLesson } from "@/lib/lesson-session-store";
import type { GenerateLessonResponse } from "@/types/lesson";

export default function LessonSessionScreen() {
  const [lesson, setLesson] = useState<GenerateLessonResponse | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setLesson(getCurrentLesson());
  }, []);

  if (lesson === undefined) {
    return null;
  }

  if (lesson === null) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <AppHeader />
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No lesson loaded</Text>
          <Text style={styles.emptyText}>
            Start a new lesson to generate content from the backend.
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

        <Text style={styles.pageTitle}>Lesson session</Text>
        <Text style={styles.pageSubtitle}>
          Backend response preview — game UI comes next.
        </Text>

        <View style={styles.metaCard}>
          <Text style={styles.metaText}>
            {lesson.lessonStyle} · {lesson.lessonType} · {lesson.level}
          </Text>
          <Text style={styles.metaText}>
            {lesson.nativeLanguage} → {lesson.learningLanguage} · {lesson.category}
          </Text>
          <Text style={styles.metaText}>{lesson.count} items</Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {lesson.words.map((word, index) => (
            <View key={`${word.nativeWord}-${index}`} style={styles.wordCard}>
              <Text style={styles.wordPair}>
                {word.nativeWord} → {word.targetWord}
              </Text>
              <Text style={styles.wordMeta}>{word.partOfSpeech}</Text>
              <Text style={styles.example}>{word.exampleSentenceNative}</Text>
              <Text style={styles.example}>{word.exampleSentenceTarget}</Text>
            </View>
          ))}

          <View style={styles.rawCard}>
            <Text style={styles.rawTitle}>Raw response</Text>
            <Text style={styles.rawJson}>{JSON.stringify(lesson, null, 2)}</Text>
          </View>
        </ScrollView>
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
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 16,
    lineHeight: 22,
  },
  metaCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 4,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  wordCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 4,
  },
  wordPair: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
  },
  wordMeta: {
    fontSize: 13,
    color: "#9CA3AF",
    textTransform: "capitalize",
  },
  example: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  rawCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  rawTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
