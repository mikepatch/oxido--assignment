import "dotenv/config";
import { OpenAIService } from "./services/OpenAIService";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { CONVERT_TO_HTML, ENRICH_HTML_WITH_IMAGES } from "./prompts/prompts";
import { Result } from "types";
import { FileService } from "./services/FileService";

const openai = new OpenAIService();
const file = new FileService();

const convertArticleToHtml = async (
  rawArticle: string
): Promise<Result<string>> => {
  try {
    console.log("Converting text into HTML...");
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: CONVERT_TO_HTML },
      { role: "user", content: rawArticle },
    ];

    const modelResponse = await openai.completion({ messages });
    const convertedArticle = modelResponse.choices[0].message.content;

    if (!convertedArticle) {
      return { error: "No content received from OpenAI" };
    }

    console.log("Text converted successfully.");
    return { data: convertedArticle };
  } catch (error) {
    return {
      error: `Error while converting article: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

const enrichHtmlWithImages = async (html: string): Promise<Result<string>> => {
  try {
    console.log("Enriching HTML with images...");
    const messages: ChatCompletionMessageParam[] = [
      { role: "system", content: ENRICH_HTML_WITH_IMAGES },
      { role: "user", content: html },
    ];

    const modelResponse = await openai.completion({ messages });
    const enrichedHtml = modelResponse.choices[0].message.content;

    if (!enrichedHtml) {
      return { error: "No content received from OpenAI" };
    }

    console.log("HTML enriched successfully.");
    return { data: enrichedHtml };
  } catch (error) {
    return {
      error: `Error while enriching HTML: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
};

const main = async (): Promise<void> => {
  const rawArticle = file.read("src/example_raw_article.txt");
  if (!rawArticle.data) {
    console.error(rawArticle.error);
    return;
  }

  const convertedHtml = await convertArticleToHtml(rawArticle.data);
  if (!convertedHtml.data) {
    console.error(convertedHtml.error);
    return;
  }

  const htmlWithImages = await enrichHtmlWithImages(convertedHtml.data);
  if (!htmlWithImages.data) {
    console.error(htmlWithImages.error);
    return;
  }

  const writeResult = file.write("src/artykul.html", htmlWithImages.data);
  if (writeResult.error) {
    console.error(writeResult.error);
    return;
  }

  console.log("Process completed successfully!");
};

main().catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});
