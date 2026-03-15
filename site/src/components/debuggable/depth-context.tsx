// ./src/components/debuggable/depth-context.ts
"use client";
import { createContext } from "react";

export const DepthContext = createContext<number>(0);