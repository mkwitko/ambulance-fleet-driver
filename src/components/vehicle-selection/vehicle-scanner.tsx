import React from "react";
import { View } from "react-native";
import { QRCodeScanner } from "../qr-code-scanner";
import { Button } from "../ui/button";

interface Props {
  onBarcodeScanned: (data: { data: string }) => void;
  onManualSelect: () => void;
}

export function VehicleScanner({ onBarcodeScanned, onManualSelect }: Props) {
  return (
    <View style={{ flex: 1 }}>
      <QRCodeScanner onBarcodeScanned={onBarcodeScanned} />

      <View className="absolute bottom-10 w-full px-6">
        <Button
          title="Selecionar veículo manualmente"
          variant="primary"
          onPress={onManualSelect}
        />
      </View>
    </View>
  );
}
