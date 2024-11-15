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
  private imageRateLimit = {
    maxRequests: 5,
    windowMs: 60000,
  };
  private requestTimestamps: number[] = [];
  private defaultRetryConfig: RetryConfig = {
    maxAttempts: 5,
    delayMs: 2000,
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
    await this.ensureRateLimit();

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

  /**
   * OpenAI API ma limity na liczbę reqestów do generowania obrazków,
   * dlatego dodałem poniższy mechanizm, żeby zapewnić,
   * generowanie obrazków dla dłuższych artykułów.
   */
  private async ensureRateLimit() {
    const now = Date.now();
    this.requestTimestamps = this.requestTimestamps.filter(
      (timestamp) => now - timestamp < this.imageRateLimit.windowMs
    );

    if (this.requestTimestamps.length >= this.imageRateLimit.maxRequests) {
      const oldestRequest = this.requestTimestamps[0];
      const waitTime = this.imageRateLimit.windowMs - (now - oldestRequest);

      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }

    this.requestTimestamps.push(now);
  }
  /**
   * Ta logika jest przydatna kiedy dostaniemy error od OpenAI,
   * dzięki mechanizmowi retry możemy ponowić zapytanie (z informacją),
   * a po osiągnięciu limitu liczby zapytań rzucamy błędem.
   */
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

        if (this.isRetryableError(error) && attempt < config.maxAttempts) {
          const delay =
            config.delayMs * Math.pow(config.backoffFactor, attempt - 1);

          console.log(
            `Błąd API OpenAI (próba ${attempt}/${config.maxAttempts}): ${lastError.message}. Ponowna próba za ${delay}ms`
          );

          await new Promise((resolve) => setTimeout(resolve, delay));

          continue;
        }
        throw error;
      }
    }
    throw lastError || new Error("Osiągnięto maksymalną liczbę prób");
  }

  private isRetryableError(error: unknown): boolean {
    if (!(error instanceof OpenAI.APIError)) {
      return true;
    }

    const status = error.status || 0;

    if (status === 429) {
      return true;
    }

    return ![400, 401].includes(status);
  }
}
