import { useCheckAuth } from "@/src/http/generated/auth/auth";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, useRouter } from "expo-router";
import { cssInterop } from "nativewind";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

cssInterop(LinearGradient, {
  className: "style",
});

export default function PublicLayout() {
  const { data: checkAuth } = useCheckAuth();
  const router = useRouter();

  useEffect(() => {
    if (checkAuth?.isAuthenticated) {
      router.replace("/protected/app/driver");
      return;
    }
  }, [checkAuth]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <LinearGradient
        className="flex-1 bg-white"
        colors={[
          "rgba(0,128,0,0.1)",
          "rgba(0,128,0,0.07)",
          "rgba(0,128,0,0.09)",
        ]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
      >
        <Slot />
      </LinearGradient>
    </SafeAreaView>
  );
}
