import "server-only";

import {
  createLoggerFactory,
  createConsoleTransport,
  Config,
} from "@buchanan-solutions/ts-logkit";

import { customFormatter } from "../customFormatter";

import registry, { bootstrapPromise } from "./registry";

const factoryLoggerConfig: Config = {
  id: "ServerLoggerFactory",
  level: "error",
  transports: [createConsoleTransport()],
  formatter: customFormatter,
};

export const loggerFactory = createLoggerFactory({
  transports: [createConsoleTransport()],
  formatter: customFormatter,
  level: "error",
  registry,
  logConfig: factoryLoggerConfig,
});

/**
 * A helper to ensure the factory is ready.
 * Call this in your entry points (Middleware/Root Layout).
 */
export async function ensureServerLoggingReady() {
  await bootstrapPromise;
}
