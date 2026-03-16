// ./src/components/nav/shared/NavBadges.tsx
"use client";

import { useApp } from "@/providers/app-provider";
import type { NavNode } from "../nav-model";

export interface NavBadgesProps {
  badges: NavNode["badges"];
}

export function NavBadges({ badges }: NavBadgesProps) {

  const { nodeEnv } = useApp();

  if (!badges.comingSoon && !badges.noPage) return null;

  return (
    <>
      {badges.comingSoon && (
        <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
          Coming Soon
        </span>
      )}
      {badges.noPage && nodeEnv === "development" && (
        <span className="text-xs italic font-medium text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/20">
          No Page
        </span>
      )}
    </>
  );
}
