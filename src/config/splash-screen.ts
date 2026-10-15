import * as SplashScreen from "expo-splash-screen";

export async function preventAutoHideSplash() {
  try {
    await SplashScreen.preventAutoHideAsync();
  } catch (err) {
    console.warn("Erro ao impedir auto-hide do splash:", err);
  }
}

export async function hideSplashScreen() {
  try {
    await SplashScreen.hideAsync();
  } catch (err) {
    console.warn("Erro ao esconder o splash:", err);
  }
}