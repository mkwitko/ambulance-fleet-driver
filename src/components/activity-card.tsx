import { Typography } from "@/src/components/ui/typography";
import { COLORS } from "@/src/styles/colors";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  View,
} from "react-native";

interface ActivityCardProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  configured: boolean;
  onPress: () => void;
  animatedValue?: Animated.Value;
  isLoading?: boolean;
  disabled?: boolean;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({
  icon,
  title,
  description,
  configured,
  onPress,
  animatedValue,
  isLoading = false,
  disabled = false,
}) => {
  const cardTransform = animatedValue
    ? {
        opacity: animatedValue,
        transform: [
          {
            translateY: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
          {
            scale: animatedValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.95, 1],
            }),
          },
        ],
      }
    : {};

  return (
    <Animated.View style={cardTransform}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        disabled={isLoading || disabled}
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 disabled:opacity-50"
      >
        <View className="flex-row items-start gap-4">
          {/* ÍCONE COM EFEITO GLASSMORPHISM */}
          <View
            className={`p-4 rounded-xl ${
              configured ? "bg-primary-200/50" : "bg-gray-200/50"
            } ${isLoading ? "opacity-50" : ""}`}
          >
            <MaterialIcons
              name={icon}
              size={28}
              color={
                configured ? COLORS.primary.DEFAULT : COLORS.mutedForeground
              }
            />
          </View>

          {/* CONTEÚDO */}
          <View className="flex-1">
            <View className="flex-row items-center justify-between mb-1">
              <Typography variant="caption" weight="semibold">
                {title}
              </Typography>

              {/* STATUS BADGE */}
              {isLoading ? (
                <ActivityIndicator
                  size="small"
                  color={COLORS.primary.DEFAULT}
                />
              ) : configured ? (
                <View className="flex-row items-center gap-1.5 bg-primary-100 px-3 py-2 rounded-full">
                  <View className="w-2 h-2 rounded-full bg-primary-500" />
                  <Typography variant="extraSmall" className="text-primary-700">
                    Configurado
                  </Typography>
                </View>
              ) : (
                <MaterialIcons
                  name="chevron-right"
                  size={22}
                  color={COLORS.mutedForeground}
                />
              )}
            </View>

            <Typography variant="small" tone="muted" className="leading-5">
              {description}
            </Typography>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
