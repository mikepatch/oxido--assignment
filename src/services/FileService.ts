import fs from "fs";
import { Result } from "../shared/types";

type FileOperation<T> = () => T;

type AsyncFileOperation<T> = () => Promise<T>;

export class FileService {
  read(path: string): Result<string> {
    return this.handleOperation(
      () => fs.readFileSync(path, "utf-8"),
      "Błąd odczytu pliku"
    );
  }

  writeFile(path: string, content: string): Result<void> {
    return this.writeToFileSystem(path, content, "utf-8");
  }

  writeImage(path: string, content: Buffer): Result<void> {
    return this.writeToFileSystem(path, content);
  }

  // Tworzy katalog w podanej ścieżce, usuwając istniejący katalog, jeśli istnieje
  async ensureDirectory(dirPath: string): Promise<Result<void>> {
    return this.handleAsyncOperation(async () => {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
      await fs.promises.mkdir(dirPath, { recursive: true });
    }, "Błąd tworzenia katalogu");
  }

  private writeToFileSystem(
    path: string,
    content: string | Buffer,
    encoding?: BufferEncoding
  ): Result<void> {
    console.info(`Zapisuję plik: ${path}`);
    return this.handleOperation(() => {
      const dir = path.substring(0, path.lastIndexOf("/"));
      if (dir) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path, content, encoding);
    }, "Błąd zapisu pliku");
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

  private async handleAsyncOperation<T>(
    operation: AsyncFileOperation<T>,
    errorPrefix: string
  ): Promise<Result<T>> {
    try {
      const result = await operation();
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
