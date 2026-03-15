// ./ComponentRenderer.tsx
import React, { useId } from "react";
import { componentRegistry } from "../../cms/components/registry";
import { ComponentUnion } from "../../cms/components/component-union";
import { Page } from "../types/page";
import { LoggerLike, NoopLogger } from "@buchanan-solutions/ts-logkit";

interface ComponentRendererProps {
  page: Page;
  contentBlocks: ComponentUnion[];
}

export function ComponentRenderer({
  page,
  contentBlocks,
}: ComponentRendererProps, logger: LoggerLike = NoopLogger) {
  const log = logger.child("ComponentRenderer");
  const id = useId();
  return (
    <>
      {contentBlocks.map((block) => {
        const Component =
          componentRegistry[
            block.__component as keyof typeof componentRegistry
          ];

        if (!Component) {
          log.warn(
            `⚠️ No React component found for type: ${block.__component}`
          );
          return null;
        } else {
          log.info(`Component found for type: ${block.__component}`);
        }

        // 🔧 Type narrowing using the discriminator
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return <Component key={id} page={page} {...(block as any)} />;
      })}
    </>
  );
}
