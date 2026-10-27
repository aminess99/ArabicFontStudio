// Copy for the tools that exist in several languages, shared by the React pages
// and server/seoHtml.ts. Each tool has its own path per language, so the
// hreflang links come from `toolPaths` rather than the /en and /fr prefixes.

import type { ToolPageCopy } from "./toolPages";

export type IntlLocale = "ar" | "en" | "fr";
export type IntlToolId = "keyboard" | "generator" | "tattoo" | "names" | "phrases";

export const toolPaths: Record<IntlToolId, Partial<Record<IntlLocale, string>>> = {
  keyboard: { ar: "/keyboard", en: "/en/arabic-keyboard", fr: "/fr/clavier-arabe" },
  generator: { ar: "/arabic-text-to-image", en: "/en/arabic-font-generator", fr: "/fr/generateur-police-arabe" },
  tattoo: { en: "/en/arabic-tattoo-fonts", fr: "/fr/police-arabe-tatouage" },
  names: { en: "/en/names-in-arabic", fr: "/fr/prenoms-en-arabe" },
  phrases: { en: "/en/arabic-phrases", fr: "/fr/expressions-arabes" },
};

// The default language for x-default: Arabic when the page exists in Arabic.
export function toolAlternates(paths: Partial<Record<IntlLocale, string>>) {
  const entries = (Object.entries(paths) as Array<[IntlLocale, string]>).map(([lang, path]) => ({ lang, href: `https://xfontat.com${path}` }));
  const fallback = paths.ar || paths.en!;
  return [...entries, { lang: "x-default", href: `https://xfontat.com${fallback}` }];
}

export function findIntlTool(path: string): { id: IntlToolId; locale: IntlLocale } | undefined {
  for (const [id, paths] of Object.entries(toolPaths) as Array<[IntlToolId, Partial<Record<IntlLocale, string>>]>) {
    for (const [locale, toolPath] of Object.entries(paths) as Array<[IntlLocale, string]>) {
      if (toolPath === path) return { id, locale };
    }
  }
  return undefined;
}

// Arabic pages with no English or French version; their language links lead
// to the home page of that language.
const ARABIC_ONLY = [/^\/zakhrafa$/, /^\/tahnia(?:\/[^/]+)?$/];

// Where the EN/FR language links of an Arabic page lead. Tools have their own
// path in each language, so prefixing /en or /fr would point to a missing page.
export function localeSwitchPath(locale: "en" | "fr", arabicPath: string): string {
  const path = arabicPath.replace(/\/+$/, "") || "/";
  const tool = findIntlTool(path);
  if (tool) return toolPaths[tool.id][locale] ?? `/${locale}`;
  if (path === "/" || ARABIC_ONLY.some((pattern) => pattern.test(path))) return `/${locale}`;
  return `/${locale}${path}`;
}

type Copy = ToolPageCopy & { locale: IntlLocale };

export const keyboardCopy: Record<IntlLocale, Copy> = {
  ar: {
    locale: "ar",
    path: toolPaths.keyboard.ar!,
    title: "كيبورد عربي اونلاين — اكتب بالعربي بدون تثبيت | xfontat",
    description: "لوحة مفاتيح عربية على الشاشة: اكتب بالعربي من أي جهاز، أضف التشكيل، ثم انسخ النص أو ابحث به أو شاهده بخطوط عربية وحمّله صورة.",
    heading: "كيبورد عربي اونلاين",
    intro: "اكتب بالعربية من أي جهاز حتى لو لم تكن لوحة مفاتيحك عربية. اضغط على الأحرف بالفأرة أو اللمس، أو اكتب بلوحة مفاتيحك العادية فيتحول ما تكتبه إلى حروف عربية حسب الترتيب العربي القياسي.",
    sections: [
      { heading: "اكتب بالعربي بدون تغيير لغة الجهاز", body: "الأداة تعمل في المتصفح مباشرة، فلا تحتاج إلى إضافة اللغة العربية إلى ويندوز أو ماك أو الجوال. مفيدة في مقاهي الإنترنت وأجهزة العمل والأجهزة المستعارة." },
      { heading: "التشكيل والحركات", body: "أضف الفتحة والضمة والكسرة والسكون والشدة والتنوين من صف الحركات. ضع الحركة بعد الحرف الذي تريد تشكيله." },
      { heading: "من النص إلى الصورة", body: "بعد الكتابة يمكنك معاينة النص بخطوط عربية مختلفة، ثم فتحه في أداة كتابة النص بالخط العربي لتحميله صورة PNG." },
    ],
    faqs: [
      { question: "كيف أكتب بالعربي على كيبورد إنجليزي؟", answer: "اضغط داخل مربع الكتابة واكتب كالمعتاد، فتتحول الحروف إلى العربية حسب ترتيب لوحة المفاتيح العربية القياسية. يمكنك أيضاً الضغط على الأحرف في اللوحة الظاهرة." },
      { question: "هل الكيبورد يدعم التشكيل؟", answer: "نعم، يوجد صف كامل للحركات: الفتحة والضمة والكسرة والسكون والشدة والتنوين." },
      { question: "هل يُحفظ ما أكتبه؟", answer: "لا، يبقى النص في متصفحك فقط ولا يُرسل إلى أي خادم." },
    ],
  },
  en: {
    locale: "en",
    path: toolPaths.keyboard.en!,
    title: "Arabic Keyboard Online — Type in Arabic Without Installing | xfontat",
    description: "Free online Arabic keyboard: type Arabic with your mouse or keyboard, add vowel marks, then copy, search, translate or turn the text into calligraphy.",
    heading: "Arabic Keyboard Online",
    intro: "Type in Arabic on any computer or phone, even without an Arabic keyboard. Click the letters on screen, or type on your usual keyboard and each key turns into the Arabic letter in the same position on a standard Arabic layout. Switch to phonetic mode to type by sound instead (b for ب, s for س).",
    sections: [
      { heading: "How to type in Arabic", body: "Arabic is written from right to left and most letters join to the next one. Type the letters in order and the browser joins them automatically, so ب + ا + ب becomes باب (door). The text box is set to right-to-left so the cursor moves the right way." },
      { heading: "Standard layout or phonetic typing", body: "The standard layout matches the Arabic keyboards sold in the Middle East: the key for Q gives ض, A gives ش, and so on. If you have never used an Arabic keyboard, phonetic mode is easier: type the Latin letter that sounds closest, such as k for ك or m for م. Capital letters give the heavier sounds: S for ص, D for ض, T for ط, H for ح." },
      { heading: "Vowel marks (harakat)", body: "Everyday Arabic is written without short vowels, but you can add them with the vowel row: fatha (a), damma (u), kasra (i), sukun (no vowel), shadda (double letter) and tanween. Place each mark after the letter it belongs to." },
      { heading: "Copy, search, translate or make calligraphy", body: "When you are done, copy the text, search it on Google, open it in Google Translate, or preview it in Arabic calligraphy fonts and download it as a PNG image with our Arabic font generator." },
    ],
    faqs: [
      { question: "How do I type Arabic on an English keyboard?", answer: "Click in the text box and type normally. Each key is converted to the Arabic letter on the same key of a standard Arabic keyboard. Choose phonetic mode if you prefer to type by sound." },
      { question: "Do I need to install anything?", answer: "No. The keyboard runs in your browser on Windows, Mac, Linux, Android and iPhone, with no download or language settings to change." },
      { question: "Can I add Arabic vowel marks?", answer: "Yes. Use the vowel row to add fatha, damma, kasra, sukun, shadda and tanween after a letter." },
      { question: "Is my text saved or sent anywhere?", answer: "No. Your text stays in your browser and is never sent to our server." },
      { question: "How do I write my name in Arabic?", answer: "Look your name up in our Names in Arabic guide, which gives the usual Arabic spelling and the name in several calligraphy styles." },
    ],
  },
  fr: {
    locale: "fr",
    path: toolPaths.keyboard.fr!,
    title: "Clavier arabe en ligne — écrire en arabe sans installation | xfontat",
    description: "Clavier arabe en ligne gratuit : écrivez en arabe à la souris ou au clavier, ajoutez les voyelles, puis copiez, traduisez ou créez une calligraphie.",
    heading: "Clavier arabe en ligne",
    intro: "Écrivez en arabe sur n'importe quel ordinateur ou téléphone, même sans clavier arabe. Cliquez sur les lettres à l'écran, ou tapez sur votre clavier habituel : chaque touche devient la lettre arabe placée au même endroit sur un clavier arabe standard. Le mode phonétique permet aussi d'écrire au son (b pour ب, s pour س).",
    sections: [
      { heading: "Comment écrire en arabe", body: "L'arabe s'écrit de droite à gauche et la plupart des lettres se lient à la suivante. Tapez les lettres dans l'ordre : le navigateur les relie automatiquement, ainsi ب + ا + ب donne باب (porte)." },
      { heading: "Clavier standard ou phonétique", body: "La disposition standard correspond aux claviers arabes vendus au Moyen-Orient. Si vous n'en avez jamais utilisé, le mode phonétique est plus simple : tapez la lettre latine la plus proche, k pour ك ou m pour م. Les majuscules donnent les sons emphatiques : S pour ص, D pour ض, T pour ط, H pour ح." },
      { heading: "Les voyelles (harakat)", body: "L'arabe courant s'écrit sans voyelles brèves, mais vous pouvez les ajouter : fatha (a), damma (ou), kasra (i), soukoun (absence de voyelle), chadda (lettre doublée) et tanwin. Placez chaque signe après sa lettre." },
      { heading: "Copier, chercher, traduire ou créer une calligraphie", body: "Copiez le texte, cherchez-le sur Google, ouvrez-le dans Google Traduction, ou prévisualisez-le avec des polices de calligraphie arabe puis téléchargez-le en image PNG avec notre générateur de police arabe." },
    ],
    faqs: [
      { question: "Comment écrire en arabe avec un clavier AZERTY ?", answer: "Cliquez dans la zone de texte et tapez : chaque touche est convertie selon la disposition arabe standard. Le mode phonétique permet d'écrire au son, quelle que soit la disposition de votre clavier." },
      { question: "Faut-il installer quelque chose ?", answer: "Non. Le clavier fonctionne dans le navigateur, sur Windows, Mac, Android et iPhone." },
      { question: "Peut-on ajouter les voyelles arabes ?", answer: "Oui, la rangée des voyelles ajoute fatha, damma, kasra, soukoun, chadda et tanwin." },
      { question: "Mon texte est-il enregistré ?", answer: "Non, le texte reste dans votre navigateur et n'est jamais envoyé à notre serveur." },
      { question: "Comment écrire mon prénom en arabe ?", answer: "Consultez notre guide des prénoms en arabe, qui donne l'orthographe arabe habituelle et le prénom en plusieurs styles de calligraphie." },
    ],
  },
};

export const generatorCopy: Record<"en" | "fr", Copy> = {
  en: {
    locale: "en",
    path: toolPaths.generator.en!,
    title: "Arabic Font Generator — Arabic Calligraphy Text to PNG | xfontat",
    description: "Type a name or text, pick an Arabic calligraphy font (Thuluth, Diwani, Kufi, Naskh, Nastaliq) and download a transparent PNG. Free, no sign-up.",
    heading: "Arabic Font Generator",
    intro: "Write any Arabic text, or an English name we can spell in Arabic, then choose a calligraphy style, colour and size, and download the result as a PNG image. The generator uses the real font files from our library of over 850 Arabic fonts.",
    sections: [
      { heading: "Type in English, get Arabic", body: "Enter a common first name in Latin letters, such as Sarah or Adam, and the generator suggests its Arabic spelling. For other words, use our online Arabic keyboard to type the Arabic text first." },
      { heading: "Real Arabic calligraphy styles", body: "Thuluth for elegant headings and wall art, Diwani for flowing invitations, Kufi for logos, Naskh for clear text, Nastaliq for poetry, plus modern display fonts. Each style connects letters correctly, unlike fake \"Arabic-looking\" Latin fonts." },
      { heading: "Transparent or coloured background", body: "Download a transparent PNG to place on a T-shirt, mug, logo or video, or choose a background colour to post straight to social media." },
      { heading: "Check the font licence", body: "For commercial use, open the font's page and read its licence. Fonts marked SIL Open Font License can be used commercially." },
    ],
    faqs: [
      { question: "How do I write my name in Arabic calligraphy?", answer: "Type your name, accept the Arabic spelling we suggest (or type it in Arabic), choose a font style, then click Download PNG." },
      { question: "Is the Arabic font generator free?", answer: "Yes. It is free with no sign-up, and the image is drawn in your browser." },
      { question: "Can I use the image for a tattoo?", answer: "Yes, but have a native Arabic speaker check the spelling first, and use a font whose licence allows it. See our Arabic tattoo fonts guide." },
      { question: "Why do some letters look disconnected in other generators?", answer: "Arabic letters change shape depending on their position in a word. Many generators do not support this. Ours uses proper Arabic font files, so letters join correctly." },
    ],
  },
  fr: {
    locale: "fr",
    path: toolPaths.generator.fr!,
    title: "Générateur de police arabe — calligraphie arabe en PNG | xfontat",
    description: "Tapez un prénom ou un texte, choisissez une calligraphie arabe (thuluth, diwani, coufique, naskh) et téléchargez un PNG transparent. Gratuit.",
    heading: "Générateur de police arabe",
    intro: "Écrivez un texte arabe, ou un prénom français que nous savons écrire en arabe, choisissez un style de calligraphie, une couleur et une taille, puis téléchargez une image PNG. Le générateur utilise les vrais fichiers de notre bibliothèque de plus de 850 polices arabes.",
    sections: [
      { heading: "Tapez en français, obtenez l'arabe", body: "Saisissez un prénom courant en lettres latines, comme Sarah ou Adam, et le générateur propose son orthographe arabe. Pour un autre mot, utilisez d'abord notre clavier arabe en ligne." },
      { heading: "De vrais styles de calligraphie arabe", body: "Thuluth pour les titres et tableaux, diwani pour les invitations, coufique pour les logos, naskh pour les textes lisibles, nastaliq pour la poésie, ainsi que des polices modernes. Les lettres se lient correctement, contrairement aux fausses polices « style arabe »." },
      { heading: "Fond transparent ou coloré", body: "Téléchargez un PNG transparent pour un t-shirt, une tasse, un logo ou une vidéo, ou choisissez une couleur de fond pour publier directement sur les réseaux sociaux." },
      { heading: "Vérifiez la licence", body: "Pour un usage commercial, consultez la licence sur la page de la police. Les polices sous licence SIL Open Font License sont utilisables commercialement." },
    ],
    faqs: [
      { question: "Comment écrire mon prénom en calligraphie arabe ?", answer: "Tapez votre prénom, acceptez l'orthographe arabe proposée (ou écrivez-le en arabe), choisissez un style puis cliquez sur Télécharger le PNG." },
      { question: "Le générateur est-il gratuit ?", answer: "Oui, sans inscription. L'image est créée dans votre navigateur." },
      { question: "Puis-je utiliser l'image pour un tatouage ?", answer: "Oui, mais faites vérifier l'orthographe par un arabophone et choisissez une police dont la licence le permet. Voir notre guide des polices arabes pour tatouage." },
      { question: "Pourquoi les lettres sont-elles séparées sur d'autres sites ?", answer: "Les lettres arabes changent de forme selon leur position. Beaucoup de générateurs ne gèrent pas cela ; le nôtre utilise de vrais fichiers de police arabe." },
    ],
  },
};

export const tattooCopy: Record<"en" | "fr", Copy> = {
  en: {
    locale: "en",
    path: toolPaths.tattoo.en!,
    title: "Arabic Tattoo Fonts — Preview Your Arabic Tattoo Free | xfontat",
    description: "Preview your Arabic tattoo in Thuluth, Diwani, Kufi and Nastaliq calligraphy fonts, avoid common Arabic tattoo mistakes, and download a stencil-ready PNG.",
    heading: "Arabic Tattoo Fonts",
    intro: "Type a word, name or phrase in Arabic and see it in 10 calligraphy fonts chosen for tattoos. Every font here is published under the SIL Open Font License, so you can take the design to your tattoo artist. Before you book, read the mistakes section below: Arabic tattoos go wrong more often than any other script.",
    sections: [
      { heading: "The most common Arabic tattoo mistakes", body: "Letters written separately instead of joined; text reversed left to right because the design software did not support Arabic; translation from a free online tool that picks the wrong word; and a mirrored stencil. Always check the final stencil, not only the drawing, with a native Arabic speaker." },
      { heading: "Choosing a calligraphy style", body: "Thuluth is ornate and suits larger pieces on the forearm or back. Diwani flows in curves and looks good along the ribs or collarbone. Kufi is geometric and stays readable when small, such as on a finger or wrist. Nastaliq, the Persian style, is slanted and delicate for short words and poetry." },
      { heading: "Size and readability", body: "Arabic calligraphy has fine details that blur as ink spreads. Keep at least 3 cm in height for Thuluth and Diwani, and prefer simple fonts for small tattoos. Short words of three to six letters give the cleanest results." },
      { heading: "A note on religious text", body: "Many Muslims consider it disrespectful to tattoo the name of God or verses of the Quran on the body. If you want a spiritual meaning, words such as sabr (patience), amal (hope) or noor (light) are common alternatives." },
    ],
    faqs: [
      { question: "What is the best font for an Arabic tattoo?", answer: "For larger designs, Thuluth or Diwani calligraphy; for small tattoos, a clean Kufi or Naskh font. Preview your text in several styles above before deciding." },
      { question: "How can I check that my Arabic tattoo is correct?", answer: "Ask a native Arabic speaker to read the final stencil. Make sure the letters are joined and that the text reads from right to left." },
      { question: "Can I use these fonts for a tattoo for free?", answer: "Yes. The fonts on this page use the SIL Open Font License, which allows personal and commercial use." },
      { question: "How do I write my name in Arabic for a tattoo?", answer: "Find your name in our Names in Arabic guide for the usual spelling, then preview it here in tattoo fonts." },
    ],
  },
  fr: {
    locale: "fr",
    path: toolPaths.tattoo.fr!,
    title: "Police arabe pour tatouage — prévisualisez votre tatouage | xfontat",
    description: "Prévisualisez votre tatouage arabe en thuluth, diwani, coufique ou nastaliq, évitez les erreurs fréquentes et téléchargez un PNG pour le pochoir.",
    heading: "Polices arabes pour tatouage",
    intro: "Tapez un mot, un prénom ou une phrase en arabe et voyez-le dans 10 polices calligraphiques choisies pour le tatouage. Toutes sont publiées sous licence SIL Open Font License. Avant de prendre rendez-vous, lisez la section sur les erreurs : les tatouages en arabe sont souvent ratés.",
    sections: [
      { heading: "Les erreurs les plus fréquentes", body: "Lettres séparées au lieu d'être liées ; texte inversé de gauche à droite parce que le logiciel ne gère pas l'arabe ; traduction automatique qui choisit le mauvais mot ; pochoir appliqué en miroir. Faites vérifier le pochoir final par un arabophone." },
      { heading: "Choisir un style de calligraphie", body: "Le thuluth est orné et convient aux grandes pièces sur l'avant-bras ou le dos. Le diwani tout en courbes s'adapte aux côtes ou à la clavicule. Le coufique, géométrique, reste lisible en petit, sur un doigt ou un poignet. Le nastaliq, style persan, est délicat pour les mots courts et la poésie." },
      { heading: "Taille et lisibilité", body: "La calligraphie arabe comporte des détails fins qui s'estompent avec le temps. Prévoyez au moins 3 cm de hauteur pour le thuluth et le diwani, et préférez des polices simples pour les petits tatouages." },
      { heading: "À propos des textes religieux", body: "Beaucoup de musulmans jugent irrespectueux de tatouer le nom de Dieu ou des versets du Coran. Pour un sens spirituel, des mots comme sabr (patience), amal (espoir) ou nour (lumière) sont des alternatives courantes." },
    ],
    faqs: [
      { question: "Quelle est la meilleure police pour un tatouage arabe ?", answer: "Pour les grands motifs, le thuluth ou le diwani ; pour les petits tatouages, un coufique ou un naskh simple. Comparez plusieurs styles ci-dessus." },
      { question: "Comment vérifier que mon tatouage en arabe est correct ?", answer: "Faites lire le pochoir final par un arabophone et vérifiez que les lettres sont liées et que le texte se lit de droite à gauche." },
      { question: "Ces polices sont-elles gratuites pour un tatouage ?", answer: "Oui, elles sont sous licence SIL Open Font License, qui autorise l'usage personnel et commercial." },
      { question: "Comment écrire mon prénom en arabe pour un tatouage ?", answer: "Cherchez votre prénom dans notre guide des prénoms en arabe, puis prévisualisez-le ici." },
    ],
  },
};

export const namesHubCopy: Record<"en" | "fr", Copy> = {
  en: {
    locale: "en",
    path: toolPaths.names.en!,
    title: "Names in Arabic — How to Write Your Name in Arabic | xfontat",
    description: "How to write your name in Arabic: the Arabic spelling, meaning and pronunciation of 200 popular names, each shown in Arabic calligraphy fonts you can download.",
    heading: "Names in Arabic",
    intro: "Find how a name is written in Arabic letters, what it means, and how it looks in calligraphy styles such as Thuluth, Diwani and Kufi. Western names are spelled the way Arabic speakers write them by sound; where a name has a traditional Arabic form, such as Joseph and Yusuf, we show both.",
    sections: [
      { heading: "How names are written in Arabic", body: "Arabic has no letters for p, v or the hard g, and short vowels are usually left out. Arabic speakers therefore spell foreign names by sound with the closest letters: p becomes ب (b), v becomes ف (f), and long vowels are written with ا, و or ي. That is why a name can have more than one accepted Arabic spelling." },
      { heading: "Calligraphy, tattoos and jewellery", body: "Each name page shows the name in several Arabic calligraphy fonts that you can download as PNG images, ready for gifts, name necklaces, wall art or a tattoo design." },
    ],
    faqs: [
      { question: "How do I write my name in Arabic?", answer: "Search for your name below. If it is not listed, type it in the Arabic font generator, or spell it by sound using our online Arabic keyboard." },
      { question: "Is there only one correct Arabic spelling?", answer: "Not always. Foreign names are written by sound, so variations exist. We show the most common spelling used in Arabic media." },
      { question: "Can I use the calligraphy for a name necklace or tattoo?", answer: "Yes. The fonts are under the SIL Open Font License. Ask a native speaker to check the final design." },
    ],
  },
  fr: {
    locale: "fr",
    path: toolPaths.names.fr!,
    title: "Prénoms en arabe — écrire son prénom en arabe | xfontat",
    description: "Comment écrire son prénom en arabe : orthographe arabe, signification et prononciation de 200 prénoms, chacun en calligraphie arabe à télécharger.",
    heading: "Prénoms en arabe",
    intro: "Découvrez comment un prénom s'écrit en lettres arabes, ce qu'il signifie et à quoi il ressemble en calligraphie thuluth, diwani ou coufique. Les prénoms occidentaux sont écrits au son, comme le font les arabophones ; quand il existe une forme arabe traditionnelle, comme Joseph et Youssef, nous indiquons les deux.",
    sections: [
      { heading: "Comment les prénoms s'écrivent en arabe", body: "L'arabe n'a pas de lettre pour p, v ou le g dur, et les voyelles brèves ne s'écrivent généralement pas. Les prénoms étrangers s'écrivent donc au son : p devient ب (b), v devient ف (f), et les voyelles longues s'écrivent avec ا, و ou ي. Un prénom peut donc avoir plusieurs orthographes admises." },
      { heading: "Calligraphie, tatouages et bijoux", body: "Chaque page présente le prénom dans plusieurs polices de calligraphie arabe téléchargeables en PNG, pour un cadeau, un collier prénom, un tableau ou un tatouage." },
    ],
    faqs: [
      { question: "Comment écrire mon prénom en arabe ?", answer: "Cherchez votre prénom ci-dessous. S'il n'y figure pas, tapez-le dans le générateur de police arabe ou écrivez-le au son avec notre clavier arabe." },
      { question: "Existe-t-il une seule orthographe correcte ?", answer: "Pas toujours. Les prénoms étrangers s'écrivent au son, d'où des variantes. Nous indiquons l'orthographe la plus courante dans les médias arabes." },
      { question: "Puis-je utiliser la calligraphie pour un collier ou un tatouage ?", answer: "Oui, les polices sont sous licence SIL Open Font License. Faites vérifier le motif final par un arabophone." },
    ],
  },
};

export const phrasesHubCopy: Record<"en" | "fr", Copy> = {
  en: {
    locale: "en",
    path: toolPaths.phrases.en!,
    title: "Arabic Words and Phrases in Calligraphy — Meaning | xfontat",
    description: "Allah, Bismillah, Inshallah, Habibi and more: Arabic spelling, meaning and pronunciation of popular words and phrases, in downloadable calligraphy.",
    heading: "Arabic Words and Phrases",
    intro: "The Arabic words and phrases people look up most, from greetings and expressions of faith to single words that are popular in tattoos and wall art. Each page gives the Arabic text, its meaning, how to say it and the phrase in several calligraphy styles.",
    sections: [
      { heading: "Writing Arabic phrases correctly", body: "Arabic phrases are written as separate words from right to left, and spelling matters: a missing dot can change the meaning. Copy the Arabic text from these pages rather than retyping it." },
    ],
    faqs: [
      { question: "Can I download the calligraphy?", answer: "Yes. Every phrase page lets you download each calligraphy style as a PNG image." },
      { question: "Are these phrases suitable for tattoos?", answer: "Many are, but many Muslims consider tattooing the name of God or Quranic text disrespectful. Each page notes this where it applies." },
    ],
  },
  fr: {
    locale: "fr",
    path: toolPaths.phrases.fr!,
    title: "Mots et expressions arabes en calligraphie — sens | xfontat",
    description: "Allah, Bismillah, Inchallah, Habibi et d'autres : orthographe arabe, sens et prononciation des expressions populaires, en calligraphie à télécharger.",
    heading: "Mots et expressions arabes",
    intro: "Les mots et expressions arabes les plus recherchés, des salutations aux formules de foi, ainsi que des mots courts appréciés pour les tatouages et la décoration. Chaque page donne le texte arabe, son sens, sa prononciation et l'expression en plusieurs styles de calligraphie.",
    sections: [
      { heading: "Écrire correctement une expression arabe", body: "Les expressions arabes s'écrivent mot par mot de droite à gauche, et l'orthographe compte : un point manquant peut changer le sens. Copiez le texte arabe de ces pages plutôt que de le retaper." },
    ],
    faqs: [
      { question: "Puis-je télécharger la calligraphie ?", answer: "Oui, chaque page permet de télécharger chaque style en image PNG." },
      { question: "Ces expressions conviennent-elles aux tatouages ?", answer: "Beaucoup, oui, mais de nombreux musulmans jugent irrespectueux de tatouer le nom de Dieu ou des textes du Coran. Chaque page le précise." },
    ],
  },
};

// Navigation shared by the English and French tool pages.
export const intlNav: Record<"en" | "fr", Array<{ id: IntlToolId | "fonts" | "blog"; href: string; label: string }>> = {
  en: [
    { id: "fonts", href: "/en", label: "Arabic fonts" },
    { id: "keyboard", href: toolPaths.keyboard.en!, label: "Arabic keyboard" },
    { id: "names", href: toolPaths.names.en!, label: "Names in Arabic" },
    { id: "generator", href: toolPaths.generator.en!, label: "Font generator" },
    { id: "tattoo", href: toolPaths.tattoo.en!, label: "Tattoo fonts" },
    { id: "phrases", href: toolPaths.phrases.en!, label: "Arabic phrases" },
    { id: "blog", href: "/en/blog", label: "Blog" },
  ],
  fr: [
    { id: "fonts", href: "/fr", label: "Polices arabes" },
    { id: "keyboard", href: toolPaths.keyboard.fr!, label: "Clavier arabe" },
    { id: "names", href: toolPaths.names.fr!, label: "Prénoms en arabe" },
    { id: "generator", href: toolPaths.generator.fr!, label: "Générateur" },
    { id: "tattoo", href: toolPaths.tattoo.fr!, label: "Tatouage" },
    { id: "phrases", href: toolPaths.phrases.fr!, label: "Expressions" },
    { id: "blog", href: "/fr/blog", label: "Blog" },
  ],
};

// Fonts used to show names and phrases in calligraphy. All are published under
// the SIL Open Font License and join every letter correctly.
export const CALLIGRAPHY_FONTS = [
  { slug: "layla-thuluth", style: "Thuluth", url: "/fonts/ثلث/Layla-Thuluth.ttf" },
  { slug: "gulzar", style: "Nastaliq", url: "/fonts/نستعليق/Gulzar.ttf" },
  { slug: "rakkas", style: "Display", url: "/fonts/تصميم/Rakkas.ttf" },
  { slug: "reem-kufi", style: "Kufi", url: "/fonts/كوفي/Reem-Kufi.ttf" },
  { slug: "katibeh", style: "Calligraphic", url: "/fonts/تصميم/Katibeh.ttf" },
  { slug: "scheherazade-new", style: "Naskh", url: "/fonts/نسخ/Scheherazade-New.ttf" },
  { slug: "jomhuria", style: "Bold display", url: "/fonts/تصميم/Jomhuria.ttf" },
  { slug: "blaka", style: "Blackletter", url: "/fonts/خطوط الحرة/Blaka.ttf" },
  { slug: "mirza", style: "Naskh", url: "/fonts/نسخ/Mirza.ttf" },
  { slug: "kufam", style: "Modern Kufi", url: "/fonts/كوفي/Kufam.ttf" },
] as const;
