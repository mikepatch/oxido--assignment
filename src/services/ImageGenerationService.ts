import { FileService } from "../services/FileService";
import { OpenAIService } from "../services/OpenAIService";
import { ImageGenerationServiceConfig, Result } from "../shared/types";

export class ImageGenerationService {
  private fileService = new FileService();
  private openAIService = new OpenAIService();

  constructor(private config: ImageGenerationServiceConfig) {}

  async generateAndSaveImage(
    prompt: string,
    index: number
  ): Promise<Result<string>> {
    const imageResult = await this.openAIService.imageGeneration({ prompt });
    if (!imageResult.data) {
      return {
        error: imageResult.error || "Brak danych wygenerowanego obrazu",
      };
    }

    const imageUrl = imageResult.data.data[0]?.url;
    if (!imageUrl) {
      return { error: "Nie otrzymano URL-a wygenerowanego obrazu" };
    }

    const result = this.downloadImage(imageUrl, index);

    return result;
  }

  // Pobiera i zapisuje obrazek w ścieżce podanej w APP_CONFIG
  private async downloadImage(
    imageUrl: string,
    index: number
  ): Promise<Result<string>> {
    const { imagePrefix, imageExtension, imageOutputPath } = this.config;
    const response = await fetch(imageUrl);

    if (!response.ok) {
      return { error: `Nie udało się pobrać obrazu: ${response.statusText}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const imageName = `${imagePrefix}-${index}.${imageExtension}`;
    const imagePath = `${imageOutputPath}/${imageName}`;

    const writeResult = this.fileService.writeImage(imagePath, buffer);
    if (writeResult.error) return { error: writeResult.error };

    return { data: imageName };
  }
}
