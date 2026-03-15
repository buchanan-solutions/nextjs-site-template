// ./src/utils/utils.ts

// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// export function cn(...inputs: ClassValue[]) {
//   return twMerge(clsx(inputs));
// }

/**
 * Checks if the code is running in a browser environment.
 *
 * @returns {boolean} True if running in a browser, false otherwise.
 */
export const isClient = (): boolean =>
  typeof window !== "undefined" && typeof document !== "undefined";
