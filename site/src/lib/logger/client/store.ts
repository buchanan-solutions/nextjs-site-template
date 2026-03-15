// ./src/lib/logger/client/store.ts
"use client";

import {
  LoggerStoreConfig,
  SystemConfig,
  Store,
} from "@buchanan-solutions/ts-logkit";
import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";

// Step 1: Create a Zustand store for logger configs
type LoggerZustandState = {
  configs: Record<string, LoggerStoreConfig>;
  setConfig: (cfg: LoggerStoreConfig) => void;
  setConfigs: (cfgs: SystemConfig) => void;
};

const useLoggerStore = create<LoggerZustandState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        configs: {},
        setConfig: (cfg) => {
          set((state) => ({
            configs: { ...state.configs, [cfg.id]: cfg },
          }));
        },
        setConfigs: (cfgs) => {
          const newConfigs: Record<string, LoggerStoreConfig> = {};
          for (const cfg of cfgs) {
            newConfigs[cfg.id] = cfg;
          }
          set({ configs: newConfigs });
        },
      }),
      {
        name: "logger-store2",
        storage: createJSONStorage(() => localStorage),
        // Only persist the configs, not the functions
        partialize: (state) => ({
          configs: state.configs,
        }),
      }
    )
  )
);

// Step 2: Create a Registry-compatible wrapper
export const zustandLoggerStore: Store = {
  list: async () => {
    return Object.values(useLoggerStore.getState().configs);
  },
  get: async (id) => {
    const cfg = useLoggerStore.getState().configs[id];
    if (!cfg) throw new Error(`Logger ${id} not found`);
    return cfg;
  },
  set: async (cfg) => {
    useLoggerStore.getState().setConfig(cfg);
  },
  setAll: async (cfgs) => {
    useLoggerStore.getState().setConfigs(cfgs);
  },
  subscribeAll: (callback) => {
    return useLoggerStore.subscribe(
      (state) => state.configs,
      (configs, prevConfigs) => {
        Object.values(configs).forEach((cfg) => {
          // Only notify the registry if the config is new or the level changed
          if (cfg.level !== prevConfigs[cfg.id]?.level) {
            callback(cfg);
          }
        });
      }
    );
  },
};

// Export the hook for components that need to access the store
export { useLoggerStore };
