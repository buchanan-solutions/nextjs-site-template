// ./src/components/PageContextSetter.tsx
"use client";

import { useEffect } from "react";
import { usePage } from "./page-context";
import type { Page } from "@/cms/types/page";
import { useLogger } from "@/lib/logger/client/hook";

interface PageContextSetterProps {
  page: Page;
}

export function PageContextSetter({ page }: PageContextSetterProps) {
  const { setCurrentPage, setLocalizations } = usePage();
  const log = useLogger("PageContextSetter", { level: "debug" });

  useEffect(() => {
    setCurrentPage(page);
    console.log("page set to:", page.slug || page.id);
    // Set localizations: current page + all localized versions
    const allLocalizations = page.localizations
      ? [page, ...page.localizations]
      : [page];
    log.info("(PageContextSetter) Setting localizations:", {
      allLocalizations,
    });
    setLocalizations(allLocalizations);
  }, [page, setCurrentPage, setLocalizations]);

  return null; // This component doesn't render anything
}
