// ./src/providers/cms-provider.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
} from "react";

import { loggerFactory } from "@/lib/logger/client/factory";

const log = loggerFactory.createLogger("CMSProvider");

interface CMSContextValue {
  debugHeader: boolean;
  setDebugHeader: (debugHeader: boolean) => void;
  debugFooter: boolean;
  setDebugFooter: (debugFooter: boolean) => void;
}

const CMSContext = createContext<CMSContextValue | undefined>(undefined);

export function useCMS(): CMSContextValue {
  const context = useContext(CMSContext);

  if (!context) {
    throw new Error("useCMS must be used within an CMSProvider");
  }

  return context;
}

export function CMSProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  // Debug Header and Debug Footer
  const [debugHeader, setDebugHeader] = useState(false);
  const [debugFooter, setDebugFooter] = useState(false);
  return (
    <CMSContext.Provider value={{ debugHeader, setDebugHeader, debugFooter, setDebugFooter }}>
      {children}
    </CMSContext.Provider>
  );
}
