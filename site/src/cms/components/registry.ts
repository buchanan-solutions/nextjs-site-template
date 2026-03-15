// ./components/registry.ts
import { RichText } from "./shared/rich-text";
// import { TextWithAccent } from "@/components/blocks/TextWithAccent";
import { Button } from "./buttons/button";
import HeaderPolicy from "./page/header-policy";

export const componentRegistry = {
  "shared.rich-text": RichText,
  //   "text.text-w-accent": TextWithAccent,
  "page.header-policy": HeaderPolicy,
  "button.button": Button,
} as const;
