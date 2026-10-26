import { homeFaqs } from "./homeContent";

export const SITE_ORIGIN = "https://xfontat.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "xfontat",
  "alternateName": "إكس فونتات",
  "url": SITE_ORIGIN,
  "logo": `${SITE_ORIGIN}/logo.png`,
  "description": "منصة لتصفح الخطوط العربية ومعاينتها والاطلاع على الصيغ والتراخيص المتاحة.",
  "inLanguage": "ar",
  "sameAs": []
};

export function createBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

export function createCollectionPageSchema(params: {
  name: string;
  description: string;
  url: string;
  numberOfItems: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": params.name,
    "description": params.description,
    "url": params.url,
    "inLanguage": "ar",
    "isPartOf": {
      "@type": "WebSite",
      "name": "xfontat",
      "url": SITE_ORIGIN
    },
    "about": {
      "@type": "Thing",
      "name": "خطوط عربية",
      "description": "مجموعة من الخطوط العربية المعروضة للتصفح والمعاينة"
    },
    "numberOfItems": params.numberOfItems
  };
}

export function createItemListSchema(fonts: Array<{ name: string; nameArabic: string; category: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": fonts.slice(0, 20).map((font, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": font.nameArabic,
        "applicationCategory": "DesignApplication",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "operatingSystem": "Windows, macOS, Linux"
      }
    }))
  };
}

export function createWebPageSchema(params: {
  name: string;
  description: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": params.name,
    "description": params.description,
    "url": params.url,
    "inLanguage": "ar",
    "isPartOf": {
      "@type": "WebSite",
      "name": "xfontat",
      "url": SITE_ORIGIN
    }
  };
}

export function createFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": homeFaqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": { "@type": "Answer", "text": faq.answer },
    })),
  };
}
