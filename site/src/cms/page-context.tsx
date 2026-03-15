// ./src/lib/cms/page-context.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import type { Page } from "./types/page";
import type { Document } from "@/lib/cms/types/document";

interface PageContextType {
  currentPage: Page | null;
  setCurrentPage: (page: Page | null) => void;
  localizations: Page[];
  setLocalizations: (localizations: Page[]) => void;

  // New collection-related fields
  collectionItems: Document[] | null;
  setCollectionItems: (items: Document[] | null) => void;
  currentCollectionItem: Document | null;
  setCurrentCollectionItem: (item: Document | null) => void;

  debug: boolean;
  setDebug: (debug: boolean) => void;
}

const PageContext = createContext<PageContextType | undefined>(undefined);

export function usePage() {
  const context = useContext(PageContext);
  if (context === undefined) {
    throw new Error("usePage must be used within a PageProvider");
  }
  return context;
}

interface PageContextProviderProps {
  children: ReactNode;
}

export function PageContextProvider({ children }: PageContextProviderProps) {
  const [currentPage, setCurrentPage] = useState<Page | null>(null);
  const [localizations, setLocalizations] = useState<Page[]>([]);
  const [collectionItems, setCollectionItems] = useState<Document[] | null>(
    null
  );
  const [currentCollectionItem, setCurrentCollectionItem] =
    useState<Document | null>(null);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    console.log("localizations set to:", localizations);
  }, [localizations]);

  return (
    <PageContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        localizations,
        setLocalizations,
        collectionItems,
        setCollectionItems,
        currentCollectionItem,
        setCurrentCollectionItem,
        debug,
        setDebug,
      }}
    >
      {children}
    </PageContext.Provider>
  );
}
