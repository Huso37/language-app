import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { formatLessonSummary } from "@/lib/format-lesson-labels";
import type { SavedLesson } from "@/types/saved-lesson";

type SavedLessonCardProps = {
  savedLesson: SavedLesson;
  deleteMode?: boolean;
  selected?: boolean;
  onPress?: () => void;
  onPlay?: () => void;
};

export function SavedLessonCard({
  savedLesson,
  deleteMode = false,
  selected = false,
  onPress,
  onPlay,
}: SavedLessonCardProps) {
  const summary = formatLessonSummary(savedLesson.lesson);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        deleteMode && selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
      disabled={!deleteMode && !onPress}
    >
      {deleteMode && (
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && <MaterialIcons name="check" size={16} color="#FFFFFF" />}
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.languages}>{summary.languages}</Text>
        <Text style={styles.meta}>
          {summary.category} · {summary.lessonType} · {summary.lessonStyle}
        </Text>
        <Text style={styles.count}>{savedLesson.lesson.count} items</Text>
      </View>

      {!deleteMode && onPlay && (
        <Pressable
          style={({ pressed }) => [
            styles.playBtn,
            pressed && styles.playBtnPressed,
          ]}
          onPress={(event) => {
            event.stopPropagation();
            onPlay();
          }}
        >
          <MaterialIcons name="play-arrow" size={24} color="#FFFFFF" />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 12,
  },
  cardSelected: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  cardPressed: {
    opacity: 0.9,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxSelected: {
    backgroundColor: "#DC2626",
    borderColor: "#DC2626",
  },
  content: {
    flex: 1,
    gap: 4,
  },
  languages: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  meta: {
    fontSize: 14,
    color: "#6B7280",
  },
  count: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
  },
  playBtnPressed: {
    opacity: 0.85,
  },
});
