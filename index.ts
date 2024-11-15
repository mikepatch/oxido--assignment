import "dotenv/config";
import { processArticleWithGeneratedImages } from "./src/bonus-generating-images/bonus-image-generation";
import {
  convertArticleToHtml,
  enrichHtmlWithImagePlaceholders,
} from "./src/features/article-conversion/article-conversion";
import { handleError, unwrap } from "./src/shared/utils";
import { FileService } from "./src/services/FileService";
import { APP_CONFIG } from "./config";

const {
  enableBonusGeneratedImages,
  articleToHtml,
  articleWithGeneratedImages,
} = APP_CONFIG;

const processArticle = async (): Promise<void> => {
  const fileService = new FileService();
  const rawArticle = unwrap(fileService.read(articleToHtml.inputRawTextPath));
  const convertedHtml = unwrap(await convertArticleToHtml(rawArticle));
  const htmlWithImagePlaceholders = unwrap(
    await enrichHtmlWithImagePlaceholders(convertedHtml)
  );

  if (!enableBonusGeneratedImages) {
    unwrap(
      fileService.writeFile(
        articleToHtml.htmlOutputPath,
        htmlWithImagePlaceholders
      )
    );
  } else {
    unwrap(await processArticleWithGeneratedImages(htmlWithImagePlaceholders));
  }
};

const main = async (): Promise<void> => {
  const outputDir = enableBonusGeneratedImages
    ? articleWithGeneratedImages.htmlOutputPath
    : articleToHtml.htmlOutputPath;

  await processArticle();

  console.log("\nProces zakończony pomyślnie!");
  console.log(`Rezultat znajdziesz w ${outputDir}`);
};

main().catch(handleError);
