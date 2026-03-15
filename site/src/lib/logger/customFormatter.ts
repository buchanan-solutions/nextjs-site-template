import { Event, Formatter, FormattedOutput } from "@buchanan-solutions/ts-logkit";
import { format } from "date-fns";

export const ANSI_COLORS = {
  trace: "\x1b[90m",
  debug: "\x1b[36m",
  info: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
  fatal: "\x1b[41m",
};

const RESET = "\x1b[0m";

export function formatCustom(event: Event): FormattedOutput {
  const color = ANSI_COLORS[event.level as keyof typeof ANSI_COLORS] as string;
  // const time = new Date(event.timestamp).toISOString();
  const levelLabel = ("[" + event.level.toUpperCase() + "]").padEnd(7);
  const timestamp = format(new Date(event.timestamp), "HH:mm:ss.SSS");

  const isClient = typeof window !== "undefined";

  const parts: unknown[] = [
    `${timestamp} ${color}${levelLabel}${RESET} ${isClient ? "~" : "-"} (${
      event.logger_id
    }) \t${event.message}`,
    ...(event.args ?? []),
    ...(event.error ? [event.error] : []),
  ];

  return parts as [string, ...unknown[]];
}

/**
 * Development formatter for Node.js environments
 * Uses ANSI color codes for terminal output
 */
export const customFormatter: Formatter = { format: formatCustom };
