import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { shuffleArray } from "@/lib/shuffle";
import type { LessonWord } from "@/types/lesson";

type TargetItem = {
  wordIndex: number;
  text: string;
};

type WordTileProps = {
  text: string;
  selected?: boolean;
  matched?: boolean;
  wrong?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

function WordTile({
  text,
  selected = false,
  matched = false,
  wrong = false,
  disabled = false,
  onPress,
}: WordTileProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.tile,
        selected && styles.tileSelected,
        matched && styles.tileMatched,
        wrong && styles.tileWrong,
        pressed && !disabled && styles.tilePressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text
        style={[
          styles.tileText,
          matched && styles.tileTextMatched,
          wrong && styles.tileTextWrong,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

type MatchingGameProps = {
  words: LessonWord[];
};

export function MatchingGame({ words }: MatchingGameProps) {
  const targetItems = useMemo<TargetItem[]>(
    () =>
      shuffleArray(
        words.map((word, wordIndex) => ({
          wordIndex,
          text: word.targetWord,
        })),
      ),
    [words],
  );

  const [selectedNativeIndex, setSelectedNativeIndex] = useState<number | null>(
    null,
  );
  const [matchedIndices, setMatchedIndices] = useState<Set<number>>(
    () => new Set(),
  );
  const [wrongNativeIndex, setWrongNativeIndex] = useState<number | null>(null);
  const [wrongTargetIndex, setWrongTargetIndex] = useState<number | null>(null);

  const isComplete = matchedIndices.size === words.length;

  useEffect(() => {
    if (wrongNativeIndex === null && wrongTargetIndex === null) return;

    const timeout = setTimeout(() => {
      setWrongNativeIndex(null);
      setWrongTargetIndex(null);
      setSelectedNativeIndex(null);
    }, 450);

    return () => clearTimeout(timeout);
  }, [wrongNativeIndex, wrongTargetIndex]);

  const handleNativePress = (wordIndex: number) => {
    if (matchedIndices.has(wordIndex)) return;
    setSelectedNativeIndex(wordIndex);
  };

  const handleTargetPress = (targetItem: TargetItem, targetPosition: number) => {
    if (matchedIndices.has(targetItem.wordIndex)) return;
    if (selectedNativeIndex === null) return;

    if (selectedNativeIndex === targetItem.wordIndex) {
      setMatchedIndices((current) => new Set(current).add(targetItem.wordIndex));
      setSelectedNativeIndex(null);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    setWrongNativeIndex(selectedNativeIndex);
    setWrongTargetIndex(targetPosition);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.instructions}>
        Tap a word on the left, then find its match on the right.
      </Text>

      <View style={styles.board}>
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Native</Text>
          {words.map((word, wordIndex) => (
            <WordTile
              key={`native-${word.nativeWord}-${wordIndex}`}
              text={word.nativeWord}
              selected={selectedNativeIndex === wordIndex}
              matched={matchedIndices.has(wordIndex)}
              wrong={wrongNativeIndex === wordIndex}
              disabled={matchedIndices.has(wordIndex)}
              onPress={() => handleNativePress(wordIndex)}
            />
          ))}
        </View>

        <View style={styles.column}>
          <Text style={styles.columnTitle}>Learning</Text>
          {targetItems.map((targetItem, targetPosition) => (
            <WordTile
              key={`target-${targetItem.text}-${targetPosition}`}
              text={targetItem.text}
              matched={matchedIndices.has(targetItem.wordIndex)}
              wrong={wrongTargetIndex === targetPosition}
              disabled={matchedIndices.has(targetItem.wordIndex)}
              onPress={() => handleTargetPress(targetItem, targetPosition)}
            />
          ))}
        </View>
      </View>

      {isComplete && (
        <>
          <View style={styles.completeCard}>
            <Text style={styles.completeEmoji}>🎉</Text>
            <Text style={styles.completeTitle}>Matching lesson complete</Text>
            <Text style={styles.completeSubtitle}>
              You matched all {words.length} words.
            </Text>
          </View>

          <View style={styles.sentencesSection}>
            <Text style={styles.sentencesTitle}>Example sentences</Text>
            {words.map((word, wordIndex) => (
              <View key={`sentence-${wordIndex}`} style={styles.sentenceCard}>
                <Text style={styles.sentenceWordPair}>
                  {word.nativeWord} · {word.targetWord}
                </Text>
                <Text style={styles.sentenceText}>
                  {word.exampleSentenceNative}
                </Text>
                <Text style={styles.sentenceTextTarget}>
                  {word.exampleSentenceTarget}
                </Text>
              </View>
            ))}
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.finishButton,
              pressed && styles.tilePressed,
            ]}
            onPress={() => router.replace("/home")}
          >
            <Text style={styles.finishButtonText}>Finish</Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  instructions: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  board: {
    flexDirection: "row",
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 10,
  },
  columnTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  tile: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    minHeight: 52,
    justifyContent: "center",
  },
  tileSelected: {
    borderColor: "#1F2937",
    backgroundColor: "#F3F4F6",
  },
  tileMatched: {
    borderColor: "#16A34A",
    backgroundColor: "#DCFCE7",
  },
  tileWrong: {
    borderColor: "#DC2626",
    backgroundColor: "#FEE2E2",
  },
  tilePressed: {
    opacity: 0.9,
  },
  tileText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
  },
  tileTextMatched: {
    color: "#166534",
  },
  tileTextWrong: {
    color: "#B91C1C",
  },
  completeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
    marginTop: 8,
  },
  completeEmoji: {
    fontSize: 44,
  },
  completeTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#1F2937",
    textAlign: "center",
  },
  completeSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  sentencesSection: {
    gap: 12,
    marginTop: 8,
  },
  sentencesTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  sentenceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 6,
  },
  sentenceWordPair: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
  },
  sentenceText: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },
  sentenceTextTarget: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    fontStyle: "italic",
  },
  finishButton: {
    backgroundColor: "#1F2937",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  finishButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
});
