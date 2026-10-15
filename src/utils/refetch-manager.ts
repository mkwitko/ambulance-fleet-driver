import { focusManager } from "@tanstack/react-query";
import { AppState } from "react-native";

export function setupFocusManager() {
  focusManager.setEventListener((handleFocus) => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        handleFocus();
      }
    });

    return () => subscription.remove();
  });
}
