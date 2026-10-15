import { QueryClientProvider } from "@tanstack/react-query";
import React, { type ReactNode } from "react";
import { queryClient } from "../lib/react-query";
import { setupFocusManager } from "../utils/refetch-manager";

export function Providers({ children }: { children: ReactNode }) {
  setupFocusManager();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
