// ./src/components/nav/shared/NavLeafItem.tsx
"use client";

import Link from "next/link";
import { cn } from "@/utils";
import { NavLabel } from "./NavLabel";
import type { NavNode } from "../nav-model";

export interface NavLeafItemProps {
  node: NavNode;
  /** For desktop: border-b-2 active state. For mobile: text-primary. */
  activeClassName?: string;
  /** Base link class (layout, hover). */
  className?: string;
}

export function NavLeafItem({
  node,
  activeClassName,
  className,
}: NavLeafItemProps) {
  const href = node.href ?? "#";
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 py-2 border-b-2 transition-colors duration-200 no-underline",
        node.active ? (activeClassName ?? "border-primary") : "border-transparent hover:border-primary",
        className
      )}
    >
      <NavLabel node={node} variant="desktop" labelClassName="decoration-none" />
    </Link>
  );
}
