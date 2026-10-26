import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  schema?: object;
  lang?: string;
  direction?: "ltr" | "rtl";
  alternates?: { lang: string; href: string }[];
  // Defaults to path; set when another page holds the same content.
  canonicalPath?: string;
  // False for pages that exist only in Arabic, so no en/fr hreflang is emitted.
  localized?: boolean;
}

const MAX_TITLE_LENGTH = 65;

// Mirrors fitTitle in server/seoHtml.ts so the rendered title matches the SSR one.
function fitTitle(title: string) {
  return title.length > MAX_TITLE_LENGTH ? title.replace(/\s*\|\s*xfontat$/, "") : title;
}

function buildAlternates(path: string, supplied: { lang: string; href: string }[]) {
  const baseUrl = "https://xfontat.com";
  const normalizedPath = path.replace(/\/+$/, "") || "/";
  const pagePath = /^\/(en|fr)(?:\/|$)/.test(normalizedPath)
    ? normalizedPath.replace(/^\/(en|fr)/, "") || "/"
    : normalizedPath;
  const localizedPath = (locale: "en" | "fr") => pagePath === "/" ? `/${locale}` : `/${locale}${pagePath}`;
  const defaults = new Map([
    ["ar", `${baseUrl}${pagePath}`],
    ["en", `${baseUrl}${localizedPath("en")}`],
    ["fr", `${baseUrl}${localizedPath("fr")}`],
    ["x-default", `${baseUrl}${pagePath}`],
  ]);
  for (const alternate of supplied) defaults.set(alternate.lang, alternate.href);
  return Array.from(defaults, ([lang, href]) => ({ lang, href }));
}

export function SEOHead({
  title,
  description,
  path,
  schema,
  lang = "ar",
  direction = "rtl",
  alternates = [],
  canonicalPath,
  localized = true,
}: SEOHeadProps) {
  const baseUrl = "https://xfontat.com";
  const fullUrl = `${baseUrl}${canonicalPath || path}`;
  title = fitTitle(title);
  const resolvedAlternates = localized
    ? buildAlternates(path, alternates)
    : [{ lang: "ar", href: fullUrl }, { lang: "x-default", href: fullUrl }];
  const alternateLinksKey = JSON.stringify(resolvedAlternates);

  useEffect(() => {
    const root = document.documentElement;
    const previousLang = root.lang;
    const previousDirection = root.dir;
    root.lang = lang;
    root.dir = direction;
    document.title = title;

    const metaTags = [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: fullUrl },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      { name: "twitter:url", content: fullUrl },
    ];

    metaTags.forEach(({ name, property, content }) => {
      const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
      const meta = document.querySelector(selector);
      if (meta) {
        meta.setAttribute("content", content);
      }
    });

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute("href", fullUrl);
    }

    document.querySelectorAll('link[data-seo-alternate="true"]').forEach((link) => link.remove());
    const alternateLinks = resolvedAlternates.map(({ lang: alternateLang, href }) => {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = alternateLang;
      link.href = href;
      link.dataset.seoAlternate = "true";
      document.head.appendChild(link);
      return link;
    });

    let script: HTMLScriptElement | undefined;
    if (schema) {
      const existingScript = document.querySelector('script[data-schema="page"]');
      if (existingScript) {
        existingScript.remove();
      }

      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-schema", "page");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    }

    return () => {
      alternateLinks.forEach((link) => link.remove());
      script?.remove();
      root.lang = previousLang;
      root.dir = previousDirection;
    };
  }, [title, description, fullUrl, schema, lang, direction, alternateLinksKey]);

  return null;
}
