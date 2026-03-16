// ./src/components/nav/header-nav.tsx
"use client";

/**
 * Header nav re-exports for backward compatibility.
 * Desktop and mobile nav are implemented as headless model + layout shells:
 *
 * - nav-model.ts: buildNavTree (slug, active, visibility, hrefs, badges)
 * - use-nav.ts: hook that builds tree from menu + pathname + env
 * - shared/: NavItem, NavLeafItem, NavLabel, NavBadges, NavChildren
 * - desktop/: DesktopNav, DesktopBranchItem (popover state, hover)
 * - mobile/: MobileNav, MobileBranchItem (sheet state, expand/collapse)
 */

export { DesktopNav as HeaderNav } from "./desktop";
export { MobileNav } from "./mobile";
