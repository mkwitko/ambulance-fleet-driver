import { hideSplashScreen } from "@/src/config/splash-screen";
import { useCheckAuth } from "@/src/http/generated/auth/auth";
import { useRootNavigationState, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { data: checkAuth, isLoading: isLoadingCheckAuth } = useCheckAuth();

  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    if (!rootNavigationState?.key) return;

    if (isLoadingCheckAuth) return;

    if (checkAuth?.isAuthenticated) {
      router.replace("/protected/app/driver");

      hideSplashScreen();
      return;
    }

    router.replace("/public/sign-in");
    hideSplashScreen();
  }, [rootNavigationState?.key, isLoadingCheckAuth]);

  return null;
}
