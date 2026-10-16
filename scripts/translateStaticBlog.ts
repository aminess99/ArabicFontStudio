import { GoogleGenAI } from "@google/genai";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { blogPosts } from "../client/src/lib/blogData";

type Translation = { title: string; excerpt: string; content: string };
type TranslationMap = Record<string, { en: Translation; fr: Translation }>;

const apiKey = process.env.AI_INTEGRATIONS_GEMINI_API_KEY;
const baseUrl = process.env.AI_INTEGRATIONS_GEMINI_BASE_URL;
if (!apiKey || !baseUrl) {
  throw new Error("Gemini integration is not configured in this environment.");
}

const ai = new GoogleGenAI({ apiKey, httpOptions: { apiVersion: "", baseUrl } });
const outputPath = path.join(process.cwd(), "client/src/lib/blogPostTranslations.json");
const checkpointPath = "/tmp/xfontat-blog-translations.partial.json";

function translateCodeComments(content: string, locale: "en" | "fr"): string {
  const replacements: Record<"en" | "fr", Array<[string, string]>> = {
    en: [
      ["/* الإعداد العام */", "/* Global settings */"],
      ["/* للمحتوى الإنجليزي داخل موقع عربي */", "/* For English content inside an Arabic website */"],
      ["/* يعرض النص فوراً بخط بديل ثم يستبدله */", "/* Show fallback text immediately, then swap when the font loads */"],
    ],
    fr: [
      ["/* الإعداد العام */", "/* Paramètres globaux */"],
      ["/* للمحتوى الإنجليزي داخل موقع عربي */", "/* Pour le contenu anglais sur un site en arabe */"],
      ["/* يعرض النص فوراً بخط بديل ثم يستبدله */", "/* Afficher immédiatement le texte de remplacement, puis le remplacer au chargement de la police */"],
      ["« Install » ou « تثبيت »", "« Installer »"],
    ],
  };
  return replacements[locale].reduce((text, [source, target]) => text.replaceAll(source, target), content);
}

function parseResponse(text: string): unknown {
  const trimmed = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(trimmed);
  } catch {
    const json = trimmed.match(/\{[\s\S]*\}/)?.[0];
    if (!json) throw new Error("Gemini returned no JSON translation.");
    return JSON.parse(json);
  }
}

function protectedMarkdown(source: string): string[] {
  return [
    ...source.matchAll(/```[\s\S]*?```|`[^`\n]+`|https?:\/\/[^\s)]+/g),
  ].map((match) => match[0]);
}

function maskProtectedMarkdown(source: string) {
  const protectedValues: string[] = [];
  const masked = source.replace(/```[\s\S]*?```|`[^`\n]+`|https?:\/\/[^\s)]+/g, (value) => {
    const marker = `XFONTATKEEP${protectedValues.length}TOKEN`;
    protectedValues.push(value);
    return marker;
  });
  return { masked, protectedValues };
}

function restoreProtectedMarkdown(value: string, protectedValues: string[]) {
  let restored = value;
  protectedValues.forEach((protectedValue, index) => {
    const marker = `XFONTATKEEP${index}TOKEN`;
    if (restored.split(marker).length !== 2) {
      throw new Error("Gemini altered or omitted a protected Markdown placeholder.");
    }
    restored = restored.replace(marker, protectedValue);
  });
  if (/XFONTATKEEP\d+TOKEN/.test(restored)) {
    throw new Error("Gemini added an unexpected protected Markdown placeholder.");
  }
  return restored;
}

function validateTranslation(source: string, translated: Translation, locale: string) {
  if (!translated.title?.trim() || !translated.excerpt?.trim() || !translated.content?.trim()) {
    throw new Error(`Gemini returned an incomplete ${locale} translation.`);
  }
  const expected = protectedMarkdown(source);
  const actual = protectedMarkdown(translated.content);
  if (JSON.stringify(expected) !== JSON.stringify(actual)) {
    throw new Error(`Protected code, inline literals, or URLs changed in the ${locale} translation.`);
  }
}

function restoreTranslation(
  translation: Translation,
  masks: { title: string[]; excerpt: string[]; content: string[] },
) {
  return {
    title: restoreProtectedMarkdown(translation.title, masks.title),
    excerpt: restoreProtectedMarkdown(translation.excerpt, masks.excerpt),
    content: restoreProtectedMarkdown(translation.content, masks.content),
  };
}

async function main() {
  let translations: TranslationMap = {};
  try {
    translations = JSON.parse(await readFile(checkpointPath, "utf8")) as TranslationMap;
  } catch {
    // No checkpoint yet; the first run starts from the beginning.
  }

  for (const [index, post] of blogPosts.entries()) {
    if (translations[post.slug]?.en?.content && translations[post.slug]?.fr?.content) {
      console.log(`Verified saved translation ${index + 1}/${blogPosts.length}: ${post.slug}`);
      continue;
    }

    const masks = {
      title: maskProtectedMarkdown(post.title),
      excerpt: maskProtectedMarkdown(post.excerpt),
      content: maskProtectedMarkdown(post.content),
    };
    const prompt = `Translate the following Arabic blog post completely into English and French. This is translation, not summarization or rewriting.

Requirements:
- Translate the title, excerpt, and every paragraph/list item in the full Markdown body.
- Preserve the original meaning, tone, paragraph order, Markdown headings, emphasis, and list structure.
- Do not add facts, advice, statistics, links, sources, claims, or promises that are not in the source.
- Preserve every placeholder exactly, in the same field, and exactly once. Placeholders stand for URLs, fenced code blocks, and inline-code spans that will be restored verbatim after translation. Never edit, translate, remove, duplicate, or move them.
- Keep product names, font names, brand names, and file extensions unchanged where appropriate.
- Keep any exact quoted license or legal wording in its original language; do not imply permissions beyond the source.
- Return only valid JSON with exactly this shape: {"en":{"title":"...","excerpt":"...","content":"..."},"fr":{"title":"...","excerpt":"...","content":"..."}}

Arabic source:
${JSON.stringify({
  title: masks.title.masked,
  excerpt: masks.excerpt.masked,
  content: masks.content.masked,
})}`;

    let parsed: { en?: Translation; fr?: Translation } | undefined;
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3 && !parsed; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          config: {
            maxOutputTokens: 8192,
            temperature: 0.1,
            responseMimeType: "application/json",
          },
        });
        parsed = parseResponse(response.text || "") as { en?: Translation; fr?: Translation };
      } catch (error) {
        lastError = error;
        if (attempt < 3) await new Promise((resolve) => setTimeout(resolve, attempt * 1200));
      }
    }
    if (!parsed) {
      throw new Error(`Gemini did not return structured translation for ${post.slug}: ${lastError instanceof Error ? lastError.message : "empty response"}`);
    }
    if (!parsed.en || !parsed.fr) throw new Error(`Gemini omitted a locale for ${post.slug}.`);
    const english = restoreTranslation(parsed.en, {
      title: masks.title.protectedValues,
      excerpt: masks.excerpt.protectedValues,
      content: masks.content.protectedValues,
    });
    const french = restoreTranslation(parsed.fr, {
      title: masks.title.protectedValues,
      excerpt: masks.excerpt.protectedValues,
      content: masks.content.protectedValues,
    });
    validateTranslation(post.content, english, "English");
    validateTranslation(post.content, french, "French");

    translations[post.slug] = { en: english, fr: french };
    await writeFile(checkpointPath, JSON.stringify(translations, null, 2), "utf8");
    console.log(`Translated and validated ${index + 1}/${blogPosts.length}: ${post.slug}`);
  }

  if (Object.keys(translations).length !== blogPosts.length) {
    throw new Error("Translation count does not match the static blog catalog.");
  }
  for (const translation of Object.values(translations)) {
    translation.en.content = translateCodeComments(translation.en.content, "en");
    translation.fr.content = translateCodeComments(translation.fr.content, "fr");
  }
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(translations, null, 2)}\n`, "utf8");
  console.log(`Saved ${blogPosts.length} complete English/French article translations.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "Translation failed.");
  process.exitCode = 1;
});
