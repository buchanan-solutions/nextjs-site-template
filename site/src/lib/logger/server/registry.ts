// ./src/lib/logger/server/registry.ts
import "server-only";

// import path from "path";

import { InMemoryStore, Registry } from "@buchanan-solutions/ts-logkit";

import { serverRegistryLoggerConfig } from "./loggingConfig";

const registry = new Registry(serverRegistryLoggerConfig);

// const store = new FileSystemStore({ filePath: path.join(process.cwd(), "data/loggers.json") });
const store = new InMemoryStore();

// Capture the bootstrap promise
export const bootstrapPromise = registry
  .bootstrap(store)
  .then()
  .catch((err) => {
    console.error("❌ Server Logger Registry bootstrap: failed", err);
  });

export default registry;
