// ./src/lib/cms/utils/load-dictionary.ts

import "server-only";
import { Dictionary } from "@/dictionaries/types";
import { Result } from "@/types/result";

export async function loadDictionary(
  locale: string,
): Promise<Result<Dictionary>> {
  try {
    const dictionaryModule = await import(`@/dictionaries/${locale}.json`);

    return {
      success: true,
      data: dictionaryModule.default as Dictionary,
    };
  } catch (error) {
    console.error(`Error loading dictionary for ${locale}:`, error);

    return {
      success: false,
      error: `Failed to load dictionary for locale: ${locale}`,
    };
  }
}