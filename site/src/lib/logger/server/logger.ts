import { LoggerLike } from "@buchanan-solutions/ts-logkit";

import { getLoggerFactory } from "../get_logger_factory";

declare global {
  var __serverLoggerPromise: Promise<LoggerLike> | undefined;
}
  
function getLogger() {
  if (!globalThis.__serverLoggerPromise) {
    globalThis.__serverLoggerPromise =
      getLoggerFactory()
        .then(f => f.createLogger("app", { level: "debug" }));
  }
  
  return globalThis.__serverLoggerPromise;
}
  
export function serverLogger() {
  return getLogger();
}

// function getLogger() {
//   if (!logPromise) {
//     logPromise = getLoggerFactory().then((loggerFactory) => loggerFactory.createLogger("app"));
//   }
//   return logPromise;
// }

// export function serverLogger() {
//   return getLogger();
// }

// ⭐ Even better (production-grade variant)

// This adds:

// global dedupe across hot reloads

// prevents logger duplication in dev

// import { LoggerLike } from "@buchanan-solutions/ts-logkit";
// import { getLoggerFactory } from "../get_logger_factory";

// declare global {
//   var __appLoggerPromise: Promise<LoggerLike> | undefined;
// }

// function getLogger(): Promise<LoggerLike> {
//   if (!globalThis.__appLoggerPromise) {
//     globalThis.__appLoggerPromise =
//       getLoggerFactory()
//         .then(factory => factory.createLogger("app"));
//   }

//   return globalThis.__appLoggerPromise;
// }

// export function serverLogger() {
//   return getLogger();
// }