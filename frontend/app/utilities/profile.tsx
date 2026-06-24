import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SettingsSectionList } from "@/components/user-settings/setting-section-list";

export default function ProfileScreen() {

  const sections = [
    {
      title: "Account",
      items: [
        {
          id: "profile-settings",
          title: "Profile settings",
          description: "Name, native language, learning language and level",
          emoji: "👤",
          onPress: () => {
            router.push({
              pathname: "/init-settings",
              params: { source: "profile" },
            });
          },
        },
      ],
    },
  ];


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

        <Text style={styles.headerTitle}>Profile</Text>

        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.container}>
        <SettingsSectionList sections={sections} />
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
  backBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1F2937",
    marginBottom: 16,
  },
});
