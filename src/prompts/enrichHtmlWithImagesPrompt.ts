export const ENRICH_HTML_WITH_IMAGES_PROMPT = `[Insert Graphics with Contextually Relevant Alt Text and Captions in Polish]

<prompt_objective>
Augment existing HTML content by identifying suitable locations for additional graphics, inserting detailed alt attributes and concise figcaptions that are contextually relevant to each section, in Polish, while preserving the original HTML content.
</prompt_objective>

<prompt_rules>
- UNDER NO CIRCUMSTANCES should the existing HTML content, including text and tags, be removed, modified, or corrected. Preserve all original content exactly as provided.
- Identify locations within the original HTML where additional graphics can enhance understanding, without altering the current content.
- For each identified location, add a <figure> element with:
  - <img src="image_placeholder.jpg" alt="[Detailed, section-specific description intended to guide precise image generation]" in Polish/>
  - <figcaption>[Provide a concise caption that relates to the alt text and reflects the section’s key themes, ensuring relevance and coherence in Polish]</figcaption>
- Provide the output as raw HTML content without additional formatting such as markdown or code block wrappers.
- Alt attributes must convey comprehensive insights into the section's nuances, tailored to serve as detailed prompts for image generation.
- Figcaptions should be succinct but must directly reference both the alt text and section context, enhancing understanding without being verbose.
- Avoid alteration or removal of existing HTML tags and text. Simply insert additional figures where necessary.
- Do not generate new tags like <html>, <head>, or <body>. Focus solely on augmenting the existing structure.
- Ensure both alt text and figcaptions maintain strict alignment with their respective sections, enhancing comprehension while strictly preserving all original content.
</prompt_rules>

<prompt_examples>
USER: HTML article about artificial intelligence advances
AI: Adds figures like <figure><img src="image_placeholder.jpg" alt="Szczegółowy opis zastosowania AI w codziennych urządzeniach, takich jak asystenci głosowi i systemy rekomendacyjne"/><figcaption>Ilustracja asystenta głosowego i systemów rekomendacyjnych związanych z AI</figcaption></figure>, ensuring the figcaption links to both the alt text and section content.

USER: HTML with detailed analysis
AI: Inserts figures at necessary sections, ensuring alt text that fully explores the section's themes for graphic generation, with figcaptions that succinctly relate to both the alt text and the section content.

USER: HTML with existing images
AI: Augments only where new graphics add value, preserving existing images and captions, while new alt text provides detailed context, and figcaptions remain succinct and contextually linked.

USER: Narrative-focused article
AI: Adds brief figcaptions that align with narrative sections and the detailed alt text, keeping them relevant, while the alt text provides comprehensive prompts for images.

USER: Basic document that doesn't require imagery
AI: Returns the original HTML unchanged if no suitable augmentation points are identified, maintaining full integrity of the document.
</prompt_examples>`;
