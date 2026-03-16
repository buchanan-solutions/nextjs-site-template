// ./src/components/layout/desktop-nav/desktop-nav.tsx
"use client";

// Standard
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, Children, cloneElement, isValidElement } from "react";

// Third Party
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronDown, ChevronUp, Menu as MenuIcon, X } from "lucide-react";

// import { useTheme } from "@/hooks/use-theme";
import { useApp } from "@/providers/app-provider";
import { cn } from "@/utils";

import type { Menu } from "@/cms/types/menu";
import { useLogger } from "@/lib/logger/client";

interface DesktopNavProps {
  // navigationItems: NavigationItem[];
  menu: Menu | null;
  children?: React.ReactNode;
  forceDark?: boolean;
}

/**
 *
 * Desktop navigation component for the header - renders a list of menu and submenu items in a desktop view.
 *
 * @param menuItems - The menu items to display
 * @param environment - The environment to display the menu items in
 * @param children - The children to display
 * @returns The desktop navigation component
 */
export function HeaderNav({
  menu,
  children,
  forceDark = false,
}: DesktopNavProps) {
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const pathname = usePathname();
  // const { colorTheme } = useTheme();
  const { nodeEnv } = useApp();
  const log = useLogger("HeaderNav", { level: "info" });

  log.info("Rendering header nav");

  // Helper function to safely decode URL-encoded segments
  const safeDecodeURIComponent = (str: string): string => {
    try {
      const decoded = decodeURIComponent(str);
      log.debug("Decoded " + str + " to " + decoded);
      return decoded;
    } catch (error) {
      log.debug("Failed to decode " + str + ": " + error);
      return str;
    }
  };

  const encodedCurrentSlug = pathname.split("/").slice(2).join("/") || "";
  const currentSlug = safeDecodeURIComponent(encodedCurrentSlug);

  log.debug("Current pathname:", pathname);
  log.debug("Encoded current slug:", encodedCurrentSlug);
  log.debug("Decoded current slug:", currentSlug);

  // Helper function to check if a menu item is active
  const isItemActive = (item: {
    page?: { slug: string };
    submenu_items?: { page?: { slug: string } }[];
  }) => {
    // Check if the parent item itself is active
    if (item.page?.slug) {
      const decodedItemSlug = safeDecodeURIComponent(item.page.slug);
      if (
        currentSlug === decodedItemSlug ||
        currentSlug.startsWith(decodedItemSlug + "/")
      ) {
        return true;
      }
    }

    // Check if any submenu item is active
    if (item.submenu_items) {
      return item.submenu_items.some((subItem) => isSubItemActive(subItem));
    }

    return false;
  };

  // Helper function to check if a submenu item is exactly active
  const isSubItemActive = (item: { page?: { slug: string } }) => {
    if (!item.page?.slug) return false;
    const decodedItemSlug = safeDecodeURIComponent(item.page.slug);
    return currentSlug === decodedItemSlug;
  };

  const handleMouseEnter = (href: string) => {
    setOpenPopover(href);
  };

  const handleMouseLeave = () => {
    setOpenPopover(null);
  };

  return (
    <nav
      id="desktop-nav"
      className={cn(
        "hidden md:flex items-center gap-4 px-6",
        forceDark && "dark",
      )}
      // data-color-theme={forceDark ? colorTheme : undefined} // Add this
    >
      <div
        id="desktop-nav-items"
        className={cn("flex items-center gap-8 pr-4", forceDark && "dark")}
        // data-color-theme={forceDark ? colorTheme : undefined}
      >
        {menu?.items
          .filter((item) => {
            if (nodeEnv === "development") {
              return true; // Show all items in development
            }
            const hasChildren =
              item.submenu_items &&
              item.submenu_items.some(
                (childItem) =>
                  (childItem.href || childItem.page?.slug)
              );
            const hasPage = item.href || item.page?.slug;
            return hasChildren || hasPage;
          })
          .map((item) => {
            const hasChildren =
              item.submenu_items &&
              item.submenu_items.some(
                (subItem) => subItem.page && subItem.page.publishedAt !== null,
              );
            const isActive = isItemActive(item);

            log.debug(
              `Menu Item: ${item.label}: ` +
                `hasChildren: ${hasChildren} isActive: ${isActive}`,
            );

            if (hasChildren) {
              const topLevelItemContent = (
                <>
                  <span className="text-foreground">{item.label}</span>
                  {nodeEnv === "development" && (
                    <>
                      {item.page?.comingSoon && (
                        <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                          Coming Soon
                        </span>
                      )}
                      {!item.href && !item.page?.slug && (
                        // <span className="text-xs italic font-medium text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/20">
                        //   No Page
                        // </span>
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        </div>
                      )}
                    </>
                  )}
                  <ChevronDown className="h-4 w-4" />
                </>
              );

              const itemId = item.id.toString();

              return (
                <Popover
                  key={item.id}
                  open={openPopover === itemId}
                  onOpenChange={(open) => setOpenPopover(open ? itemId : null)}
                  // data-color-theme={forceDark ? colorTheme : undefined}
                >
                  <PopoverTrigger
                    asChild
                    className="data-[state=open]:border-primary"
                  >
                    <div
                      className={cn(
                        "flex items-center gap-1 cursor-pointer py-2 border-b-2 transition-colors duration-200 text-foreground",
                        isActive
                          ? "border-primary"
                          : "border-transparent hover:border-primary",
                        // forceDark && "dark",
                      )}
                      onMouseEnter={() => handleMouseEnter(itemId)}
                      onMouseLeave={handleMouseLeave}
                      // data-color-theme={forceDark ? colorTheme : undefined}
                    >
                      {topLevelItemContent}
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-56 p-2 z-[52]"
                    align="start"
                    onMouseEnter={() => handleMouseEnter(itemId)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex flex-col space-y-1">
                      {item.submenu_items
                        ?.filter((childItem) =>
                          nodeEnv === "development"
                            ? true // Show all items in development
                            : (childItem.href ||
                                childItem.page?.slug)
                        )
                        .map((childItem) => {
                          const childIsActive = isSubItemActive(childItem);
                          const itemContent = (
                            <>
                              {/* {childItem.icon && <childItem.icon className="h-4 w-4" />} */}
                              <span
                                className={cn(
                                  "text-md md:text-md",
                                  childIsActive
                                    ? forceDark
                                      ? "text-primary font-medium dark"
                                      : "text-primary font-medium"
                                    : "",
                                )}
                                // data-color-theme={
                                  // forceDark ? colorTheme : undefined
                                // }
                              >
                                {childItem.label}
                              </span>
                              {childItem.page?.comingSoon && (
                                <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                                  Coming Soon
                                </span>
                              )}
                              {nodeEnv === "development" &&
                                !childItem.href &&
                                !childItem.page?.slug && (
                                <span className="text-xs italic font-medium text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/20">
                                  No Page
                                </span>
                              )}
                            </>
                          );

                          if (childItem.page?.comingSoon) {
                            return (
                              <div
                                key={childItem.id}
                                className={cn(
                                  "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-colors opacity-50 select-none pointer-events-none",
                                )}
                              >
                                {itemContent}
                              </div>
                            );
                          }

                          const childHref =
                            childItem.href ||
                            (childItem.page?.slug
                              ? `/${childItem.page.slug}`
                              : "#");

                          return (
                            <Link
                              key={childItem.id}
                              href={childHref}
                              className={cn(
                                "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                                childIsActive ? "bg-accent text-primary" : "",
                              )}
                              // data-color-theme={
                                // forceDark ? colorTheme : undefined
                              // }
                            >
                              {itemContent}
                            </Link>
                          );
                        })}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            const itemHref =
              item.href ||
              (item.page?.slug ? `/${item.page.slug}` : "#");

            const simpleItemContent = (
              <>
                <span className="text-foreground">{item.label}</span>
                {nodeEnv === "development" && (
                  <>
                    {item.page?.comingSoon && (
                      <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                        Coming Soon
                      </span>
                    )}
                    {!item.href && !item.page?.slug && (
                      <span className="text-xs italic font-medium text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/20">
                        No Page
                      </span>
                    )}
                  </>
                )}
              </>
            );

            return (
              <Link
                key={item.id}
                href={itemHref}
                className={cn(
                  "flex items-center gap-2 py-2 text-red-500 border-b-2 transition-colors duration-200 text-decoration-none",
                  isActive
                    ? "border-primary"
                    : "border-transparent hover:border-primary",
                )}
              >
                {simpleItemContent}
              </Link>
            );
          })}
      </div>
      {children}
    </nav>
  );
}

/**
 * Mobile navigation component that displays a hamburger menu with a slide-out sheet.
 * Supports the same dropdown mechanisms and dev mode indicators as the desktop version.
 *
 * @param menuItems - The menu items to display
 * @param environment - The environment to display the menu items in
 * @param children - The children to display (typically buttons)
 * @param forceDark - Whether to force dark theme
 * @returns The mobile navigation component
 */
export function MobileNav({
  menu,
  children,
  forceDark = false,
}: DesktopNavProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(),
  );
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  // const { colorTheme } = useTheme();
  const { nodeEnv } = useApp();
  const log = useLogger("MobileNav", { level: "info" });

  log.info("Rendering mobile nav");

  // Helper function to safely decode URL-encoded segments
  const safeDecodeURIComponent = (str: string): string => {
    try {
      const decoded = decodeURIComponent(str);
      log.debug("Decoded " + str + " to " + decoded);
      return decoded;
    } catch (error) {
      log.debug("Failed to decode " + str + ": " + error);
      return str;
    }
  };

  const encodedCurrentSlug = pathname.split("/").slice(2).join("/") || "";
  const currentSlug = safeDecodeURIComponent(encodedCurrentSlug);

  // Helper function to check if a menu item is active
  const isItemActive = (item: {
    page?: { slug: string };
    submenu_items?: { page?: { slug: string } }[];
  }) => {
    // Check if the parent item itself is active
    if (item.page?.slug) {
      const decodedItemSlug = safeDecodeURIComponent(item.page.slug);
      if (
        currentSlug === decodedItemSlug ||
        currentSlug.startsWith(decodedItemSlug + "/")
      ) {
        return true;
      }
    }

    // Check if any submenu item is active
    if (item.submenu_items) {
      return item.submenu_items.some((subItem) => isSubItemActive(subItem));
    }

    return false;
  };

  // Helper function to check if a submenu item is exactly active
  const isSubItemActive = (item: { page?: { slug: string } }) => {
    if (!item.page?.slug) return false;
    const decodedItemSlug = safeDecodeURIComponent(item.page.slug);
    return currentSlug === decodedItemSlug;
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

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
              : "bg-background text-foreground",
          )}
          // data-color-theme={forceDark ? colorTheme : undefined}
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
                  : "rotate-0 opacity-100 scale-100",
              )}
            />
            <X
              className={cn(
                "h-6 w-6 text-white transition-all duration-300 ease-in-out",
                isOpen
                  ? "rotate-0 opacity-100 scale-100"
                  : "-rotate-180 opacity-0 scale-75",
              )}
            />
          </div>
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        className={cn(
          "w-full h-[calc(100vh-var(--header-height))] top-[var(--header-height)] inset-x-0 rounded-none border-none p-0",
          forceDark && "dark",
        )}
        // data-color-theme={forceDark ? colorTheme : undefined}
        side="top"
        hideDefaultClose={true}
      >
        <SheetTitle className="text-left mb-1 sr-only">
          Navigation Menu
        </SheetTitle>
        <div className="flex flex-col h-full bg-background">
          <nav className="flex flex-col gap-6 mt-8 px-6">
            {menu?.items
              .filter((item) => {
                if (nodeEnv === "development") {
                  return true; // Show all items in development
                }
                const hasChildren =
                  item.submenu_items &&
                  item.submenu_items.some(
                    (childItem) =>
                      (childItem.href || childItem.page?.slug)
                  );
                const hasPage = item.href || item.page?.slug;
                return hasChildren || hasPage;
              })
              .map((item) => {
                const itemId = item.id.toString();
                const hasChildren =
                  item.submenu_items &&
                  item.submenu_items.some(
                    (subItem) =>
                      subItem.page && subItem.page.publishedAt !== null,
                  );
                const isActive = isItemActive(item);
                const isExpanded = expandedSections.has(itemId);

                log.debug(
                  `Mobile Menu Item: ${item.label}: ` +
                    `hasChildren: ${hasChildren} isActive: ${isActive} isExpanded: ${isExpanded}`,
                );

                if (hasChildren) {
                  return (
                    <div key={itemId} className="space-y-2">
                      <button
                        onClick={() => toggleSection(itemId)}
                        className={cn(
                          "flex items-center justify-between w-full text-left py-2 text-lg font-medium transition-colors",
                          isActive
                            ? "text-primary"
                            : "text-foreground hover:text-primary",
                          // forceDark && "dark",
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span>{item.label}</span>
                          {nodeEnv === "development" && (
                            <>
                              {item.page?.comingSoon && (
                                <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                                  Coming Soon
                                </span>
                              )}
                              {!item.href && !item.page?.slug && (
                                <div className="flex items-center gap-1">
                                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="ml-4 space-y-2 border-l border-border pl-4">
                          {item.submenu_items
                            ?.filter((childItem) =>
                              nodeEnv === "development"
                                ? true // Show all items in development
                                : (childItem.href ||
                                    childItem.page?.slug)
                            )
                            .map((childItem) => {
                              const childIsActive = isSubItemActive(childItem);
                              const childHref =
                                childItem.href ||
                                (childItem.page?.slug
                                  ? `/${childItem.page.slug}`
                                  : "#");

                              const itemContent = (
                                <>
                                  <span
                                    className={cn(
                                      "text-foreground",
                                      childIsActive
                                        ? forceDark
                                          ? "text-foreground font-medium dark"
                                          : "text-primary font-medium"
                                        : "",
                                    )}
                                    data-color-theme={
                                      childIsActive && forceDark
                                        ? "text-background"
                                        : undefined
                                    }
                                  >
                                    {childItem.label}
                                  </span>
                                  {childItem.page?.comingSoon && (
                                    <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                                      Coming Soon
                                    </span>
                                  )}
                                  {nodeEnv === "development" &&
                                    !childItem.href &&
                                    !childItem.page?.slug && (
                                    <span className="text-xs italic font-medium text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/20">
                                      No Page
                                    </span>
                                  )}
                                </>
                              );

                              if (childItem.page?.comingSoon) {
                                return (
                                  <div
                                    key={childItem.id}
                                    className={cn(
                                      "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md transition-colors opacity-50 select-none pointer-events-none",
                                    )}
                                  >
                                    {itemContent}
                                  </div>
                                );
                              }

                              return (
                                <Link
                                  key={childItem.id}
                                  href={childHref}
                                  onClick={() => setIsOpen(false)}
                                  className={cn(
                                    "flex items-center justify-between gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors",
                                    childIsActive
                                      ? "bg-accent text-accent-foreground"
                                      : "",
                                  )}
                                >
                                  {itemContent}
                                </Link>
                              );
                            })}
                        </div>
                      )}
                    </div>
                  );
                }

                const itemHref =
                  item.href ||
                  (item.page?.slug ? `/${item.page.slug}` : "#");

                return (
                  <Link
                    key={item.id}
                    href={itemHref}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-2 py-2 text-lg font-medium transition-colors",
                      isActive
                        ? "text-primary"
                        : "text-foreground hover:text-primary",
                    )}
                  >
                    <span>{item.label}</span>
                    {nodeEnv === "development" && (
                      <>
                        {item.page?.comingSoon && (
                          <span className="text-xs italic font-medium text-green-500 bg-green-500/20 px-2 py-1 rounded-md border border-green-500/20">
                            Coming Soon
                          </span>
                        )}
                        {!item.href && !item.page?.slug && (
                          <span className="text-xs italic font-medium text-orange-500 bg-orange-500/20 px-2 py-1 rounded-md border border-orange-500/20">
                            No Page
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
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
                      setIsOpen(false);
                      // Call the original onClick if it exists
                      if (originalOnClick) {
                        originalOnClick(e);
                      }
                    },
                  },
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
