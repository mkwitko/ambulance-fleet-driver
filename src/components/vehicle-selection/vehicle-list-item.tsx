import { GetAmbulances200DataItem } from "@/src/http/generated/api.schemas";
import { COLORS } from "@/src/styles/colors";
import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Typography } from "../ui/typography";

interface Props {
  ambulance: GetAmbulances200DataItem;
  onSelect: (ambulance: GetAmbulances200DataItem) => void;
}

export function VehicleListItem({ ambulance, onSelect }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(ambulance)}
      activeOpacity={0.7}
      className="flex-row items-center justify-between py-4 px-3 rounded-xl bg-white active:bg-gray-50"
    >
      <View>
        <Typography variant="body" weight="medium">
          {ambulance.name}
        </Typography>
        <Typography variant="caption" tone="muted">
          {ambulance.licensePlate}
        </Typography>
      </View>
      <FontAwesome
        name="chevron-right"
        size={18}
        color={COLORS.mutedForeground}
      />
    </TouchableOpacity>
  );
}
