"use client";

import Link from "next/link";
import type { Menu } from "@/cms/types/menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/utils";
import { useApp } from "@/providers/app-provider";

interface FooterNavProps {
  menuItems: Menu | null;
  locale: string;
}

export function FooterNav({ menuItems, locale }: FooterNavProps) {
  const { nodeEnv } = useApp();

  if (!menuItems?.items) return null;

  // Filter valid items based on environment
  const validItems = menuItems.items.filter((item) => {
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
  });

  // Build columns by processing items in order
  const columns: Array<{
    parentItem: (typeof validItems)[0];
    childItems: typeof validItems;
  }> = [];

  let pendingOrphanedItems: typeof validItems = [];

  for (const item of validItems) {
    const hasChildren = (() => {
      if (nodeEnv === "development") {
        return item.submenu_items && item.submenu_items.length > 0;
      }
      return (
        item.submenu_items &&
        item.submenu_items.some(
          (childItem) =>
            (childItem.href || childItem.page?.slug)
        )
      );
    })();

    if (hasChildren) {
      // This item has children, create a column for it
      // Add any pending orphaned items to this column first
      columns.push({
        parentItem: item,
        childItems: [...pendingOrphanedItems, ...(item.submenu_items || [])],
      });
      pendingOrphanedItems = []; // Clear pending items
    } else {
      // This is an orphaned item
      if (columns.length > 0) {
        // Add to the previous column
        const lastColumn = columns[columns.length - 1];
        lastColumn.childItems.push(item);
      } else {
        // No previous column, add to pending list
        pendingOrphanedItems.push(item);
      }
    }
  }

  // If we still have pending orphaned items at the end, add them to the last column
  if (pendingOrphanedItems.length > 0 && columns.length > 0) {
    const lastColumn = columns[columns.length - 1];
    lastColumn.childItems.push(...pendingOrphanedItems);
  }

  return (
    <TooltipProvider>
      {columns.map((column) => (
        <div key={column.parentItem.id} className="text-left space-y-4">
          <h4 className="text-sm font-semibold">{column.parentItem.label}</h4>
          <nav className="flex flex-col space-y-3 items-start">
            {column.childItems
              .filter(
                (childItem) =>
                  nodeEnv === "development"
                    ? true // Show all items in development
                    : childItem.href || childItem.page?.slug //&& !childItem.hidden
              )
              .map((childItem) => {
                const childHref =
                  childItem.href ||
                  (childItem.page?.slug
                    ? `/${locale}/${childItem.page.slug}`
                    : "#");

                const isComingSoon = childItem.page?.comingSoon;
                const hasNoPage =
                  !childItem.href && !childItem.page?.slug;

                // Check if this child item is actually a top-level orphaned item
                const isOrphanedItem = !column.parentItem.submenu_items?.some(
                  (submenuItem) => submenuItem.id === childItem.id
                );

                const getTooltipContent = () => {
                  if (isComingSoon) return "Coming Soon";
                  if (hasNoPage && nodeEnv === "development")
                    return "No Page";
                  return null;
                };

                const tooltipContent = getTooltipContent();
                const shouldBeDisabled =
                  isComingSoon ||
                  (hasNoPage && nodeEnv === "development")

                const itemContent = (
                  <div
                    className={cn(
                      "flex items-center gap-2 text-sm",
                      shouldBeDisabled && "opacity-50 select-none",
                      isOrphanedItem && "font-semibold"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        isOrphanedItem && "font-semibold"
                      )}
                    >
                      {childItem.label}
                    </span>
                    {isComingSoon && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                    {hasNoPage && nodeEnv === "development" && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </div>
                );

                if (tooltipContent) {
                  return (
                    <Tooltip key={childItem.id}>
                      <TooltipTrigger asChild>
                        {shouldBeDisabled ? (
                          itemContent
                        ) : (
                          <Link
                            href={childHref}
                            className={cn(
                              "flex items-center gap-2 text-sm w-fit transition-transform duration-200 hover:translate-x-1",
                              isOrphanedItem && "font-semibold"
                            )}
                          >
                            <span
                              className={cn(isOrphanedItem && "font-semibold")}
                            >
                              {childItem.label}
                            </span>
                            {isComingSoon && (
                              <div className="w-2 h-2 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                            {hasNoPage && nodeEnv === "development" && (
                              <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 flex-shrink-0"></div>
                            )}
                          </Link>
                        )}
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{tooltipContent}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                }

                return (
                  <Link
                    key={childItem.id}
                    href={childHref}
                    className={cn(
                      "flex items-center gap-2 text-sm w-fit transition-transform duration-200 hover:translate-x-1",
                      isOrphanedItem && "font-semibold"
                    )}
                  >
                    <span className={cn(isOrphanedItem && "font-semibold")}>
                      {childItem.label}
                    </span>
                    {isComingSoon && (
                      <div className="w-2 h-2 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                    {hasNoPage && nodeEnv === "development" && (
                      <div className="w-2 h-2 bg-orange-500 rounded-full ml-2 flex-shrink-0"></div>
                    )}
                  </Link>
                );
              })}
          </nav>
        </div>
      ))}
    </TooltipProvider>
  );
}
