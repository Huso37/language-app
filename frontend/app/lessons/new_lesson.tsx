import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NewLessonForm } from "@/components/lesson/new-lesson-form";
import { setPendingLessonConfig } from "@/lib/lesson-session-store";
import { canSaveNewLesson } from "@/lib/saved-lessons-storage";
import { getUserSettings } from "@/lib/user-settings-storage";
import { MAX_SAVED_LESSONS } from "@/types/saved-lesson";
import type { NewLessonConfig } from "@/types/lesson";
import type { UserSettings } from "@/types/user-settings";

function isReadyForLesson(settings: UserSettings | null): settings is UserSettings {
  return (
    settings !== null &&
    settings.nativeLanguage !== null &&
    settings.learningLanguages.length > 0 &&
    settings.experienceLevel !== null
  );
}

export default function NewLessonScreen() {
  const [settings, setSettings] = useState<UserSettings | null | undefined>(
    undefined,
  );

  useFocusEffect(
    useCallback(() => {
      getUserSettings().then(setSettings);
    }, []),
  );

  const handleStart = async (config: NewLessonConfig) => {
    const hasRoom = await canSaveNewLesson();

    if (!hasRoom) {
      Alert.alert(
        "Lesson storage full",
        `You can save up to ${MAX_SAVED_LESSONS} lessons. Delete one before creating a new lesson.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete a lesson",
            onPress: () => router.push("/lessons/old_lesson"),
          },
        ],
      );
      return;
    }

    setPendingLessonConfig(config);
    router.push("/lessons/loading");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.screenHeader}>
        <Pressable
          style={({ pressed }) => [
            styles.backIconBtn,
            pressed && styles.backBtnPressed,
          ]}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.headerTitle}>New lesson</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.content}>
        {settings === undefined ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1F2937" />
          </View>
        ) : !isReadyForLesson(settings) ? (
          <View style={styles.centered}>
            <Text style={styles.missingTitle}>Profile incomplete</Text>
            <Text style={styles.missingText}>
              Finish your initial settings before starting a lesson.
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.settingsBtn,
                pressed && styles.settingsBtnPressed,
              ]}
              onPress={() => router.push("/init-settings")}
            >
              <Text style={styles.settingsBtnText}>Go to settings</Text>
            </Pressable>
          </View>
        ) : (
          <NewLessonForm userSettings={settings} onStart={handleStart} />
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    gap: 12,
  },
  missingTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1F2937",
    textAlign: "center",
  },
  missingText: {
    fontSize: 16,
    color: "#6B7280",
    lineHeight: 24,
    textAlign: "center",
  },
  settingsBtn: {
    marginTop: 8,
    backgroundColor: "#1F2937",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  settingsBtnPressed: {
    opacity: 0.85,
  },
  settingsBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
