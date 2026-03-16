// ./src/components/nav/mobile/MobileBranchItem.tsx
"use client";

import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/utils";
import { NavLabel } from "../shared/NavLabel";
import { NavChildren } from "../shared/NavChildren";
import type { NavNode } from "../nav-model";

export interface MobileBranchItemProps {
  node: NavNode;
  isExpanded: boolean;
  onToggle: () => void;
  forceDark?: boolean;
  onChildClick?: () => void;
}

function MobileDropdownChild({
  node,
  forceDark,
  onChildClick,
}: {
  node: NavNode;
  forceDark?: boolean;
  onChildClick?: () => void;
}) {
  if (node.disabled) {
    return (
      <div className="flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-colors opacity-50 select-none pointer-events-none">
        <NavLabel
          node={node}
          variant="mobile"
          labelClassName={node.active ? "text-primary font-medium" : "text-foreground"}
        />
      </div>
    );
  }
  const href = node.href ?? "#";
  return (
    <Link
      href={href}
      onClick={onChildClick}
      className={cn(
        "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
        node.active ? "bg-accent text-accent-foreground" : ""
      )}
    >
      <NavLabel
        node={node}
        variant="mobile"
        labelClassName={
          node.active
            ? forceDark
              ? "text-foreground font-medium dark"
              : "text-primary font-medium"
            : "text-foreground"
        }
      />
    </Link>
  );
}

export function MobileBranchItem({
  node,
  isExpanded,
  onToggle,
  forceDark = false,
  onChildClick,
}: MobileBranchItemProps) {
  const renderChild = (childNode: NavNode) => (
    <MobileDropdownChild
      key={childNode.id}
      node={childNode}
      forceDark={forceDark}
      onChildClick={onChildClick}
    />
  );

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between w-full text-left py-2 text-lg font-medium transition-colors",
          node.active ? "text-primary" : "text-foreground hover:text-primary",
          forceDark && "dark"
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <NavLabel node={node} variant="mobile" />
        </div>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {isExpanded && (
        <div className="ml-4 space-y-2 border-l border-border pl-4">
          <NavChildren nodes={node.children} renderItem={renderChild} />
        </div>
      )}
    </div>
  );
}
