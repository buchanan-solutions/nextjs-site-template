import { Page } from "../../types/page";
import { Badge } from "@/components/ui/badge";
import { Component } from "../../types/component";
import { format, parseISO } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export type HeaderPolicy = Component & {
  __component: "page.header-policy";
  body?: string;
};

interface HeaderPolicyProps {
  page: Page;
  body?: string;
}

export default function HeaderPolicy({ page, body }: HeaderPolicyProps) {
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {page?.title || "Privacy Policy"}
      </h1>
      <Badge variant="secondary" className="mb-6 text-md px-2 py-1">
        Last Updated: {format(parseISO(page.updatedAt), "MMMM dd, yyyy")}
      </Badge>
      <div className="text-xl text-slate-600 dark:text-slate-400 max-w-5xl mx-auto leading-relaxed">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
          {body}
        </ReactMarkdown>
      </div>
    </div>
  );
}
