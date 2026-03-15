// ./src/lib/logger/get_logger_factory.ts

import { isClient } from "@/utils/is-client";

/**
 * 
 * @deprecated (kindof) use the direct imports of loggerFactory instead
 * ```tsx
 * import { loggerFactory } from "@/lib/logger/server/factory";
 * or
 * ```
 * ```tsx
 * import { loggerFactory } from "@/lib/logger/client/factory";
 * ```
 */
export async function getLoggerFactory() {
  if (!isClient()) {
    const { loggerFactory, ensureServerLoggingReady } = await import(
      "@/lib/logger/server/factory",
    );

    // This is the key: wait for the FileSystemStore to finish reading
    await ensureServerLoggingReady();

    return loggerFactory;
  } else {
    console.log("(getLoggerFactory) on client ");
    const { loggerFactory } = await import("@/lib/logger/client/factory");
    return loggerFactory;
  }
}
