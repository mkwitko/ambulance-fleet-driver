import { useCheckAuth } from "@/src/http/generated/auth/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProtectedLayout() {
  const { data: checkAuth } = useCheckAuth();

  const router = useRouter();

  useEffect(() => {
    console.log("ProtectedLayout checkAuth:", checkAuth);
    if (!checkAuth || !checkAuth?.isAuthenticated) {
      router.replace("/public/sign-in");
      return;
    }
  }, [checkAuth]);

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LinearGradient
        className="flex-1"
        colors={[
          "rgba(0,128,0,0.05)",
          "rgba(0,128,0,0.05)",
          "rgba(0,128,0,0.07)",
        ]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      >
        <Slot />
      </LinearGradient>
    </SafeAreaView>
  );
}
