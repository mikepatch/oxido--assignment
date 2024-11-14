import fs from "fs";
import { Result } from "types";

export class FileService {
  read(path: string): Result<string> {
    try {
      const content = fs.readFileSync(path, "utf-8");
      return { data: content };
    } catch (error) {
      return {
        error: `Error reading file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  write(path: string, content: string): Result<void> {
    try {
      fs.writeFileSync(path, content);
      return { data: undefined };
    } catch (error) {
      return {
        error: `Error writing file: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }
}
