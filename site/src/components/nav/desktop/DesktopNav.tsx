// ./src/components/nav/desktop/DesktopNav.tsx
"use client";

import { useState, useCallback } from "react";
import { cn } from "@/utils";
import { useNav } from "../use-nav";
import { NavItem } from "../shared/NavItem";
import { NavLeafItem } from "../shared/NavLeafItem";
import { DesktopBranchItem } from "./DesktopBranchItem";
import type { Menu } from "@/cms/types/menu";
import type { NavNode } from "../nav-model";

export interface DesktopNavProps {
  menu: Menu | null;
  children?: React.ReactNode;
  forceDark?: boolean;
}

export function DesktopNav({
  menu,
  children,
  forceDark = false,
}: DesktopNavProps) {
  const { nodes } = useNav(menu);
  const [openPopover, setOpenPopover] = useState<string | null>(null);

  const handleMouseEnter = useCallback((id: string) => {
    setOpenPopover(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const renderBranch = useCallback(
    (node: NavNode) => (
      <DesktopBranchItem
        key={node.id}
        node={node}
        isOpen={openPopover === node.id}
        onOpenChange={(open) => setOpenPopover(open ? node.id : null)}
        onMouseEnter={() => handleMouseEnter(node.id)}
        onMouseLeave={handleMouseLeave}
        forceDark={forceDark}
      />
    ),
    [openPopover, handleMouseEnter, handleMouseLeave, forceDark]
  );

  const renderLeaf = useCallback((node: NavNode) => (
    <NavLeafItem
      key={node.id}
      node={node}
      activeClassName="border-primary"
    />
  ), []);

  return (
    <nav
      id="desktop-nav"
      className={cn(
        "hidden md:flex items-center gap-4 px-6",
        forceDark && "dark"
      )}
    >
      <div
        id="desktop-nav-items"
        className={cn("flex items-center gap-8 pr-4", forceDark && "dark")}
      >
        {nodes.map((node) => (
          <NavItem
            key={node.id}
            node={node}
            renderBranch={renderBranch}
            renderLeaf={renderLeaf}
          />
        ))}
      </div>
      {children}
    </nav>
  );
}
