// src/components/components/shared/rich-text.tsx
import ReactMarkdown from "react-markdown";
import { Component } from "../../types/component";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { cn } from "@/utils";

export type RichText = Component & {
  __component: "shared.rich-text";
  body?: string;
};

export function RichText({
  body,
  className,
}: {
  body: string;
  className?: string;
}) {
  // return <div dangerouslySetInnerHTML={{ __html: body }} />;

  let divClassName = "";
  // divClassName = cn(
  //   "page-content",
  //   "text-lg md:text-2xl text-foreground mb-4 font-light"
  // );
  divClassName = "page-content";
  divClassName = cn(divClassName, className);

  return (
    <div className={divClassName}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
