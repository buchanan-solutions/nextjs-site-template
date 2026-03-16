// ./src/components/nav/nav-model.ts

import type { Menu } from "@/cms/types/menu";
import type { MenuItem, SubmenuItem } from "@/cms/components/menu/menu-item";

export type NavNode = {
  id: string;
  label: string;
  href: string | null;
  active: boolean;
  disabled: boolean;
  hasChildren: boolean;
  children: NavNode[];
  badges: {
    comingSoon?: boolean;
    noPage?: boolean;
  };
};

function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch {
    return str;
  }
}

/** Slug part only: segment(s) after first segment (locale). E.g. "about" from "/en/about". */
function getCurrentSlug(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length <= 1) return "";
  const encoded = parts.slice(1).join("/");
  return safeDecodeURIComponent(encoded);
}

function resolveHref(item: { href?: string; page?: { slug: string } }): string | null {
  if (item.href) return item.href;
  if (item.page?.slug) return `/${item.page.slug}`;
  return null;
}

function isSlugActive(
  currentSlug: string,
  itemSlug: string,
  exact: boolean
): boolean {
  const decoded = safeDecodeURIComponent(itemSlug);
  if (exact) return currentSlug === decoded;
  return currentSlug === decoded || currentSlug.startsWith(decoded + "/");
}

/** True when pathname equals href or is a subpath of it (e.g. /en/about and href /en/about). */
function pathnameMatchesHref(pathname: string, href: string | null): boolean {
  if (!href) return false;
  const normalizedPath = pathname.replace(/^\//, "") || "";
  const normalizedHref = href.replace(/^\//, "") || "";
  return normalizedPath === normalizedHref || normalizedPath.startsWith(normalizedHref + "/");
}

function itemHasVisibleChildren(item: MenuItem): boolean {
  return Boolean(
    item.submenu_items?.some(
      (sub) => sub.page && sub.page.publishedAt != null
    )
  );
}

function topLevelVisible(
  item: MenuItem,
  nodeEnv: string
): boolean {
  if (nodeEnv === "development") return true;
  const hasChildren =
    item.submenu_items?.some(
      (child) => child.href || child.page?.slug
    );
  const hasPage = item.href || item.page?.slug;
  return Boolean(hasChildren || hasPage);
}

function childVisible(child: SubmenuItem, nodeEnv: string): boolean {
  if (nodeEnv === "development") return true;
  return Boolean(child.href || child.page?.slug);
}

function projectSubItem(
  child: SubmenuItem,
  currentSlug: string,
  nodeEnv: string
): NavNode | null {
  if (!childVisible(child, nodeEnv)) return null;
  const href = resolveHref(child);
  const active = Boolean(
    child.page?.slug &&
      isSlugActive(currentSlug, child.page.slug, true)
  );
  const comingSoon = Boolean(child.page?.comingSoon);
  const noPage = !child.href && !child.page?.slug;
  return {
    id: String(child.id),
    label: child.label,
    href,
    active,
    disabled: comingSoon,
    hasChildren: false,
    children: [],
    badges: { comingSoon, noPage: nodeEnv === "development" && noPage },
  };
}

function projectItem(
  item: MenuItem,
  currentSlug: string,
  pathname: string,
  nodeEnv: string
): NavNode | null {
  if (!topLevelVisible(item, nodeEnv)) return null;

  const hasChildren = itemHasVisibleChildren(item);
  const href = resolveHref(item);
  const active = hasChildren
    ? Boolean(
        item.submenu_items?.some((sub) => {
          if (!sub.page?.slug) return false;
          return isSlugActive(currentSlug, sub.page.slug, true);
        })
      )
    : Boolean(
        (item.page?.slug &&
          isSlugActive(currentSlug, item.page.slug, false)) ||
          pathnameMatchesHref(pathname, href)
      );
  const comingSoon = Boolean(item.page?.comingSoon);
  const noPage = !item.href && !item.page?.slug;

  const children: NavNode[] = (item.submenu_items ?? [])
    .map((child) => projectSubItem(child, currentSlug, nodeEnv))
    .filter((n): n is NavNode => n != null);

  return {
    id: String(item.id),
    label: item.label,
    href,
    active,
    disabled: comingSoon,
    hasChildren,
    children,
    badges: { comingSoon, noPage: nodeEnv === "development" && noPage },
  };
}

/**
 * Build a UI-ready nav tree from CMS menu and current pathname.
 * Single source of truth for slug decoding, active state, visibility, hrefs, and badges.
 */
export function buildNavTree(
  menu: Menu | null,
  pathname: string,
  nodeEnv: string
): NavNode[] {
  if (!menu?.items?.length) return [];
  const currentSlug = getCurrentSlug(pathname);
  return menu.items
    .map((item) => projectItem(item, currentSlug, pathname, nodeEnv))
    .filter((n): n is NavNode => n != null);
}
