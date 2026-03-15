import { Component } from "../../types/component";
import { Page } from "../../types/page";
import { Button as ShadcnUIButton } from "@/components/ui/button";
import { ButtonProps } from "@/components/ui/button";
import Link from "next/link";
import { useId } from "react";

export type Button = Component & {
  __component: "button.button";
  locale: string;
  disabled: boolean;
  variant?: string;
  size?: string;
  className?: string;
  text?: string;
  href?: string;
  page?: Page;
};

export function Button({
  locale,
  disabled,
  variant,
  size,
  className,
  text,
  href,
  page,
}: Button) {
  const buttonId = useId();

  return (
    <ShadcnUIButton
      key={buttonId}
      variant={variant as ButtonProps["variant"]}
      size={(size as ButtonProps["size"]) || "sm"}
      disabled={disabled}
      className={className}
    >
      <Link href={`/${locale}/${page?.slug || href || ""}`}>{text}</Link>
    </ShadcnUIButton>
  );
}
