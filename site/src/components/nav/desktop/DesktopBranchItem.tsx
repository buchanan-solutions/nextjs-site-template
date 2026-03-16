// ./src/components/nav/desktop/DesktopBranchItem.tsx
"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils";
import { NavLabel } from "../shared/NavLabel";
import { NavChildren } from "../shared/NavChildren";
import type { NavNode } from "../nav-model";

export interface DesktopBranchItemProps {
  node: NavNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  forceDark?: boolean;
}

function DesktopDropdownChild({
  node,
}: {
  node: NavNode;
}) {
  if (node.disabled) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-colors opacity-50 select-none pointer-events-none">
        <NavLabel
          node={node}
          variant="desktop"
          labelClassName={node.active ? "text-primary font-medium" : ""}
        />
      </div>
    );
  }
  const href = node.href ?? "#";
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors no-underline",
        node.active ? "bg-accent text-primary-foreground" : ""
      )}
    >
      <NavLabel
        node={node}
        variant="desktop"
        labelClassName={node.active ? "text-primary-foreground font-medium" : ""}
      />
    </Link>
  );
}

export function DesktopBranchItem({
  node,
  isOpen,
  onOpenChange,
  onMouseEnter,
  onMouseLeave,
  forceDark = false,
}: DesktopBranchItemProps) {
  const renderChild = (childNode: NavNode) => (
    <DesktopDropdownChild key={childNode.id} node={childNode} />
  );

  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild className="data-[state=open]:border-primary">
        <div
          className={cn(
            "flex items-center gap-1 cursor-pointer py-2 border-b-2 transition-colors duration-200 text-foreground",
            node.active
              ? "border-primary"
              : "border-transparent hover:border-primary",
            forceDark && "dark"
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <NavLabel node={node} variant="desktop" />
          <ChevronDown className="h-4 w-4" />
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-56 p-2 z-[52] border-none"
        align="start"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex flex-col space-y-1">
          <NavChildren nodes={node.children} renderItem={renderChild} />
        </div>
      </PopoverContent>
    </Popover>
  );
}
