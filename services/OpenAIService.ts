import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";

type CompletionConfig = {
  messages: ChatCompletionMessageParam[];
  model?: OpenAI.ChatModel;
  responseFormat?:
    | OpenAI.ResponseFormatText["type"]
    | OpenAI.ResponseFormatJSONObject["type"];
};

export class OpenAIService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI();
  }

  async completion(
    config: CompletionConfig
  ): Promise<OpenAI.Chat.Completions.ChatCompletion> {
    const { messages, model = "gpt-4o", responseFormat = "text" } = config;

    try {
      const chatCompletion = await this.openai.chat.completions.create({
        messages,
        model,
        response_format: { type: responseFormat },
      });

      return chatCompletion as OpenAI.Chat.Completions.ChatCompletion;
    } catch (error) {
      console.error("Error in OpenAI completion: ", error);
      throw error;
    }
  }
}
