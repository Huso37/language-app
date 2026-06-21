import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type AppHeaderProps = {
  title?: string;
};

export function AppHeader({ title = "Language App" }: AppHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          onPress={() => router.push("/utilities/notifications")}
          accessibilityLabel="Notifications"
        >
          <MaterialIcons name="mail-outline" size={24} color="#1F2937" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
          onPress={() => router.push("/utilities/profile")}
          accessibilityLabel="Profile"
        >
          <MaterialIcons name="person-outline" size={24} color="#1F2937" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F7F4EF",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2937",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    padding: 8,
    borderRadius: 10,
  },
  iconBtnPressed: {
    opacity: 0.7,
    backgroundColor: "#E5E7EB",
  },
});
