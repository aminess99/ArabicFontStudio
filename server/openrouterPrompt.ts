const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL = "google/gemini-3.7-flash";

type PromptInput = {
  idea: string;
  styleLabel: string;
  styleDescription: string;
  basePrompt: string;
};

type RefinedPrompt = {
  prompt: string;
  creativeDirection?: string;
};

function parseModelJson(content: string): RefinedPrompt | null {
  const cleaned = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");

  try {
    const parsed = JSON.parse(cleaned);
    if (typeof parsed?.prompt !== "string" || !parsed.prompt.trim()) {
      return null;
    }
    return {
      prompt: parsed.prompt.trim(),
      creativeDirection:
        typeof parsed.creativeDirection === "string"
          ? parsed.creativeDirection.trim()
          : undefined,
    };
  } catch {
    const promptMatch = cleaned.match(/"prompt"\s*:\s*"([\s\S]*?)"\s*,?\s*["}]/i);
    if (promptMatch?.[1]) {
      return { prompt: promptMatch[1].replace(/\\"/g, '"').trim() };
    }

    const usableText = cleaned
      .replace(/^(?:prompt|professional prompt)\s*:\s*/i, "")
      .trim();

    return usableText.length >= 80 ? { prompt: usableText } : null;
  }
}

export async function refineThumbnailPrompt(
  input: PromptInput,
): Promise<RefinedPrompt> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://xfontat.com",
      "X-Title": "xfontat Thumbnail Studio",
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      temperature: 0.7,
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content: [
            "You are a senior YouTube thumbnail art director and image-prompt writer.",
            "Turn the creator's simple idea into one precise production-ready prompt for an image model.",
            "Return JSON only with exactly two keys: creativeDirection and prompt.",
            "The prompt must describe a 1280x720 thumbnail background, subject hierarchy, camera/framing, lighting, palette, emotion, depth, and text-safe negative space.",
            "Use the requested creator-thumbnail convention as a broad composition reference only.",
            "Never request a real creator's face, likeness, logo, brand marks, signature style, or exact recreation. Use generic original people and original props.",
            "Never ask the image model to render readable text, Arabic letters, numbers, logos, or watermarks. Arabic copy is added later as editable HTML.",
            "Write the final image prompt in English for reliable image-model adherence.",
          ].join("\n"),
        },
        {
          role: "user",
          content: [
            `Creator idea: ${input.idea}`,
            `Selected style: ${input.styleLabel}`,
            `Style rules: ${input.styleDescription}`,
            "Starting production constraints:",
            input.basePrompt,
          ].join("\n\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `OpenRouter prompt refinement failed (${response.status}): ${errorText.slice(0, 240)}`,
    );
  }

  const data = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string | Array<{ type?: string; text?: string }>;
      };
    }>;
  };
  const content = data.choices?.[0]?.message?.content;

  const normalizedContent = Array.isArray(content)
    ? content
        .map((part) => (typeof part?.text === "string" ? part.text : ""))
        .join("\n")
        .trim()
    : content;

  if (typeof normalizedContent !== "string" || !normalizedContent.trim()) {
    throw new Error("OpenRouter returned an empty prompt");
  }

  const parsed = parseModelJson(normalizedContent);
  if (!parsed) {
    throw new Error("OpenRouter returned an invalid prompt format");
  }

  return parsed;
}