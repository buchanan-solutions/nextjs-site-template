"use client";

// Third Party
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

// UI
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

import { cn } from "@/utils";

export const themeOptions = [
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
  { label: "System", value: "system" },
];

interface ThemeToggleProps {
  forceDark?: boolean;
}

const debug = false;

export function ThemeToggle({ forceDark = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <DropdownMenu
        modal={false}
        data-color-theme={forceDark ? theme : undefined}
      >
        <DropdownMenuTrigger
          asChild
          className={cn("text-foreground", forceDark && "dark")}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer hover:text-primary"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {themeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => setTheme(option.value)}
              className={cn(
                "rounded-sm cursor-pointer",
                theme === option.value && "bg-accent text-accent-foreground"
              )}
            >
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {debug && <p>Theme: {theme}</p>}
    </>
  );
}
