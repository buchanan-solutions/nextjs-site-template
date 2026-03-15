// ./src/providers/app-setup-provider.tsx
"use client";

import { usePathname } from "next/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

import { loggerFactory } from "@/lib/logger/client/factory";
import { UiRuntimeContract } from "@/lib/ui/utils/getUiRuntimeConfig";

const log = loggerFactory.createLogger("AppSetupProvider");

interface AppContextValue {
  nodeEnv: UiRuntimeContract["nodeEnv"];
  uiRef: UiRuntimeContract["uiRef"];
  uiCommit: UiRuntimeContract["uiCommit"];
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function useApp(): AppContextValue {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }

  return context;
}

export function AppProvider({
  children,
  uiRuntimeConfig,
}: {
  children: React.ReactNode;
  uiRuntimeConfig: UiRuntimeContract;
}) {

  const contextValue = useMemo(
    () => ({ 
      nodeEnv: uiRuntimeConfig.nodeEnv, 
      uiRef: uiRuntimeConfig.uiRef, 
      uiCommit: uiRuntimeConfig.uiCommit, 
    }),
    [uiRuntimeConfig],
  );

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}
