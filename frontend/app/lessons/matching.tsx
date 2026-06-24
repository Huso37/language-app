import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { MatchingGame } from "@/components/lesson/games/matching-game";
import { getCurrentLesson } from "@/lib/lesson-session-store";
import type { GenerateLessonResponse } from "@/types/lesson";

export default function MatchingLessonScreen() {
  const [lesson, setLesson] = useState<GenerateLessonResponse | null | undefined>(
    undefined,
  );

  useEffect(() => {
    setLesson(getCurrentLesson());
  }, []);

  if (lesson === undefined) {
    return null;
  }

  if (lesson === null || lesson.lessonStyle !== "matching") {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        <View style={styles.screenHeader}>
          <Pressable
            style={({ pressed }) => [
              styles.backIconBtn,
              pressed && styles.backBtnPressed,
            ]}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.backIcon}>‹</Text>
          </Pressable>

          <Text style={styles.headerTitle}>Matching lesson</Text>

          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No matching lesson</Text>
          <Text style={styles.emptyText}>
            Start a new matching lesson to play this game.
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
      <View style={styles.screenHeader}>
        <Pressable
          style={({ pressed }) => [
            styles.backIconBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={() => router.replace("/home")}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Matching lesson</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.pageSubtitle}>
          {lesson.category} · {lesson.count} words
        </Text>

        <MatchingGame words={lesson.words} />
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
  screenHeader: {
    height: 56,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F7F4EF",
  },
  backIconBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  backIcon: {
    fontSize: 36,
    lineHeight: 36,
    fontWeight: "600",
    color: "#2563EB",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  headerSpacer: {
    width: 44,
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
  backBtnPressed: {
    opacity: 0.85,
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 16,
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
