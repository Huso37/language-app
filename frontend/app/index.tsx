import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import { hasCompletedInitSettings } from "@/lib/user-settings-storage";

export default function Index() {
  const [isReady, setIsReady] = useState(false);
  const [hasCompletedInit, setHasCompletedInit] = useState(false);

  useEffect(() => {
    hasCompletedInitSettings()
      .then(setHasCompletedInit)
      .finally(() => setIsReady(true));
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1F2937" />
      </View>
    );
  }

  return (
    <Redirect href={hasCompletedInit ? "/home" : "/init-settings"} />
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F7F4EF",
  },
});
