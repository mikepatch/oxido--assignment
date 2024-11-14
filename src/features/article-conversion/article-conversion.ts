import { Result } from "../../shared/types";
import { OpenAIService } from "../../services/OpenAIService";
import { CONVERT_TO_HTML_PROMPT } from "../../prompts/convertToHtmlPrompt";
import { ENRICH_HTML_WITH_IMAGES_PROMPT } from "../../prompts/enrichHtmlWithImagesPrompt";

const openai = new OpenAIService();

type OperationConfig = {
  prompt: string;
  operation: string;
};

const processWithOpenAI = async (
  content: string,
  { prompt, operation }: OperationConfig
): Promise<Result<string>> => {
  console.log(`${operation}...`);

  const completion = await openai.completion({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: content },
    ],
  });
  if (completion.error) return { error: completion.error };

  const result = completion.data?.choices[0].message.content;
  if (!result) return { error: "Nie otrzymano treści z OpenAI" };

  return { data: result };
};

export const convertArticleToHtml = async (
  rawArticle: string
): Promise<Result<string>> => {
  const result = await processWithOpenAI(rawArticle, {
    prompt: CONVERT_TO_HTML_PROMPT,
    operation: "Konwertuję tekst na HTML",
  });

  return result;
};

export const enrichHtmlWithImagePlaceholders = async (
  html: string
): Promise<Result<string>> => {
  const result = await processWithOpenAI(html, {
    prompt: ENRICH_HTML_WITH_IMAGES_PROMPT,
    operation: "Wzbogacam HTML o znaczniki obrazów",
  });

  return result;
};
