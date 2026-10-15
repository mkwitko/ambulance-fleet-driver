import {
  BarcodeScanningResult,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import React, { useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { COLORS } from "../styles/colors";
import { Button } from "./ui/button";
import { Typography } from "./ui/typography";

export interface QRCodeScannerProps {
  onBarcodeScanned: (data: BarcodeScanningResult) => void;
  onClose?: () => void;
}

/**
 * 📷 QRCodeScanner - Versão Clean
 * Scanner de QR Code moderno e funcional
 */
export const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  onBarcodeScanned,
  onClose,
}) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(true);
  const [feedback, setFeedback] = useState<"scanning" | "success" | "error">(
    "scanning",
  );
  const lastScanRef = useRef<number>(0);

  // Handler para scan
  const handleBarcodeScan = (result: BarcodeScanningResult) => {
    const now = Date.now();

    // Previne múltiplos scans em sequência
    if (now - lastScanRef.current < 2000) return;

    lastScanRef.current = now;
    setIsScanning(false);

    if (result?.data) {
      setFeedback("success");
      onBarcodeScanned(result);
    } else {
      setFeedback("error");

      // Volta a escanear após 2s
      setTimeout(() => {
        setIsScanning(true);
        setFeedback("scanning");
      }, 2000);
    }
  };

  // Loading inicial
  if (!permission) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center">
        <ActivityIndicator size="large" color={COLORS.primary.DEFAULT} />
      </View>
    );
  }

  // Sem permissão
  if (!permission.granted) {
    return (
      <View className="flex-1 bg-gray-900 items-center justify-center p-6">
        <View className="bg-gray-800 rounded-3xl p-8 w-full max-w-md border border-gray-700">
          <View className="bg-primary-500/20 w-16 h-16 rounded-full items-center justify-center mx-auto mb-4">
            <Typography variant="title" className="text-primary-400 text-3xl">
              📷
            </Typography>
          </View>

          <Typography
            variant="title"
            align="center"
            className="mb-3 text-white"
          >
            Permissão Necessária
          </Typography>

          <Typography
            variant="body"
            align="center"
            className="mb-6 text-gray-400"
          >
            Precisamos acessar sua câmera para escanear códigos QR
          </Typography>

          <Button
            title="Permitir Acesso"
            variant="primary"
            onPress={requestPermission}
          />

          {onClose && (
            <Button
              title="Voltar"
              variant="ghost"
              onPress={onClose}
              className="mt-3"
            />
          )}
        </View>
      </View>
    );
  }

  // Scanner ativo
  return (
    <View className="h-full">
      {/* Câmera */}
      <CameraView
        facing="back"
        onBarcodeScanned={isScanning ? handleBarcodeScan : undefined}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        style={{ flex: 1 }}
      />

      {/* Overlay escuro */}
      <View className="absolute inset-0 pointer-events-none">
        <View className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
        <View className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
      </View>

      {/* Feedback no topo */}
      <View className="absolute top-16 left-0 right-0 items-center px-6">
        {feedback === "scanning" && (
          <View className="bg-black/60 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20 flex-row items-center gap-3">
            <ActivityIndicator size="small" color={COLORS.primary.DEFAULT} />
            <Typography variant="body" className="text-white">
              Procurando QR Code...
            </Typography>
          </View>
        )}

        {feedback === "success" && (
          <View className="bg-green-500/20 rounded-2xl px-6 py-3 border border-green-400/40 flex-row items-center gap-3">
            <View className="bg-green-500 rounded-full w-6 h-6 items-center justify-center">
              <Typography variant="body" className="text-white text-xs">
                ✓
              </Typography>
            </View>
            <Typography variant="body" className="text-green-300 font-semibold">
              QR Code Detectado!
            </Typography>
          </View>
        )}

        {feedback === "error" && (
          <View className="bg-red-500/20 rounded-2xl px-6 py-3 border border-red-400/40 flex-row items-center gap-3">
            <View className="bg-red-500 rounded-full w-6 h-6 items-center justify-center">
              <Typography variant="body" className="text-white text-xs">
                ⚠
              </Typography>
            </View>
            <Typography variant="body" className="text-red-300">
              Código não encontrado
            </Typography>
          </View>
        )}
      </View>

      {/* Frame de scan */}
      <View className="absolute inset-0 items-center justify-center pointer-events-none">
        <View className="w-72 h-72 relative">
          {/* Cantos */}
          <View className="absolute top-0 left-0 w-12 h-12 border-l-4 border-t-4 border-primary-500 rounded-tl-3xl" />
          <View className="absolute top-0 right-0 w-12 h-12 border-r-4 border-t-4 border-primary-500 rounded-tr-3xl" />
          <View className="absolute bottom-0 left-0 w-12 h-12 border-l-4 border-b-4 border-primary-500 rounded-bl-3xl" />
          <View className="absolute bottom-0 right-0 w-12 h-12 border-r-4 border-b-4 border-primary-500 rounded-br-3xl" />

          {/* Linha animada */}
          {isScanning && (
            <View className="absolute top-1/2 left-0 right-0 h-0.5 bg-primary-500 opacity-70" />
          )}
        </View>
      </View>

      {/* Instrução */}
      <View className="absolute bottom-28 left-0 right-0 items-center px-6">
        <View className="bg-black/60 backdrop-blur-lg rounded-2xl px-6 py-3 border border-white/20">
          <Typography variant="body" align="center" className="text-white">
            Posicione o QR Code dentro do frame
          </Typography>
        </View>
      </View>

      {/* Botão voltar */}
      {onClose && (
        <View className="absolute top-16 left-6 z-20">
          <Button
            title="← Voltar"
            variant="ghost"
            onPress={onClose}
            className="bg-black/60 border border-white/20"
          />
        </View>
      )}
    </View>
  );
};
