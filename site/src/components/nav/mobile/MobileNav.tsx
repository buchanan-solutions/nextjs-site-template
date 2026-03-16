// ./src/components/nav/mobile/MobileNav.tsx
"use client";

import {
  useState,
  useCallback,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu as MenuIcon, X } from "lucide-react";
import { cn } from "@/utils";
import { useNav } from "../use-nav";
import { NavItem } from "../shared/NavItem";
import { NavLabel } from "../shared/NavLabel";
import { MobileBranchItem } from "./MobileBranchItem";
import type { Menu } from "@/cms/types/menu";
import type { NavNode } from "../nav-model";

export interface MobileNavProps {
  menu: Menu | null;
  children?: React.ReactNode;
  forceDark?: boolean;
}

export function MobileNav({
  menu,
  children,
  forceDark = false,
}: MobileNavProps) {
  const { nodes } = useNav(menu);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  }, []);

  const closeSheet = useCallback(() => setIsOpen(false), []);

  const renderBranch = useCallback(
    (node: NavNode) => (
      <MobileBranchItem
        key={node.id}
        node={node}
        isExpanded={expandedSections.has(node.id)}
        onToggle={() => toggleSection(node.id)}
        forceDark={forceDark}
        onChildClick={closeSheet}
      />
    ),
    [expandedSections, toggleSection, forceDark, closeSheet]
  );

  const renderLeaf = useCallback(
    (node: NavNode) => (
      <Link
        key={node.id}
        href={node.href ?? "#"}
        onClick={closeSheet}
        className={cn(
          "flex items-center gap-2 py-2 text-lg font-medium transition-colors",
          node.active ? "text-primary" : "text-foreground hover:text-primary"
        )}
      >
        <NavLabel node={node} variant="mobile" />
      </Link>
    ),
    [closeSheet]
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant={isOpen ? "default" : "ghost"}
          size="icon"
          className={cn(
            "md:hidden",
            forceDark && "dark",
            isOpen
              ? "bg-primary text-background"
              : "bg-background text-foreground"
          )}
        >
          <div
            id="mobile-nav-icon"
            className="flex items-center justify-center w-6 h-6 overflow-hidden"
          >
            <MenuIcon
              className={cn(
                "h-6 w-6 text-foreground transition-all duration-300 ease-in-out absolute",
                isOpen
                  ? "rotate-180 opacity-0 scale-75"
                  : "rotate-0 opacity-100 scale-100"
              )}
            />
            <X
              className={cn(
                "h-6 w-6 text-white transition-all duration-300 ease-in-out",
                isOpen
                  ? "rotate-0 opacity-100 scale-100"
                  : "-rotate-180 opacity-0 scale-75"
              )}
            />
          </div>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "w-full h-[calc(100vh-var(--header-height))] top-[var(--header-height)] inset-x-0 rounded-none border-none p-0",
          forceDark && "dark"
        )}
        side="top"
        hideDefaultClose={true}
      >
        <SheetTitle className="text-left mb-1 sr-only">
          Navigation Menu
        </SheetTitle>
        <div className="flex flex-col h-full bg-background">
          <nav className="flex flex-col gap-6 mt-8 px-6">
            {nodes.map((node) => (
              <NavItem
                key={node.id}
                node={node}
                renderBranch={renderBranch}
                renderLeaf={renderLeaf}
              />
            ))}
          </nav>

          <div className="mt-auto mb-8 flex flex-row justify-evenly px-6">
            {Children.map(children, (child) => {
              if (isValidElement(child)) {
                const originalOnClick = (
                  child.props as { onClick?: (e: React.MouseEvent) => void }
                ).onClick;
                return cloneElement(
                  child as React.ReactElement<{
                    onClick?: (e: React.MouseEvent) => void;
                  }>,
                  {
                    onClick: (e: React.MouseEvent) => {
                      closeSheet();
                      originalOnClick?.(e);
                    },
                  }
                );
              }
              return child;
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
