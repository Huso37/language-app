import { Pressable, StyleSheet, Text } from "react-native";

type LanguageCardProps = {
  flag: string;
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function LanguageCard({
  flag,
  label,
  selected,
  onPress,
}: LanguageCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.flag}>{flag}</Text>
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: "30%",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  cardSelected: {
    borderColor: "#1F2937",
    backgroundColor: "#F3F4F6",
  },
  cardPressed: {
    opacity: 0.85,
  },
  flag: {
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  labelSelected: {
    color: "#1F2937",
  },
});
