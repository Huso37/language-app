import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/app-header";
import {
  EXPERIENCE_LEVELS,
  LEARNING_LANGUAGES,
  NATIVE_LANGUAGES,
} from "@/constants/languages";
import { getUserSettings } from "@/lib/user-settings-storage";
import type { UserSettings } from "@/types/user-settings";

function getLanguageLabel(id: string) {
  const option = [...NATIVE_LANGUAGES, ...LEARNING_LANGUAGES].find(
    (lang) => lang.id === id,
  );
  return option ? `${option.flag} ${option.label}` : id;
}

function getLevelLabel(id: string) {
  return EXPERIENCE_LEVELS.find((level) => level.id === id)?.label ?? id;
}

function formatSettings(settings: UserSettings) {
  return [
    { label: "Name", value: settings.userName || "—" },
    {
      label: "Native language",
      value: settings.nativeLanguage
        ? getLanguageLabel(settings.nativeLanguage)
        : "—",
    },
    {
      label: "Learning",
      value:
        settings.learningLanguages.length > 0
          ? settings.learningLanguages.map(getLanguageLabel).join(", ")
          : "—",
    },
    {
      label: "Level",
      value: settings.experienceLevel
        ? getLevelLabel(settings.experienceLevel)
        : "—",
    },
  ];
}

export default function HomeScreen() {
  const [settings, setSettings] = useState<UserSettings | null | undefined>(
    undefined,
  );

  useFocusEffect(
    useCallback(() => {
      getUserSettings().then(setSettings);
    }, []),
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <AppHeader />
      <Pressable
        style={({ pressed }) => [
          styles.devBackBtn,
          pressed && styles.devBackBtnPressed,
        ]}
        onPress={() => router.push("/init-settings")}
      >
        <Text style={styles.devBackBtnText}>← Init settings (dev)</Text>
      </Pressable>

      <View style={styles.container}>
        <Text style={styles.emoji}>🧠</Text>

        {settings === undefined ? (
          <ActivityIndicator style={styles.loader} color="#1F2937" />
        ) : settings === null ? (
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Stored settings (debug)</Text>
            <Text style={styles.emptyText}>No settings saved yet.</Text>
          </View>
        ) : (
          <View style={styles.settingsCard}>
            <Text style={styles.settingsTitle}>Stored settings (debug)</Text>
            {formatSettings(settings).map((row) => (
              <View key={row.label} style={styles.row}>
                <Text style={styles.rowLabel}>{row.label}</Text>
                <Text style={styles.rowValue}>{row.value}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.subtitle}>
          Welcome! This will become your vocabulary trainer.
        </Text>
      </View>

        <View style={styles.lessonsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.lessonsBtn,
              pressed && styles.lessonsBtnPressed,
            ]}
            onPress={() => router.push("/lessons/new_lesson")}
          >
            <Text style={styles.lessonsBtnText}>Start a new lesson</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.lessonsBtn,
              pressed && styles.lessonsBtnPressed,
            ]}
            onPress={() => router.push("/lessons/old_lesson")}
          >
            <Text style={styles.lessonsBtnText}>Repeat a lesson</Text>
          </Pressable>
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
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  settingsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 10,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  row: {
    gap: 2,
  },
  rowLabel: {
    fontSize: 13,
    color: "#9CA3AF",
  },
  rowValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  emptyText: {
    fontSize: 15,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
  loader: {
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
  },
  devBackBtn: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginLeft: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  devBackBtnPressed: {
    opacity: 0.85,
  },
  devBackBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  lessonsBtn: {
    alignSelf: "flex-start",
    marginTop: 8,
    marginLeft: 24,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
  },
  lessonsBtnPressed: {
    opacity: 0.85,
  },
  lessonsBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  lessonsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
});
