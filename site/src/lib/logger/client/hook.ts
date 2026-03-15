// ./src/lib/logger/client/hook.ts
"use client";

import { useEffect, useMemo } from "react";

import {
  ConfigOverride,
  Level,
  Logger,
} from "@buchanan-solutions/ts-logkit";

import { loggerFactory } from "./factory";
import registry from "./registry";
import { useLoggerStore } from "./store";

/**
 * A hook that creates a logger instance using the logger factory.
 *
 * Features:
 * - Resolves logger config from store asynchronously
 * - Falls back to runtime defaults if no store config exists
 * - Registers logger with registry for live updates
 * - Unregisters logger on component unmount to prevent memory leaks
 *
 * @param loggerName - The name/id of the logger to create.
 * @param runtimeDefaults - Optional runtime defaults for the logger configuration (used if store config doesn't exist).
 * @returns A logger instance (may be null during initial async resolution).
 *
 * @example
 * ```tsx
 * const logger = useLogger("MyComponent", { level: "debug" });
 *
 * if (!logger) return <div>Loading...</div>;
 *
 * log.info("Component mounted");
 * ```
 */

// export function useLogger(
//   name: string,
//   defaults: ConfigOverride = { level: "info" }
// ) {
//   log.debug(`called for logger: "${name}"`, { defaults });

//   // 1. synchronous read from Zustand
//   const storedConfig = useLoggerStore.getState().configs[name];
//   const initialLevel = storedConfig?.level || defaults.level;
//   log.debug(`Store config lookup for "${name}"`, {
//     found: !!storedConfig,
//     storedLevel: storedConfig?.level,
//     initialLevel,
//   });

//   // 2. create logger with correct starting level
//   const logger = useMemo(() => {
//     log.info(`Creating logger: "${name}" with level: "${initialLevel}"`);
//     return loggerFactory.createLogger(name, {
//       ...defaults,
//       level: initialLevel,
//     });
//   }, [name, initialLevel, defaults]);

//   useEffect(() => {
//     log.debug(`Registering logger: "${name}" with registry`);
//     registry.register(logger);

//     // Ensure store has this logger config
//     const cfg = {
//       id: name,
//       level: logger.level,
//     };
//     useLoggerStore.getState().setConfig(cfg);
//     log.debug(`Wrote logger config to store for "${name}"`, {
//       level: cfg.level,
//     });

//     // 3. subscribe to store changes
//     log.debug(`Subscribing to store changes for logger: "${name}"`);
//     const unsub = useLoggerStore.subscribe(
//       (state) => state.configs[name],
//       (cfg) => {
//         if (cfg) {
//           log.debug(`Store config changed for "${name}"`, {
//             newLevel: cfg.level,
//             oldLevel: logger.level,
//           });
//           logger.setLevel(cfg.level as Level);
//           log.info(`Logger "${name}" level updated to: "${cfg.level}"`);
//         }
//       }
//     );

//     return () => {
//       log.debug(
//         `Cleaning up logger: "${name}" (unregistering and unsubscribing)`
//       );
//       registry.unregister(name);
//       unsub();
//     };
//   }, [logger, name]);

//   log.debug(`returning logger for: "${name}"`);
//   return logger;
// }

export function useLogger(name: string, defaults?: ConfigOverride) {
  /**
   * 1. Create logger ONCE
   *    - no store access
   *    - no effects
   */
  const logger = useMemo(() => {
    return loggerFactory.createLogger(name, { ...defaults });
    // IMPORTANT: defaults must be stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  /**
   * 2. After mount:
   *    - register logger
   *    - hydrate level from store
   *    - subscribe to changes
   */
  useEffect(() => {
    registry.register(logger as Logger);

    const store = useLoggerStore.getState();
    const storedCfg = store.configs[name];

    // hydrate logger from store (one-time)
    if (storedCfg?.level) {
      (logger as Logger).setLevel(storedCfg.level as Level);
    } else {
      // write defaults once if missing
      store.setConfig({
        id: name,
        level: (logger as Logger).level,
      });
    }

    // subscribe to future updates
    const unsub = useLoggerStore.subscribe(
      (s) => s.configs[name]?.level,
      (level) => {
        if (level) (logger as Logger).setLevel(level as Level);
      },
    );

    return () => {
      registry.unregister(name);
      unsub();
    };
  }, [logger, name]);

  return logger;
}
