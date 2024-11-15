import { Result } from "../shared/types";
import { APP_CONFIG } from "../../config";
import { generateImagesForArticle } from "../features/image-generation/article-images";
import { FileService } from "../services/FileService";

export const processArticleWithGeneratedImages = async (
  htmlContent: string
): Promise<Result<string>> => {
  try {
    const fileService = new FileService();

    console.log(
      "BONUS PLUS – Tworzę pełny artykuł z wygenerowanymi obrazkami..."
    );

    const processedHtmlResult = await generateImagesForArticle(htmlContent);
    if (processedHtmlResult.error || !processedHtmlResult.data) {
      return { error: processedHtmlResult.error ?? "Brak wygenerowanego HTML" };
    }

    const writeResult = fileService.write(
      APP_CONFIG.articleWithGeneratedImages.htmlOutputPath,
      processedHtmlResult.data
    );

    if (writeResult.error) {
      return {
        error: `Nie udało się zapisać pliku HTML: ${writeResult.error}`,
      };
    }

    return { data: processedHtmlResult.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Nieznany błąd",
    };
  }
};
