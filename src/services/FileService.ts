import fs from "fs";
import { Result } from "../shared/types";

type FileOperation<T> = () => T;

export class FileService {
  read(path: string): Result<string> {
    return this.handleOperation(
      () => fs.readFileSync(path, "utf-8"),
      "Błąd odczytu pliku"
    );
  }

  write(path: string, content: string): Result<void> {
    console.info(`Zapisuję plik: ${path}`);
    return this.handleOperation(() => {
      const dir = path.substring(0, path.lastIndexOf("/"));

      if (dir) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(path, content, "utf-8");
    }, "Błąd zapisu pliku");
  }

  writeImage(path: string, content: Buffer): Result<void> {
    console.info(`Zapisuję obraz: ${path}`);
    return this.handleOperation(() => {
      const dir = path.substring(0, path.lastIndexOf("/"));

      if (dir) fs.mkdirSync(dir, { recursive: true });

      fs.writeFileSync(path, content);
    }, "Błąd zapisu obrazu");
  }

  private handleOperation<T>(
    operation: FileOperation<T>,
    errorPrefix: string
  ): Result<T> {
    try {
      const result = operation();

      return { data: result };
    } catch (error) {
      return {
        error: `${errorPrefix}: ${
          error instanceof Error ? error.message : "FileService: Nieznany błąd"
        }`,
      };
    }
  }
}
