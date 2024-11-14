import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { Result } from "../shared/types";

type CompletionConfig = {
  messages: ChatCompletionMessageParam[];
  model?: OpenAI.ChatModel;
};

type ImageConfig = {
  prompt: string;
  model?: OpenAI.ImageModel;
  size?: OpenAI.ImageEditParams["size"] | "1792x1024";
};

type RetryConfig = {
  maxAttempts: number;
  delayMs: number;
  backoffFactor: number;
};

type RetryOptions = Partial<RetryConfig>;

export class OpenAIService {
  private openai: OpenAI;
  private defaultRetryConfig: RetryConfig = {
    maxAttempts: 3,
    delayMs: 1000,
    backoffFactor: 2,
  };

  constructor() {
    this.openai = new OpenAI();
  }

  async completion({
    messages,
    model = "gpt-4o",
  }: CompletionConfig): Promise<
    Result<OpenAI.Chat.Completions.ChatCompletion>
  > {
    return this.handleRequest(
      () =>
        this.withRetry(() =>
          this.openai.chat.completions.create({
            messages,
            model,
            response_format: { type: "text" },
          })
        ),
      "Błąd podczas generowania odpowiedzi OpenAI"
    );
  }

  async imageGeneration({
    prompt,
    model = "dall-e-3",
    size = "1024x1024",
  }: ImageConfig): Promise<Result<OpenAI.Images.ImagesResponse>> {
    return this.handleRequest(
      () =>
        this.withRetry(() =>
          this.openai.images.generate({
            model,
            prompt,
            n: 1,
            size,
          })
        ),
      "Błąd podczas generowania obrazu"
    );
  }

  private async handleRequest<T>(
    request: () => Promise<T>,
    errorPrefix: string
  ): Promise<Result<T>> {
    try {
      const result = await request();
      return { data: result };
    } catch (error) {
      return {
        error: `${errorPrefix}: ${
          error instanceof Error
            ? error.message
            : "OpenAIService: Nieznany błąd"
        }`,
      };
    }
  }

  private async withRetry<T>(
    operation: () => Promise<T>,
    options: RetryOptions = {}
  ): Promise<T> {
    const config = { ...this.defaultRetryConfig, ...options };
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (error instanceof OpenAI.APIError) {
          if (
            error.status === 429 &&
            !error.message.includes("exceeded your current quota")
          ) {
            const delay =
              config.delayMs * Math.pow(config.backoffFactor, attempt - 1);
            console.warn(
              `Przekroczono limit zapytań, oczekiwanie ${delay}ms przed ponowną próbą ${attempt}/${config.maxAttempts}`
            );
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }
        }
        throw error;
      }
    }

    throw lastError || new Error("Osiągnięto maksymalną liczbę prób");
  }
}
