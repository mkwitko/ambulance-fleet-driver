import Constants from "expo-constants";
import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_BACKEND: z.string(),
  EXPO_PUBLIC_APP_VERSION: z.string(),
});

const parsedEnv = envSchema.safeParse(Constants.expoConfig?.extra || {});

if (!parsedEnv.success) {
  console.error(
    "❌ Invalid environment variables: ",
    parsedEnv.error.flatten().fieldErrors
  );
  throw new Error("❌ Invalid environment variables.");
}

export const env = parsedEnv.data;
