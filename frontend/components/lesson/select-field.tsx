import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type SelectFieldProps<T extends string> = {
  label: string;
  value: T | null;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
  placeholder = "Select an option",
  disabled = false,
}: SelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedLabel = options.find((option) => option.value === value)?.label;

  const handleSelect = (nextValue: T) => {
    onChange(nextValue);
    setIsOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        style={({ pressed }) => [
          styles.field,
          disabled && styles.fieldDisabled,
          pressed && !disabled && styles.fieldPressed,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text
          style={[
            styles.fieldText,
            !selectedLabel && styles.placeholderText,
            disabled && styles.fieldTextDisabled,
          ]}
        >
          {selectedLabel ?? placeholder}
        </Text>
        {!disabled && (
          <MaterialIcons name="keyboard-arrow-down" size={22} color="#6B7280" />
        )}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setIsOpen(false)}>
          <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <ScrollView style={styles.optionsList}>
              {options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <Pressable
                    key={option.value}
                    style={({ pressed }) => [
                      styles.option,
                      isSelected && styles.optionSelected,
                      pressed && styles.optionPressed,
                    ]}
                    onPress={() => handleSelect(option.value)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {isSelected && (
                      <MaterialIcons name="check" size={20} color="#1F2937" />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1F2937",
  },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  fieldDisabled: {
    backgroundColor: "#F3F4F6",
  },
  fieldPressed: {
    opacity: 0.9,
  },
  fieldText: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
  },
  fieldTextDisabled: {
    color: "#6B7280",
  },
  placeholderText: {
    color: "#9CA3AF",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 32,
    maxHeight: "60%",
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  optionsList: {
    paddingHorizontal: 12,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionSelected: {
    backgroundColor: "#F3F4F6",
  },
  optionPressed: {
    opacity: 0.85,
  },
  optionText: {
    fontSize: 16,
    color: "#374151",
  },
  optionTextSelected: {
    fontWeight: "700",
    color: "#1F2937",
  },
});
