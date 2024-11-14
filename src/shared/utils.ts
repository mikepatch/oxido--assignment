import fs from "fs/promises";
import { Result } from "./types";

export const handleError = (error: unknown): never => {
  console.error(error);
  process.exit(1);
};

export const unwrap = <T>(
  result: { data?: T; error?: string },
  context?: string
): T => {
  if ("error" in result && result.error) {
    throw new Error(
      `Operacja nie powiodła się ${context ? ` w ${context}` : ""}: ${
        result.error
      }`
    );
  }

  return result.data as T;
};
