const OPENROUTER_IMAGE_URL = "https://openrouter.ai/api/v1/images";
const OPENROUTER_IMAGE_MODEL = "google/gemini-3.1-flash-image-preview";

type GeneratedThumbnail = {
  image: string;
  costUsd?: number;
};

export async function generateThumbnailImage(
  prompt: string,
  inputReference?: string,
): Promise<GeneratedThumbnail> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch(OPENROUTER_IMAGE_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://xfontat.com",
      "X-Title": "xfontat Thumbnail Studio",
    },
    body: JSON.stringify({
      model: OPENROUTER_IMAGE_MODEL,
      prompt,
      n: 1,
      resolution: "1K",
      aspect_ratio: "16:9",
      ...(inputReference
        ? {
            input_references: [
              {
                type: "image_url",
                image_url: { url: inputReference },
              },
            ],
          }
        : {}),
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter image generation failed (${response.status}): ${errorText.slice(0, 240)}`,
    );
  }

  const data = (await response.json()) as {
    data?: Array<{
      b64_json?: string;
      url?: string;
    }>;
    usage?: {
      cost?: number;
    };
  };
  const image = data.data?.[0];
  const costUsd =
    typeof data.usage?.cost === "number" ? data.usage.cost : undefined;

  if (image?.b64_json) {
    return {
      image: `data:image/png;base64,${image.b64_json}`,
      costUsd,
    };
  }

  if (image?.url) {
    return { image: image.url, costUsd };
  }

  throw new Error("OpenRouter returned no image data");
}