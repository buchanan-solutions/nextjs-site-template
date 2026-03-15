// ./src/lib/logger/client/registry.ts
"use client";

import { Registry } from "@buchanan-solutions/ts-logkit";

import { isClient } from "@/utils/is-client";

import { clientRegistryLoggerConfig } from "./loggingConfig";
import { zustandLoggerStore } from "./store";

const registry = new Registry(clientRegistryLoggerConfig);

// We fire-and-forget the bootstrap.
// Because it's an async process, loggers created in the first few milliseconds
// will use defaults, then "snap" to stored values once bootstrap completes.

if (isClient()) {
  registry.bootstrap(zustandLoggerStore).catch((err) => {
    console.error("Failed to bootstrap logger registry:", err);
  });
}

export default registry;
