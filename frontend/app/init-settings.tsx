import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserSettingsForm } from "@/components/user-settings/user-settings-form";
import { getUserSettings, saveUserSettings } from "@/lib/user-settings-storage";
import type { UserSettings } from "@/types/user-settings";

export default function InitSettingsScreen() {
  const { source } = useLocalSearchParams<{ source?: string }>();
  const isProfileEdit = source === "profile";
  const [initialValues, setInitialValues] = useState<
    Partial<UserSettings> | undefined
  >();

  useEffect(() => {
    getUserSettings().then((settings) => {
      setInitialValues(settings ?? {});
    });
  }, []);

  if (initialValues === undefined) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {isProfileEdit && (
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

          <Text style={styles.headerTitle}>Profile settings</Text>

          <View style={styles.headerSpacer} />
        </View>
      )}

      <View style={styles.container}>
        <UserSettingsForm
          showHeader={!isProfileEdit}
          showWelcome={!isProfileEdit}
          initialValues={initialValues}
          submitLabel={isProfileEdit ? "Save changes" : "Save & Continue"}
          onSubmit={async (settings) => {
            await saveUserSettings({ ...settings, initCompleted: true });
            if (isProfileEdit) {
              router.back();
              return;
            }

            router.replace("/home");
          }}
        />
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
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F4EF",
  },
});
