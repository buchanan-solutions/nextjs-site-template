import {
  createConsoleTransport,
  Config,
  devFormatter,
} from "@buchanan-solutions/ts-logkit";

/**
 * This is a bunch of logging configurations for loggers for
 * the various components of the logger system (so we can "log" the "logging system" itself)
 */

export const clientRegistryLoggerConfig: Config = {
  id: "ClientLoggerRegistry",
  level: "error",
  transports: [createConsoleTransport()],
  formatter: devFormatter,
};

export const clientStoreLoggerConfig: Config = {
  id: "ClientLoggerStore",
  level: "error",
  transports: [createConsoleTransport()],
  formatter: devFormatter,
};

export const clientFactoryLoggerConfig: Config = {
  id: "ClientLoggerFactory",
  level: "error",
  transports: [createConsoleTransport()],
  formatter: devFormatter,
};
