import { useEffect } from "react";

interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  schema?: object;
}

export function SEOHead({ title, description, path, schema }: SEOHeadProps) {
  const baseUrl = "https://xfontat.com";
  const fullUrl = `${baseUrl}${path}`;

  useEffect(() => {
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

    if (schema) {
      const existingScript = document.querySelector('script[data-schema="page"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-schema", "page");
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);

      return () => {
        script.remove();
      };
    }
  }, [title, description, fullUrl, schema]);

  return null;
}
