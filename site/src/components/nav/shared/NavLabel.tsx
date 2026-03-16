// ./src/components/nav/shared/NavLabel.tsx
"use client";

import { cn } from "@/utils";
import { NavBadges } from "./NavBadges";
import type { NavNode } from "../nav-model";

export interface NavLabelProps {
  node: NavNode;
  variant?: "desktop" | "mobile";
  /** Extra class for the label span (e.g. active styling) */
  labelClassName?: string;
}

export function NavLabel({
  node,
  variant = "desktop",
  labelClassName,
}: NavLabelProps) {
  return (
    <>
      <span
        className={cn(
          variant === "desktop" ? "text-foreground" : "text-foreground",
          labelClassName
        )}
      >
        {node.label}
      </span>
      <NavBadges badges={node.badges} />
    </>
  );
}
