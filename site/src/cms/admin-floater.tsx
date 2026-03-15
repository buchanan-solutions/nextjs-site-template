"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { usePage } from "./page-context";
import { useCMS } from "@/providers/cms-provider";

export default function AdminFloater() {
  const { debug, setDebug } = usePage();
  const { debugHeader, setDebugHeader, debugFooter, setDebugFooter } = useCMS();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="fixed bottom-4 right-4 z-9999 bg-background cursor-pointer rounded-full h-12 w-12 shadow-[0_4px_14px_0_rgba(0,0,0,0.15)]"
          aria-label="Admin panel"
        >
          <MoreVertical className="!size-6 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="top" align="end">
        <DropdownMenuItem onSelect={() => setDebug(!debug)}>
          Debug Current Page {debug ? "On" : "Off"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setDebugHeader(!debugHeader)}>
          Debug Header {debugHeader ? "On" : "Off"}
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setDebugFooter(!debugFooter)}>
          Debug Footer {debugFooter ? "On" : "Off"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}