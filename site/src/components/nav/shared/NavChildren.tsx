// ./src/components/nav/shared/NavChildren.tsx
"use client";

import { Fragment } from "react";
import type { NavNode } from "../nav-model";

export interface NavChildrenProps {
  nodes: NavNode[];
  renderItem: (node: NavNode) => React.ReactNode;
}

export function NavChildren({ nodes, renderItem }: NavChildrenProps) {
  return (
    <>
      {nodes.map((node) => (
        <Fragment key={node.id}>{renderItem(node)}</Fragment>
      ))}
    </>
  );
}
