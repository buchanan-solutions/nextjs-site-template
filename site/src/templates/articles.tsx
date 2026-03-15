"use client";

import type { Global, About, Menu } from "@/cms/types";
import DebuggableDiv from "@/components/debuggable/Div";
import { cn } from "@/utils";
import type { TemplatePageProps } from "@/cms/types/template-page-props";
import Link from "next/link";
import { usePage } from "@/cms/page-context";

const debug = false;

export default function ArticlesPage({ locale, globalData, page, collectionItems }: TemplatePageProps) {

  let className = "flex flex-col";
  className += " flex-1";
  // className += " overflow-y-auto";
  // className += " h-full";

  const { debug, setDebug } = usePage();

  return (
    <DebuggableDiv 
      debug={debug} 
      id={page.slug} 
      className={className}
      // className="flex flex-col h-full"
    >
      <DebuggableDiv 
        debug={debug} 
        id={page.slug + "-content"} 
        className={cn("flex flex-col")}
      >
        <h1>{page.title}</h1>

        <p>Locale: {locale}</p>
        <p>Global Data: </p>
        <pre>
          <code>
            {globalData ? JSON.stringify(globalData, null, 2) : "No global data"}
          </code>
        </pre>
        <p>About Data: </p>
        {collectionItems?.map((item) => (
          <Link key={item.id} href={page.slug + "/" + item.slug}>
            <p>{item.title}</p>
          </Link>
        ))}

      </DebuggableDiv>
    </DebuggableDiv>
  );
}