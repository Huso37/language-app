import { useFocusEffect } from "@react-navigation/native";
import { router, type Href } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SavedLessonCard } from "@/components/lesson/saved-lesson-card";
import { getLessonGameRoute } from "@/lib/lesson-routes";
import { setCurrentLesson } from "@/lib/lesson-session-store";
import {
  deleteSavedLessons,
  getSavedLessons,
} from "@/lib/saved-lessons-storage";
import type { SavedLesson } from "@/types/saved-lesson";

export default function RepeatLessonScreen() {
  const [lessons, setLessons] = useState<SavedLesson[] | undefined>(undefined);
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const loadLessons = useCallback(() => {
    getSavedLessons().then(setLessons);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadLessons();
    }, [loadLessons]),
  );

  const exitDeleteMode = () => {
    setDeleteMode(false);
    setSelectedIds(new Set());
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePlay = (savedLesson: SavedLesson) => {
    setCurrentLesson(savedLesson.lesson);
    router.push(getLessonGameRoute(savedLesson.lesson) as Href);
  };

  const handleConfirmDelete = () => {
    if (selectedIds.size === 0) {
      Alert.alert("No lessons selected", "Select at least one lesson to delete.");
      return;
    }

    Alert.alert(
      "Delete lessons",
      `Delete ${selectedIds.size} saved lesson${selectedIds.size === 1 ? "" : "s"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await deleteSavedLessons([...selectedIds]);
              exitDeleteMode();
              loadLessons();
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screenHeader}>
        <Pressable
          style={({ pressed }) => [
            styles.backIconBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={() => (deleteMode ? exitDeleteMode() : router.back())}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>Review Lessons</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        <Text style={styles.pageSubtitle}>
          Your last saved lessons — play them as many times as you like.
        </Text>

        {lessons === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1F2937" />
          </View>
        ) : lessons.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No saved lessons yet</Text>
            <Text style={styles.emptyText}>
              Complete a new lesson and it will appear here.
            </Text>
            <Pressable
              style={({ pressed }) => [styles.primaryBtn, pressed && styles.primaryBtnPressed]}
              onPress={() => router.push("/lessons/new_lesson")}
            >
              <Text style={styles.primaryBtnText}>Start a new lesson</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {lessons.map((savedLesson) => (
              <SavedLessonCard
                key={savedLesson.id}
                savedLesson={savedLesson}
                deleteMode={deleteMode}
                selected={selectedIds.has(savedLesson.id)}
                onPress={
                  deleteMode ? () => toggleSelection(savedLesson.id) : undefined
                }
                onPlay={() => handlePlay(savedLesson)}
              />
            ))}
          </ScrollView>
        )}

        <View style={styles.actionRow}>
          <Pressable
            style={({ pressed }) => [
              styles.deleteToggleBtn,
              deleteMode && styles.deleteToggleBtnActive,
              pressed && styles.backBtnPressed,
            ]}
            onPress={() => (deleteMode ? exitDeleteMode() : setDeleteMode(true))}
            disabled={lessons?.length === 0}
          >
            <Text
              style={[
                styles.deleteToggleText,
                deleteMode && styles.deleteToggleTextActive,
              ]}
            >
              {deleteMode ? "Cancel" : "Delete a lesson"}
            </Text>
          </Pressable>
        </View>

        {deleteMode && lessons && lessons.length > 0 && (
          <Pressable
            style={({ pressed }) => [
              styles.confirmDeleteBtn,
              (pressed || isDeleting) && styles.primaryBtnPressed,
            ]}
            onPress={handleConfirmDelete}
            disabled={isDeleting}
          >
            <Text style={styles.confirmDeleteText}>
              {isDeleting
                ? "Deleting..."
                : `Confirm delete (${selectedIds.size})`}
            </Text>
          </Pressable>
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
  backBtnPressed: {
    opacity: 0.85,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  headerSpacer: {
    width: 44,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",

    marginBottom: 12,
    gap: 12,
  },
  deleteToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#FEE2E2",
  },
  deleteToggleBtnActive: {
    backgroundColor: "#DC2626",
  },
  deleteToggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B91C1C",
  },
  deleteToggleTextActive: {
    color: "#FFFFFF",
  },
  pageSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 16,
    marginBottom: 16,
    lineHeight: 22,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 24,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    gap: 12,
    paddingBottom: 24,
  },
  primaryBtn: {
    marginTop: 8,
    backgroundColor: "#1F2937",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  primaryBtnPressed: {
    opacity: 0.85,
  },
  primaryBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  confirmDeleteBtn: {
    backgroundColor: "#DC2626",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  confirmDeleteText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
