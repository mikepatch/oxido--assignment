import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

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

export type CompletionConfig = {
  messages: ChatCompletionMessageParam[];
  model?: OpenAI.ChatModel;
};

export type ImageConfig = {
  prompt: string;
  model?: OpenAI.ImageModel;
  size?: OpenAI.ImageEditParams["size"] | "1792x1024";
};

export type RetryConfig = {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
};

export type RetryOptions = Partial<RetryConfig>;
