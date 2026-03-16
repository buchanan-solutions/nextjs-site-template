// ./src/components/Content.tsx

import React from "react";

import { cn } from "@/utils";
import DebuggableDiv from "../debuggable/Div";

export type SlotContent = {
  /** completely replace default */
  replace?: React.ReactNode;

  /** render before default */
  prepend?: React.ReactNode;

  /** render after default */
  append?: React.ReactNode;

  /** classes applied to slot wrapper (layout layer) */
  className?: string;
};

export type ContentParts = {
  left?: SlotContent;
  center?: SlotContent;
  right?: SlotContent;
};

/**
 * Generic Slot component that handles replace/prepend/append logic
 */
function Slot({
  defaultContent,
  slot,
}: {
  defaultContent?: React.ReactNode;
  slot?: SlotContent;
}) {
  if (!slot) return <>{defaultContent}</>;

  if (slot.replace) return <>{slot.replace}</>;

  return (
    <>
      {slot.prepend}
      {defaultContent}
      {slot.append}
    </>
  );
}

const defaultSlotClasses = {
  left: "flex items-center",
  center: "flex-1 flex justify-center min-w-0",
  right: "flex items-center",
} as const;

export interface ContentProps {
  defaults: {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
  };
  content?: ContentParts;
  className?: string;
  /** 
   * Module/theme overrides for slot wrappers 
   * (merged after defaults, before content.*.className) 
   */
  slotClasses?: {
    left?: string;
    center?: string;
    right?: string;
  };
  debug?: boolean;
}

export function Content({
  defaults,
  content,
  className,
  slotClasses,
  debug,
}: ContentProps) {
  return (
    <DebuggableDiv
      debug={debug}
      id="content"
      className={cn("flex items-center gap-2 min-w-0", className)}
    >
      <DebuggableDiv
        debug={debug}
        id="content-left"
        className={cn(
          defaultSlotClasses.left,
          slotClasses?.left,
          content?.left?.className,
        )}
      >
        <Slot defaultContent={defaults.left} slot={content?.left} />
      </DebuggableDiv>
      <DebuggableDiv
        debug={debug}
        id="content-center"
        className={cn(
          defaultSlotClasses.center,
          slotClasses?.center,
          content?.center?.className,
        )}
      >
        <Slot defaultContent={defaults.center} slot={content?.center} />
      </DebuggableDiv>
      <DebuggableDiv
        debug={debug}
        id="content-right"
        className={cn(
          defaultSlotClasses.right,
          slotClasses?.right,
          content?.right?.className,
        )}
      >
        <Slot defaultContent={defaults.right} slot={content?.right} />
      </DebuggableDiv>
    </DebuggableDiv>
  );
}