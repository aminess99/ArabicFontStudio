export const SITE_ORIGIN = "https://xfontat.com";

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "xfontat",
  "alternateName": "إكس فونتات",
  "url": SITE_ORIGIN,
  "logo": `${SITE_ORIGIN}/logo.png`,
  "description": "مكتبة شاملة للخطوط العربية الاحترافية مع إمكانية التحميل المجاني",
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
      "description": "مجموعة من الخطوط العربية الاحترافية"
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
          "text": "يمكنك تحميل أي خط بسهولة من خلال الضغط على زر 'تحميل' الأخضر بجانب كل خط. الخطوط متاحة بصيغ TTF و OTF و WOFF و WOFF2."
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
          "text": "TTF: الصيغة الأساسية للخطوط، تعمل على معظم البرامج. OTF: صيغة متقدمة بميزات إضافية. WOFF: مصممة للويب بأحجام أصغر. WOFF2: نسخة محسّنة من WOFF بضغط أفضل."
        }
      },
      {
        "@type": "Question",
        "name": "كيف أستخدم الخطوط في المشاريع التجارية؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "جميع الخطوط في xfontat متاحة للاستخدام في المشاريع الشخصية والتجارية. تحقق من رخصة كل خط للحصول على تفاصيل الاستخدام الكاملة."
        }
      },
      {
        "@type": "Question",
        "name": "هل تدعم xfontat جميع أنظمة التشغيل؟",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "نعم، الخطوط متاحة لجميع أنظمة التشغيل: Windows و macOS و Linux وحتى الأجهزة المحمولة."
        }
      }
    ]
  };
}
