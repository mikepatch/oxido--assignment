import OpenAI from "openai";

export type Result<T> = {
  data?: T;
  error?: string;
};

export type ConvertArticleToHtmlConfig = {
  inputRawTextPath: string;
  htmlOutputPath: string;
  completionModel: OpenAI.ChatModel;
};

export type ImageExtension = "webp" | "jpg" | "png";

export type ImageGenerationServiceConfig = {
  imagePrefix: string;
  imageOutputPath: string;
  imageExtension?: ImageExtension;
};

export type ConvertArticleWithGeneratedImagesConfig = {
  htmlOutputPath: string;
  imageModel: OpenAI.ImageModel;
  imageSize: OpenAI.ImageEditParams["size"] | "1792x1024";
  imageAltWithPromptRegex: RegExp;
} & ImageGenerationServiceConfig;

export type ImagePrompt = {
  alt: string;
  index: number;
};

export type AppConfig = {
  fullArticleWithGeneratedImages: boolean;
  articleToHtml: ConvertArticleToHtmlConfig;
  articleWithGeneratedImages: ConvertArticleWithGeneratedImagesConfig;
};
