import { APP_CONFIG } from "../../../config";

export const extractImagePrompts = (
  html: string
): Array<{ alt: string; index: number }> => {
  const imgRegex =
    APP_CONFIG.articleWithGeneratedImages.imageAltWithPromptRegex;
  const prompts: Array<{ alt: string; index: number }> = [];
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = imgRegex.exec(html)) !== null) {
    prompts.push({ alt: match[1], index });
    index++;
  }

  return prompts;
};

export const replaceImagePlaceholders = (
  html: string,
  imagePaths: string[]
): string => {
  let updatedHtml = html;

  imagePaths.forEach((path) => {
    updatedHtml = updatedHtml.replace(
      /src="image_placeholder.jpg"/i,
      `src="./images/${path}"`
    );
  });

  return updatedHtml;
};
