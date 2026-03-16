// ./src/components/nav/use-nav.ts
"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { useApp } from "@/providers/app-provider";
import { buildNavTree } from "./nav-model";
import type { Menu } from "@/cms/types/menu";
import type { NavNode } from "./nav-model";

export interface UseNavResult {
  nodes: NavNode[];
}

/**
 * Hook that builds the headless nav tree from menu, pathname, and env.
 * Use in DesktopNav / MobileNav so they only handle layout and interaction state.
 */
export function useNav(menu: Menu | null): UseNavResult {
  const pathname = usePathname();
  const { nodeEnv } = useApp();

  const nodes = useMemo(
    () => buildNavTree(menu ?? null, pathname ?? "", nodeEnv ?? "development"),
    [menu, pathname, nodeEnv]
  );

  return { nodes };
}
