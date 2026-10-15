import React from "react";
import { View } from "react-native";
import { Typography } from "../ui/typography";

export default function ManualSelectionPage() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Typography variant="title" align="center" className="mb-3">
        Seleção Manual
      </Typography>
      <Typography variant="body" align="center" className="mb-8">
        Você está no modo de seleção manual de veículos
      </Typography>
    </View>
  );
}
