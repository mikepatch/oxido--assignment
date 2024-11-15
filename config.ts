import { AppConfig } from "./src/shared/types";

// *Ustawienie "enableBonusGeneratedImages = true" zwiększy koszt ze względu na wykorzystanie modelu do generowania obrazów (0.18$ - 0.23$ przy 4-5 obrazkach)
export const APP_CONFIG: AppConfig = {
  enableBonusGeneratedImages: false, // *UWAGA! true = wyższy koszt
  articleToHtml: {
    inputRawTextPath: "src/example_raw_article.txt",
    htmlOutputPath: "src/solution/artykul.html",
    completionModel: "gpt-4o",
  },
  articleWithGeneratedImages: {
    imageOutputPath: "src/bonus-generating-images/images",
    htmlOutputPath: "src/bonus-generating-images/artykul.html",
    imageModel: "dall-e-3",
    imageSize: "1792x1024",
    imagePrefix: "image",
    imageExtension: "webp",
    imageAltWithPromptRegex: /<img[^>]*alt="([^"]*)"[^>]*>/g,
  },
} as const;
