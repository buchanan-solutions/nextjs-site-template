// ./src/lib/logger/client/factory.ts
"use client";

import {
  createLoggerFactory,
  createConsoleTransport,
  NoopLogger,
  ConfigOverride,
} from "@buchanan-solutions/ts-logkit";

import { isClient } from "@/utils/is-client";

import { customFormatter } from "../customFormatter";

import { clientFactoryLoggerConfig } from "./loggingConfig";
import registry from "./registry";

// Create a wrapper for NoopLoggerFactory to ensure it has createLogger method
// This is needed because NoopLoggerFactory may not have createLogger when running on server
const createNoopLoggerFactory = () => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createLogger: (_id: string, _runtimeDefaults?: ConfigOverride) =>
      NoopLogger,
  };
};

export const loggerFactory = isClient()
  ? createLoggerFactory({
    level: "debug",
    transports: [createConsoleTransport()],
    formatter: customFormatter,
    registry,
    logConfig: clientFactoryLoggerConfig,
  })
  : createNoopLoggerFactory();
