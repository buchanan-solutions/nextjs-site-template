// ./src/components/nav/shared/NavItem.tsx
"use client";

import type { NavNode } from "../nav-model";

export interface NavItemProps {
  node: NavNode;
  renderBranch: (node: NavNode) => React.ReactNode;
  renderLeaf: (node: NavNode) => React.ReactNode;
}

/**
 * Dispatches to branch or leaf renderer based on node.hasChildren.
 */
export function NavItem({ node, renderBranch, renderLeaf }: NavItemProps) {
  return node.hasChildren ? renderBranch(node) : renderLeaf(node);
}
