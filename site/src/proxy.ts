// ./src/middleware.ts

import { NextRequest } from "next/server";

import { loggerFactory } from "@/lib/logger/server/factory";
import { handleLang } from "@/middleware/handleLang";

const log = loggerFactory.createLogger("proxy", { level: "debug" });

export async function proxy(request: NextRequest) {
  log.info(`Handling request: ${request.nextUrl.pathname}`);

  const langResponse = await handleLang(request, log);
  if (langResponse) return langResponse;

  log.info(`Middleware completed`);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    "/((?!_next|api|favicon.ico).*)",
  ],
};
