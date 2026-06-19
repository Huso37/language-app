import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserSettingsForm } from "@/components/user-settings/user-settings-form";
import { getUserSettings, saveUserSettings } from "@/lib/user-settings-storage";
import type { UserSettings } from "@/types/user-settings";

export default function InitSettingsScreen() {
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
      <View style={styles.container}>
        <UserSettingsForm
          showWelcome
          initialValues={initialValues}
          submitLabel="Save & Continue"
          onSubmit={async (settings) => {
            await saveUserSettings({ ...settings, initCompleted: true });
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
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F4EF",
  },
});
