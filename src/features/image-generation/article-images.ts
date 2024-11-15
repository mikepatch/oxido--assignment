import { APP_CONFIG } from "../../../config";
import {
  extractImagePrompts,
  replaceImagePlaceholders,
} from "./html-processor";
import { ImageGenerationService } from "../../services/ImageGenerationService";
import { Result } from "../../shared/types";
import { FileService } from "../../services/FileService";

// Generuje obrazy na podstawie podanych promptów i zwraca ich ścieżki
const generateImages = async (
  imagePrompts: Array<{ alt: string; index: number }>
): Promise<Result<string[]>> => {
  console.log("Generuję obrazy...");

  const imageService = new ImageGenerationService(
    APP_CONFIG.articleWithGeneratedImages
  );

  const results = await Promise.all(
    imagePrompts.map(({ alt, index }) =>
      imageService.generateAndSaveImage(alt, index)
    )
  );

  //Filtruje wyniki, żeby zostawić tylko te z danymi,
  // a następnie wyciąga z nich ścieżki do obrazków.
  const validPaths = results
    .filter(
      (result): result is Result<string> & { data: string } =>
        result.data !== undefined
    )
    .map((result) => result.data);

  console.log(
    `Pomyślnie wygenerowałem ${validPaths.length}/${imagePrompts.length} obrazów`
  );

  return validPaths.length === 0
    ? { error: "Nie udało się wygenerować żadnego obrazu" }
    : { data: validPaths };
};

export const generateImagesForArticle = async (
  htmlContent: string
): Promise<Result<string>> => {
  const fileService = new FileService();
  const dirResult = await fileService.ensureDirectory(
    APP_CONFIG.articleWithGeneratedImages.imageOutputPath
  );
  if (dirResult.error) {
    return { error: dirResult.error };
  }

  const imagePrompts = extractImagePrompts(htmlContent);
  console.log(
    `Znalazłem ${imagePrompts.length} promptów do wygenerowania obrazów`
  );

  const generatedImagesResult = await generateImages(imagePrompts);
  if (generatedImagesResult.error || !generatedImagesResult.data) {
    return {
      error: generatedImagesResult.error || "Brak wygenerowanych obrazów",
    };
  }

  const processedHtml = replaceImagePlaceholders(
    htmlContent,
    generatedImagesResult.data
  );

  return { data: processedHtml };
};
