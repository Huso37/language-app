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
import { NewLessonForm } from "@/components/lesson/new-lesson-form";
import { getUserSettings } from "@/lib/user-settings-storage";
import { setPendingLessonConfig } from "@/lib/lesson-session-store";
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
    setPendingLessonConfig(config);
    router.push("/lessons/loading");
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <AppHeader />
      <View style={styles.content}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          onPress={() => router.back()}
        >
          <Text style={styles.backBtnText}>← Back</Text>
        </Pressable>

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
