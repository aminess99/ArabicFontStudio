// Reads data the server embedded in the page (bootData in server/seoHtml.ts).
let cache: Record<string, unknown> | null = null;

export function readBootData<T>(key: string): T | undefined {
  if (cache === null) {
    try {
      cache = JSON.parse(document.getElementById("boot-data")?.textContent || "{}");
    } catch {
      cache = {};
    }
  }
  return cache?.[key] as T | undefined;
}
