import { COLORS } from "@/src/styles/colors";
import React from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ConfirmActionModalProps {
  visible: boolean;
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  variant?: "primary" | "danger";
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmActionModal({
  visible,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  isLoading,
  variant = "primary",
  onConfirm,
  onCancel,
}: ConfirmActionModalProps) {
  const confirmColor =
    variant === "danger" ? COLORS.error.DEFAULT : COLORS.primary.DEFAULT;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 items-center justify-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full">
          <Text className="text-lg font-semibold text-gray-900">{title}</Text>

          {description && (
            <Text className="text-sm text-gray-600 mt-2">{description}</Text>
          )}

          <View className="mt-6 gap-3">
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isLoading}
              className="rounded-xl py-4 items-center"
              style={{ backgroundColor: confirmColor }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  {confirmText}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onCancel}
              disabled={isLoading}
              className="rounded-xl py-4 items-center"
            >
              <Text className="text-gray-600 font-medium text-base">
                {cancelText}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
