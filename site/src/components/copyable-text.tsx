// ./src/components/copyable-text.tsx
"use client";

import React, { useState } from "react";

import { Check, Copy } from "lucide-react";

import { cn } from "@/utils";

type Props = {
  value: string;
  chars?: number; // Optional truncation length
  displayValue?: string; // Optional custom display value (overrides chars truncation)
  className?: string;
  dataAttribute?: string;
  variant?: "default" | "text";
  side?: "left" | "right";
};

const CopyableText: React.FC<Props> = ({
  value,
  chars,
  displayValue: customDisplayValue,
  className,
  dataAttribute = "data-copyable-text",
  variant = "default",
  side = "right",
}) => {
  const [hovered, setHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayValue =
    customDisplayValue ??
    (chars && value.length > chars ? `${value.substring(0, chars)}...` : value);

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      // Check if clipboard API is available
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      } else {
        // Fallback for older browsers or restricted environments
        fallbackCopyTextToClipboard(value);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
      // You could also show a user-friendly error message here
    }
  };

  // Fallback copy method for older browsers
  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand("copy");
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    } catch (err) {
      console.error("Fallback copy failed:", err);
    }

    document.body.removeChild(textArea);
  };

  // Text-only variant (no icon, no flex, no extra width)
  if (variant === "text") {
    return (
      <span
        className={cn(
          "cursor-pointer select-none transition-colors duration-200",
          copied && "text-green-500",
          className,
        )}
        {...{ [dataAttribute]: true }}
        onClick={handleCopy}
      >
        {displayValue}
      </span>
    );
  }

  // Default variant with icon
  return (
    <span
      className={cn(
        "relative group cursor-pointer flex items-center text-sm gap-1",
        side === "left" ? "flex-row-reverse" : "flex-row",
        className,
      )}
      {...{ [dataAttribute]: true }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCopy}
    >
      <span>{displayValue}</span>
      <span
        className={cn(
          "inline-flex items-center justify-center w-4 h-4 transition-all duration-200 ease-in-out",
          hovered
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none",
        )}
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500 transition-colors duration-200" />
        ) : (
          <Copy className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors duration-200" />
        )}
      </span>
    </span>
  );
};

export default CopyableText;
