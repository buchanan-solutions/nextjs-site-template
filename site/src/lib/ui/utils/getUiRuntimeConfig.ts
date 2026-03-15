// ./src/lib/ui/utils/getUIMode.ts

export interface UiRuntimeContract {
  nodeEnv: "development" | "production" | "test";
  uiRef: string;
  uiCommit: string;
}

export async function getUiRuntimeConfig(): Promise<UiRuntimeContract> {
  const nodeEnv = process.env.NODE_ENV;
  const devOverride = process.env.NEXT_PUBLIC_UI_NODE_ENV_OVERRIDE;
  const uiRef = process.env.UI_REF || "undefined";
  const uiCommit = process.env.UI_COMMIT || "undefined";

  const normalizedEnv: UiRuntimeContract["nodeEnv"] =
    nodeEnv === "production" || nodeEnv === "test"
      ? nodeEnv
      : "development";

  let effectiveEnv: UiRuntimeContract["nodeEnv"] = normalizedEnv;

  // Only allow overrides when not in production
  if (normalizedEnv !== "production") {
    if (
      devOverride === "development" ||
      devOverride === "production" ||
      devOverride === "test"
    ) {
      effectiveEnv = devOverride;
    }
  }

  return { 
    nodeEnv: effectiveEnv, 
    uiRef, 
    uiCommit,
  };
}