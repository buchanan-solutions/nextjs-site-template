"use client";

import type { Global, About, Menu } from "@/cms/types";
import DebuggableDiv from "@/components/debuggable/Div";
import { cn } from "@/utils";
import type { TemplatePageProps } from "@/cms/types/template-page-props";
import Link from "next/link";
import { usePage } from "@/cms/page-context";
export default function ArticlePage({ locale, globalData, page, collectionItem }: TemplatePageProps) {

  const { debug, setDebug } = usePage();

  let className = "flex flex-col";
  className += " flex-1";
  className += " structure";
  // className += " overflow-y-auto";
  // className += " h-full";

  return (
    <DebuggableDiv 
      debug={debug} 
      id="article-page" 
      className={className}
      // className="flex flex-col h-full"
    >
      <DebuggableDiv 
        debug={debug} 
        id="article-page-content" 
        className={cn("flex flex-col")}
      >
        <h1>{collectionItem?.title}</h1>
        <p>Page Data: </p>
        <pre>
          <code>
            {page ? JSON.stringify(page, null, 2) : "No page data"}
          </code>
        </pre>
        <p>Articles Data: </p>
        <pre>
          <code>
            {collectionItem ? JSON.stringify(collectionItem, null, 2) : "No article data"}
          </code>
        </pre>

      </DebuggableDiv>
    </DebuggableDiv>
  );
}