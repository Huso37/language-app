import { Pressable, StyleSheet, Text, View } from "react-native";

type SettingsItem = {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  onPress: () => void;
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

type SettingsSectionListProps = {
  sections: SettingsSection[];
};

export function SettingsSectionList({ sections }: SettingsSectionListProps) {
  return (
    <View style={styles.container}>
      {sections.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>

          <View style={styles.card}>
            {section.items.map((item, index) => {
              const isLast = index === section.items.length - 1;

              return (
                <Pressable
                  key={item.id}
                  style={({ pressed }) => [
                    styles.item,
                    !isLast && styles.itemBorder,
                    pressed && styles.itemPressed,
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.itemLeft}>
                    {item.emoji && <Text style={styles.emoji}>{item.emoji}</Text>}

                    <View style={styles.itemTextWrapper}>
                      <Text style={styles.itemTitle}>{item.title}</Text>

                      {item.description && (
                        <Text style={styles.itemDescription}>
                          {item.description}
                        </Text>
                      )}
                    </View>
                  </View>

                  <Text style={styles.chevron}>›</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#9CA3AF",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemPressed: {
    backgroundColor: "#F9FAFB",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  emoji: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
  },
  itemTextWrapper: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1F2937",
  },
  itemDescription: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  chevron: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 10,
  },
});