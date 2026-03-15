import {
  createConsoleTransport,
  Config,
  devFormatter,
} from "@buchanan-solutions/ts-logkit";

/**
 * This is a bunch of logging configurations for loggers for
 * the various components of the logger system (so we can "log" the "logging system" itself)
 */

export const serverRegistryLoggerConfig: Config = {
  id: "ServerLoggerRegistry",
  level: "error",
  transports: [createConsoleTransport()],
  formatter: devFormatter,
};

export const serverStoreLoggerConfig: Config = {
  id: "ServerLoggerStore",
  level: "error",
  transports: [createConsoleTransport()],
  formatter: devFormatter,
};
