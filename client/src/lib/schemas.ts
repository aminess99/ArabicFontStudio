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
    "mainEntity": [
      {
        "@type": "Question",
        "name": "كيف أحمل الخطوط من xfontat؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "افتح صفحة الخط واضغط على زر التنزيل؛ تعرض الصفحة الصيغة المتاحة لهذا الملف."
        }
      },
      {
        "@type": "Question",
        "name": "هل جميع الخطوط مجانية للتحميل؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، جميع الخطوط في مكتبة xfontat متاحة للتحميل مجاناً بدون أي رسوم أو اشتراكات."
        }
      },
      {
        "@type": "Question",
        "name": "ما الفرق بين صيغ الخطوط المختلفة؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "تختلف الصيغ المتاحة وخصائصها بحسب الملف. راجع صفحة الخط ومتطلبات البرنامج أو المتصفح المستهدف قبل الاستخدام."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أستخدم الخطوط في المشاريع التجارية؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "التحميل مجاني، لكن حقوق الاستخدام التجاري تختلف من خط إلى آخر. تحقق من رخصة كل خط قبل استخدامه في مشروع تجاري."
        }
      },
      {
        "@type": "Question",
        "name": "هل يعمل الخط على نظام التشغيل الذي أستخدمه؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "يعتمد التوافق على صيغة الملف ونظام التشغيل والتطبيق. اختبر الخط في البيئة التي ستستخدمه فيها."
        }
      }
    ]
  };
}
