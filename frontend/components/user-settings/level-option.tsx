import { Pressable, StyleSheet, Text } from "react-native";

type LevelOptionProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export function LevelOption({ label, selected, onPress }: LevelOptionProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.option,
        selected && styles.optionSelected,
        pressed && styles.optionPressed,
      ]}
      onPress={onPress}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  option: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
  },
  optionSelected: {
    borderColor: "#1F2937",
    backgroundColor: "#F3F4F6",
  },
  optionPressed: {
    opacity: 0.85,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
  },
  labelSelected: {
    color: "#1F2937",
  },
});
