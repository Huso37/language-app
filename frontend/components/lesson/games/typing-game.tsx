import * as Haptics from "expo-haptics";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { LessonWord } from "@/types/lesson";

type TypingGameProps = {
  words: LessonWord[];
};

type WordResult = {
  word: LessonWord;
  attempts: number;
  skipped: boolean;
};

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

export function TypingGame({ words }: TypingGameProps) {
  const initialQueue = useMemo(() => [...words], [words]);

  const [wordQueue, setWordQueue] = useState<LessonWord[]>(initialQueue);
  const [answer, setAnswer] = useState("");
  const [isWrong, setIsWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [results, setResults] = useState<WordResult[]>([]);
  const [attemptsForCurrentWord, setAttemptsForCurrentWord] = useState(0);

  const currentWord = wordQueue[0];
  const completedCount = results.length;
  const totalCount = words.length;
  const isComplete = !currentWord;

  const resetCardState = () => {
    setAnswer("");
    setIsWrong(false);
    setShowHint(false);
    setShowTranslation(false);
    setAttemptsForCurrentWord(0);
  };

  const moveToNextWord = () => {
    setWordQueue((current) => current.slice(1));
    resetCardState();
  };

  const handleCheckAnswer = () => {
    if (!currentWord) return;

    const userAnswer = normalizeAnswer(answer);
    const correctAnswer = normalizeAnswer(currentWord.targetWord);

    if (!userAnswer) return;

    if (userAnswer === correctAnswer) {
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      setResults((current) => [
        ...current,
        {
          word: currentWord,
          attempts: attemptsForCurrentWord + 1,
          skipped: false,
        },
      ]);

      moveToNextWord();
      return;
    }

    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setAttemptsForCurrentWord((current) => current + 1);
    setIsWrong(true);
  };

  const handleSkip = () => {
    if (!currentWord) return;

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setWordQueue((current) => {
      if (current.length <= 1) return current;
      const [firstWord, ...remainingWords] = current;
      return [...remainingWords, firstWord];
    });

    resetCardState();
  };

  if (isComplete) {
    const correctCount = results.filter((result) => !result.skipped).length;

    return (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.completeCard}>
          <Text style={styles.completeEmoji}>🎉</Text>
          <Text style={styles.completeTitle}>Typing lesson complete</Text>
          <Text style={styles.completeSubtitle}>
            You completed {correctCount} / {totalCount} words.
          </Text>
        </View>

        <View style={styles.resultsSection}>
          <Text style={styles.sectionTitle}>Words practiced</Text>

          {results.map((result, index) => (
            <View key={`${result.word.targetWord}-${index}`} style={styles.resultCard}>
              <Text style={styles.resultWordPair}>
                {result.word.nativeWord} · {result.word.targetWord}
              </Text>
              <Text style={styles.resultText}>
                Attempts: {result.attempts}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            Word {completedCount + 1} of {totalCount}
          </Text>
          <Text style={styles.progressSubtext}>
            Type the translation in the learning language.
          </Text>
        </View>

        <View style={[styles.card, isWrong && styles.cardWrong]}>
          <View style={styles.topActions}>
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setShowHint((current) => !current)}
            >
              <Text style={styles.secondaryButtonText}>
                {showHint ? "Hide hint" : "Hint"}
              </Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setShowTranslation((current) => !current)}
            >
              <Text style={styles.secondaryButtonText}>
                {showTranslation ? "Hide translation" : "Translate"}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.nativeLabel}>Translate this word</Text>
          <Text style={styles.nativeWord}>{currentWord.nativeWord}</Text>

          {showHint && (
            <View style={styles.hintBox}>
              <Text style={styles.hintLabel}>Hint sentence</Text>
              <Text style={styles.hintText}>
                {currentWord.exampleSentenceTarget}
              </Text>
            </View>
          )}

          {showTranslation && (
            <View style={styles.translationBox}>
              <Text style={styles.translationLabel}>Translation</Text>
              <Text style={styles.translationText}>{currentWord.targetWord}</Text>
            </View>
          )}

          <TextInput
            style={[styles.input, isWrong && styles.inputWrong]}
            value={answer}
            onChangeText={(text) => {
              setAnswer(text);
              if (isWrong) setIsWrong(false);
            }}
            placeholder="Type answer..."
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleCheckAnswer}
          />

          {isWrong && (
            <Text style={styles.wrongText}>
              Not quite. Try again or skip this word for now.
            </Text>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={handleCheckAnswer}
          >
            <Text style={styles.primaryButtonText}>Check answer</Text>
          </Pressable>

          {isWrong && (
            <Pressable
              style={({ pressed }) => [
                styles.skipButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSkip}
            >
              <Text style={styles.skipButtonText}>Skip for now</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
    gap: 16,
  },
  progressHeader: {
    gap: 4,
  },
  progressText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
  },
  progressSubtext: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    gap: 14,
  },
  cardWrong: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  topActions: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingVertical: 11,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#374151",
  },
  nativeLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  nativeWord: {
    fontSize: 34,
    fontWeight: "900",
    color: "#1F2937",
  },
  hintBox: {
    backgroundColor: "#EFF6FF",
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  hintLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#1D4ED8",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  hintText: {
    fontSize: 15,
    color: "#1F2937",
    lineHeight: 22,
  },
  translationBox: {
    backgroundColor: "#ECFDF5",
    borderRadius: 14,
    padding: 12,
    gap: 4,
  },
  translationLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: "#047857",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  translationText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#065F46",
  },
  input: {
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 18,
    color: "#1F2937",
  },
  inputWrong: {
    borderColor: "#DC2626",
  },
  wrongText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: "#2563EB",
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 16,
  },
  skipButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DC2626",
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
  },
  skipButtonText: {
    color: "#B91C1C",
    fontWeight: "900",
    fontSize: 15,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  completeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
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
  resultsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#1F2937",
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 4,
  },
  resultWordPair: {
    fontSize: 15,
    fontWeight: "800",
    color: "#1F2937",
  },
  resultText: {
    fontSize: 14,
    color: "#6B7280",
  },
});