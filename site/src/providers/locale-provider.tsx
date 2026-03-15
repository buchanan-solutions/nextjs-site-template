// ./src/providers/locale-provider.tsx
"use client";

import { createContext, ReactNode, useContext } from "react";
import { Dictionary } from "@/dictionaries/types";
import { useLogger } from "@/lib/logger/client";

type LocaleContextValue = {
  locale: string;
  dictionary: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function useLocale(): LocaleContextValue {
  const value = useContext(LocaleContext);
  if (value === null) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return value;
}

export function LocaleProvider({
  children,
  initialLocale,
  dictionary,
}: {
  children: ReactNode;
  initialLocale: string;
  dictionary: Dictionary;
}) {
  const log = useLogger("localeProvider", { level: "debug" });
  log.info("Rendering locale: ", initialLocale);

  const value: LocaleContextValue = {
    locale: initialLocale,
    dictionary,
  };

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}
