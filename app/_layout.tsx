import { Providers } from "@/src/providers";
import { Slot } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { disableFontScalingGlobally } from "@/src/config/disable-font-scaling";
import { preventAutoHideSplash } from "@/src/config/splash-screen";
import { useLoadFonts } from "@/src/hooks/use-load-fonts";
import { COLORS } from "@/src/styles/colors";
import "@/src/styles/global.css";
import Toast from "react-native-toast-message";

import "react-native-gesture-handler";
import "react-native-reanimated";

// Inicializações globais
preventAutoHideSplash();

export default function RootLayout() {
  const [fontsLoaded] = useLoadFonts();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    disableFontScalingGlobally();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <StatusBar
          backgroundColor={COLORS.primary[900]}
          translucent={false}
          barStyle="dark-content"
        />
        <Providers>
          <Slot />
          <Toast />
        </Providers>
      </Animated.View>
    </GestureHandlerRootView>
  );
}
