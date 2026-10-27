// English and French copy for the greeting card pages. The cards themselves
// stay the same; the Arabic calligraphy greeting is what visitors come for,
// so each occasion offers Arabic phrases first and English or French ones too.

import { CARDS_HUB, type CardFontId, type Occasion } from "./greetingCards";
import { CARD_PATHS, cardOccasionPath, parseCardPath, type IntlLocale } from "./intlTools";

export type CardLocale = IntlLocale;
export { CARD_PATHS, cardOccasionPath, parseCardPath };

type HubCopy = { title: string; heading: string; description: string; intro: string; faqs: Array<{ question: string; answer: string }> };

export const cardsHubCopy: Record<CardLocale, HubCopy> = {
  ar: CARDS_HUB,
  en: {
    title: "Eid & Ramadan Cards with Name — Free Arabic Greeting Cards | xfontat",
    heading: "Arabic greeting cards with your name",
    description: "Free Arabic greeting cards with your name for Ramadan, Eid, weddings, a new baby, graduation and birthdays. Download for WhatsApp and Instagram.",
    intro: "Choose the occasion and a template, then type a name to get a greeting card with an Arabic calligraphy message, sized for WhatsApp, Instagram or stories.",
    faqs: [
      { question: "Are the greeting cards free?", answer: "Yes. Every card is free, works in your browser without sign-up, and the name you type is never sent to a server." },
      { question: "Can I use a card commercially?", answer: "The fonts on the cards are published under the SIL Open Font License, which allows commercial use, and the artwork is made by xfontat." },
      { question: "Can I write the name in English letters?", answer: "Yes. Type the name in English or Arabic letters. To find how a name is written in Arabic, see our Names in Arabic guide." },
    ],
  },
  fr: {
    title: "Cartes Aïd et Ramadan avec prénom — cartes arabes gratuites | xfontat",
    heading: "Cartes de vœux arabes avec votre prénom",
    description: "Cartes de vœux arabes gratuites avec prénom pour le Ramadan, l'Aïd, un mariage, une naissance, un diplôme ou un anniversaire, pour WhatsApp et Instagram.",
    intro: "Choisissez l'occasion et un modèle, puis tapez un prénom pour obtenir une carte avec un message en calligraphie arabe, au format WhatsApp, Instagram ou story.",
    faqs: [
      { question: "Les cartes sont-elles gratuites ?", answer: "Oui. Toutes les cartes sont gratuites, fonctionnent dans le navigateur sans inscription, et le prénom saisi n'est jamais envoyé à un serveur." },
      { question: "Puis-je utiliser une carte à des fins commerciales ?", answer: "Les polices des cartes sont publiées sous licence SIL Open Font License, qui autorise l'usage commercial, et les illustrations sont créées par xfontat." },
      { question: "Puis-je écrire le prénom en lettres latines ?", answer: "Oui. Tapez le prénom en lettres latines ou arabes. Pour savoir comment s'écrit un prénom en arabe, consultez notre guide des prénoms en arabe." },
    ],
  },
};

type OccasionCopy = Pick<Occasion, "name" | "title" | "heading" | "description" | "intro" | "messages" | "defaultNote" | "greetings">;

const OCCASION_COPY: Record<"en" | "fr", Record<string, OccasionCopy>> = {
  en: {
    ramadan: {
      name: "Ramadan",
      title: "Ramadan Mubarak Card with Name — Free Arabic Card | xfontat",
      heading: "Ramadan Mubarak cards with your name",
      description: "Make a Ramadan Mubarak card with a name and an Arabic calligraphy greeting. Pick a template and download it for WhatsApp, Instagram or stories.",
      intro: "Type your name or the name of the person you are greeting, choose a template and an Arabic calligraphy font, and download a Ramadan card ready to share.",
      messages: ["رمضان كريم", "رمضان مبارك", "Ramadan Mubarak", "Ramadan Kareem"],
      defaultNote: "Wishing you a blessed Ramadan",
      greetings: [
        "رمضان كريم (Ramadan Kareem): “generous Ramadan”, the most common Ramadan greeting.",
        "رمضان مبارك (Ramadan Mubarak): “blessed Ramadan”.",
        "مبارك عليكم الشهر (Mubarak alaykum al-shahr): “may the month be blessed for you”.",
        "كل عام وأنتم بخير (Kul aam wa antum bikhair): “may you be well every year”, said for every holiday.",
      ],
    },
    "eid-al-fitr": {
      name: "Eid al-Fitr",
      title: "Eid Mubarak Card with Name — Free Eid al-Fitr Cards | xfontat",
      heading: "Eid al-Fitr cards with your name",
      description: "Eid Mubarak cards with a name and Arabic calligraphy, in classic and modern templates, ready to download and share on WhatsApp and Instagram.",
      intro: "Send Eid al-Fitr wishes to family and friends with a card that carries their name and an Eid Mubarak greeting in Arabic calligraphy.",
      messages: ["عيد مبارك", "عيد سعيد", "Eid Mubarak", "Happy Eid"],
      defaultNote: "May Allah accept from us and from you",
      greetings: [
        "عيد مبارك (Eid Mubarak): “blessed Eid”.",
        "عيد سعيد (Eid Saeed): “happy Eid”.",
        "تقبل الله منا ومنكم (Taqabbal Allahu minna wa minkum): “may God accept our good deeds and yours”.",
        "من العايدين الفايزين (Min al-aaidin al-faizin): “may you be among those who celebrate again and succeed”.",
      ],
    },
    "eid-al-adha": {
      name: "Eid al-Adha",
      title: "Eid al-Adha Mubarak Card with Name — Free Cards | xfontat",
      heading: "Eid al-Adha cards with your name",
      description: "Design an Eid al-Adha Mubarak card with a name and an Arabic calligraphy greeting, then download it as an image ready to share.",
      intro: "Eid al-Adha cards in Islamic and modern styles: type the name, choose the greeting and download a high-quality image.",
      messages: ["عيد أضحى مبارك", "عيدكم مبارك", "Eid al-Adha Mubarak", "Eid Mubarak"],
      defaultNote: "Wishing you and your family a blessed Eid",
      greetings: [
        "عيد أضحى مبارك (Eid Adha Mubarak): “blessed Eid al-Adha”.",
        "عيدكم مبارك (Eidukum Mubarak): “may your Eid be blessed”.",
        "تقبل الله طاعتكم (Taqabbal Allahu ta'atakum): “may God accept your worship”.",
        "كل عام وأنتم بخير (Kul aam wa antum bikhair): “may you be well every year”.",
      ],
    },
    "hijri-new-year": {
      name: "Islamic New Year",
      title: "Islamic New Year Card with Name — Free Hijri Cards | xfontat",
      heading: "Islamic New Year cards with your name",
      description: "Hijri New Year greeting cards with a name and Arabic calligraphy, ready to download and share.",
      intro: "Welcome the new Hijri year with a greeting card that carries your name or the name of someone you love.",
      messages: ["عام هجري سعيد", "كل عام وأنتم بخير", "Happy Hijri New Year", "Happy Islamic New Year"],
      defaultNote: "May this year bring you peace",
      greetings: [
        "عام هجري سعيد (Aam Hijri Saeed): “happy Hijri year”.",
        "سنة هجرية مباركة (Sana Hijriya Mubaraka): “blessed Hijri year”.",
        "كل عام وأنتم بخير (Kul aam wa antum bikhair): “may you be well every year”.",
      ],
    },
    wedding: {
      name: "Wedding",
      title: "Arabic Wedding Card with the Couple's Names — Free | xfontat",
      heading: "Arabic wedding cards with the couple's names",
      description: "Make a wedding congratulations card with the couple's names and an Arabic calligraphy blessing, then download it to share.",
      intro: "Type the couple's names, such as “Ahmed & Sara”, and choose an elegant template to congratulate them.",
      messages: ["بارك الله لكما", "ألف مبروك", "Happy Wedding", "Congratulations"],
      defaultNote: "Wishing you a lifetime of love",
      greetings: [
        "بارك الله لكما وبارك عليكما وجمع بينكما في خير (Barakallahu lakuma wa baraka alaykuma wa jama'a baynakuma fi khair): “may God bless you both and unite you in goodness”, the traditional Islamic wedding blessing.",
        "ألف مبروك (Alf mabrouk): “a thousand congratulations”.",
        "بالرفاء والبنين (Bil-rifa' wal-banin): “with harmony and children”, a classic Arabic wedding wish.",
      ],
    },
    newborn: {
      name: "New baby",
      title: "New Baby Card with Name in Arabic — Free Design | xfontat",
      heading: "New baby cards with the baby's name",
      description: "Congratulations cards for a new baby with the baby's name and an Arabic calligraphy greeting, in colours for boys and girls.",
      intro: "Type the baby's name and choose a soft template to congratulate the parents.",
      messages: ["مبارك المولود", "أهلاً بالمولود", "Welcome Baby", "Congratulations"],
      defaultNote: "Welcome to the world, little one",
      greetings: [
        "مبارك المولود (Mabrouk al-mawloud): “congratulations on the baby”.",
        "بورك لكم في الموهوب وشكرتم الواهب (Burika lakum fil-mawhub wa shakartum al-wahib): “may the gift be blessed for you, and may you thank the Giver”, a traditional greeting for a newborn.",
        "جعله الله قرة عين لكم (Ja'alahu Allahu qurrata 'aynin lakum): “may God make the baby the joy of your eyes”.",
      ],
    },
    graduation: {
      name: "Graduation",
      title: "Graduation Card with Name — Free Arabic Design | xfontat",
      heading: "Graduation cards with your name",
      description: "Design a graduation card with the graduate's name and an Arabic calligraphy greeting, then download it as an image to share.",
      intro: "Celebrate a graduate with a card that carries their name and a special congratulations message.",
      messages: ["مبروك التخرج", "ألف مبروك النجاح", "Happy Graduation", "Congratulations"],
      defaultNote: "So proud of you",
      greetings: [
        "مبروك التخرج (Mabrouk al-takharruj): “congratulations on graduating”.",
        "ألف مبروك النجاح (Alf mabrouk al-najah): “many congratulations on your success”.",
        "عقبال أعلى المراتب ('Uqbal a'la al-maratib): “here's to the highest ranks next”.",
      ],
    },
    birthday: {
      name: "Birthday",
      title: "Happy Birthday Card with Name in Arabic — Free | xfontat",
      heading: "Birthday cards with a name",
      description: "Birthday cards with a name, Arabic calligraphy and bright colours, ready to download and share.",
      intro: "Type the birthday person's name and choose a cheerful template to wish them a happy birthday.",
      messages: ["عيد ميلاد سعيد", "كل عام وأنت بخير", "Happy Birthday", "Many Happy Returns"],
      defaultNote: "Wishing you a wonderful year",
      greetings: [
        "عيد ميلاد سعيد (Eid milad saeed): “happy birthday”.",
        "كل عام وأنت بخير (Kul aam wa anta bikhair): “may you be well every year”, said for birthdays and holidays.",
        "عقبال مئة عام ('Uqbal mi'at aam): “may you reach a hundred”.",
      ],
    },
  },
  fr: {
    ramadan: {
      name: "Ramadan",
      title: "Carte Ramadan Moubarak avec prénom — gratuite | xfontat",
      heading: "Cartes Ramadan Moubarak avec votre prénom",
      description: "Créez une carte Ramadan Moubarak avec un prénom et un vœu en calligraphie arabe, puis téléchargez-la pour WhatsApp, Instagram ou en story.",
      intro: "Tapez votre prénom ou celui de la personne à qui vous écrivez, choisissez un modèle et une police calligraphique, puis téléchargez une carte prête à partager.",
      messages: ["رمضان كريم", "رمضان مبارك", "Ramadan Moubarak", "Ramadan Karim"],
      defaultNote: "Je vous souhaite un Ramadan béni",
      greetings: [
        "رمضان كريم (Ramadan Karim) : « Ramadan généreux », le vœu le plus courant.",
        "رمضان مبارك (Ramadan Moubarak) : « Ramadan béni ».",
        "مبارك عليكم الشهر (Moubarak 'alaykoum ach-chahr) : « que le mois vous soit béni ».",
        "كل عام وأنتم بخير (Koullou 'am wa antoum bikhayr) : « que chaque année vous trouve en bonne santé », dit à chaque fête.",
      ],
    },
    "eid-al-fitr": {
      name: "Aïd el-Fitr",
      title: "Carte Aïd Moubarak avec prénom — Aïd el-Fitr gratuite | xfontat",
      heading: "Cartes de l'Aïd el-Fitr avec votre prénom",
      description: "Cartes Aïd Moubarak avec prénom et calligraphie arabe, en modèles classiques ou modernes, à télécharger et partager sur WhatsApp et Instagram.",
      intro: "Souhaitez l'Aïd el-Fitr à vos proches avec une carte qui porte leur prénom et un vœu Aïd Moubarak en calligraphie arabe.",
      messages: ["عيد مبارك", "عيد سعيد", "Aïd Moubarak", "Bonne fête de l'Aïd"],
      defaultNote: "Qu'Allah accepte de nous et de vous",
      greetings: [
        "عيد مبارك (Aïd Moubarak) : « Aïd béni ».",
        "عيد سعيد (Aïd Saïd) : « bonne fête ».",
        "تقبل الله منا ومنكم (Taqabbal Allahou minna wa minkoum) : « qu'Allah accepte nos bonnes actions et les vôtres ».",
        "من العايدين الفايزين (Min al-'aïdin al-faïzin) : « soyez de ceux qui fêteront encore et réussiront ».",
      ],
    },
    "eid-al-adha": {
      name: "Aïd el-Kebir",
      title: "Carte Aïd el-Kebir avec prénom — Aïd el-Adha gratuite | xfontat",
      heading: "Cartes de l'Aïd el-Adha avec votre prénom",
      description: "Créez une carte Aïd el-Adha (Aïd el-Kebir) avec un prénom et un vœu en calligraphie arabe, puis téléchargez-la prête à partager.",
      intro: "Cartes de l'Aïd el-Kebir en style islamique ou moderne : tapez le prénom, choisissez le vœu et téléchargez une image de qualité.",
      messages: ["عيد أضحى مبارك", "عيدكم مبارك", "Aïd Moubarak", "Bonne fête de l'Aïd"],
      defaultNote: "Bonne fête à vous et à votre famille",
      greetings: [
        "عيد أضحى مبارك (Aïd Adha Moubarak) : « Aïd el-Adha béni ».",
        "عيدكم مبارك ('Idoukoum Moubarak) : « que votre fête soit bénie ».",
        "تقبل الله طاعتكم (Taqabbal Allahou ta'atakoum) : « qu'Allah accepte vos actes d'adoration ».",
        "كل عام وأنتم بخير (Koullou 'am wa antoum bikhayr) : « que chaque année vous trouve en bonne santé ».",
      ],
    },
    "hijri-new-year": {
      name: "Nouvel an hégirien",
      title: "Carte Nouvel an hégirien avec prénom — gratuite | xfontat",
      heading: "Cartes du Nouvel an hégirien avec votre prénom",
      description: "Cartes de vœux pour le Nouvel an islamique avec prénom et calligraphie arabe, à télécharger et partager.",
      intro: "Accueillez la nouvelle année hégirienne avec une carte qui porte votre prénom ou celui d'un proche.",
      messages: ["عام هجري سعيد", "كل عام وأنتم بخير", "Bonne année hégirienne", "Bonne année"],
      defaultNote: "Que cette année vous apporte la paix",
      greetings: [
        "عام هجري سعيد ('Am hijri sa'id) : « bonne année hégirienne ».",
        "سنة هجرية مباركة (Sana hijriya moubaraka) : « année hégirienne bénie ».",
        "كل عام وأنتم بخير (Koullou 'am wa antoum bikhayr) : « que chaque année vous trouve en bonne santé ».",
      ],
    },
    wedding: {
      name: "Mariage",
      title: "Carte de mariage arabe avec prénoms des mariés | xfontat",
      heading: "Cartes de mariage arabes avec les prénoms des mariés",
      description: "Créez une carte de félicitations de mariage avec les prénoms des mariés et une bénédiction en calligraphie arabe, puis téléchargez-la.",
      intro: "Tapez les prénoms des mariés, par exemple « Ahmed & Sara », et choisissez un modèle élégant pour les féliciter.",
      messages: ["بارك الله لكما", "ألف مبروك", "Félicitations", "Heureux mariage"],
      defaultNote: "Tous nos vœux de bonheur",
      greetings: [
        "بارك الله لكما وبارك عليكما وجمع بينكما في خير (Barakallahou lakouma wa baraka 'alaykouma wa jama'a baynakouma fi khayr) : « qu'Allah vous bénisse et vous unisse dans le bien », la bénédiction traditionnelle du mariage.",
        "ألف مبروك (Alf mabrouk) : « mille félicitations ».",
        "بالرفاء والبنين (Bir-rifa' wal-banin) : « dans l'harmonie et avec des enfants », un vœu arabe classique.",
      ],
    },
    newborn: {
      name: "Naissance",
      title: "Carte de naissance avec prénom en arabe — gratuite | xfontat",
      heading: "Cartes de naissance avec le prénom du bébé",
      description: "Cartes de félicitations pour une naissance avec le prénom du bébé et un vœu en calligraphie arabe, en couleurs pour garçons et filles.",
      intro: "Tapez le prénom du bébé et choisissez un modèle doux pour féliciter les parents.",
      messages: ["مبارك المولود", "أهلاً بالمولود", "Bienvenue bébé", "Félicitations"],
      defaultNote: "Bienvenue au monde, petit trésor",
      greetings: [
        "مبارك المولود (Mabrouk al-mawloud) : « félicitations pour le bébé ».",
        "بورك لكم في الموهوب وشكرتم الواهب (Bourika lakoum fil-mawhoub wa chakartoum al-wahib) : « que le don vous soit béni et que vous remerciiez le Donateur », vœu traditionnel de naissance.",
        "جعله الله قرة عين لكم (Ja'alahou Allahou qourrata 'aynin lakoum) : « qu'Allah en fasse la joie de vos yeux ».",
      ],
    },
    graduation: {
      name: "Diplôme",
      title: "Carte de félicitations diplôme avec prénom — gratuite | xfontat",
      heading: "Cartes de diplôme avec votre prénom",
      description: "Créez une carte de félicitations pour un diplôme avec le prénom du diplômé et un vœu en calligraphie arabe, puis téléchargez-la.",
      intro: "Célébrez un diplômé avec une carte qui porte son prénom et un message de félicitations.",
      messages: ["مبروك التخرج", "ألف مبروك النجاح", "Félicitations", "Bravo diplômé"],
      defaultNote: "Tellement fiers de toi",
      greetings: [
        "مبروك التخرج (Mabrouk at-takharroj) : « félicitations pour ton diplôme ».",
        "ألف مبروك النجاح (Alf mabrouk an-najah) : « mille félicitations pour ta réussite ».",
        "عقبال أعلى المراتب ('Ouqbal a'la al-maratib) : « et à plus haut encore ».",
      ],
    },
    birthday: {
      name: "Anniversaire",
      title: "Carte d'anniversaire avec prénom en arabe — gratuite | xfontat",
      heading: "Cartes d'anniversaire avec prénom",
      description: "Cartes d'anniversaire avec prénom, calligraphie arabe et couleurs vives, à télécharger et partager.",
      intro: "Tapez le prénom de la personne fêtée et choisissez un modèle joyeux pour lui souhaiter un bon anniversaire.",
      messages: ["عيد ميلاد سعيد", "كل عام وأنت بخير", "Joyeux anniversaire", "Bon anniversaire"],
      defaultNote: "Je te souhaite une merveilleuse année",
      greetings: [
        "عيد ميلاد سعيد ('Id milad sa'id) : « joyeux anniversaire ».",
        "كل عام وأنت بخير (Koullou 'am wa anta bikhayr) : « que chaque année te trouve en bonne santé », dit aux anniversaires et aux fêtes.",
        "عقبال مئة عام ('Ouqbal mi'at 'am) : « jusqu'à cent ans ».",
      ],
    },
  },
};

function occasionFaqs(locale: "en" | "fr", name: string) {
  return locale === "fr"
    ? [
        { question: `Comment créer une carte ${name} avec un prénom ?`, answer: "Choisissez un modèle, tapez le prénom (et l'expéditeur si vous voulez), choisissez la formule arabe et la police, puis téléchargez la carte." },
        { question: "Les cartes sont-elles gratuites ?", answer: "Oui. L'outil est gratuit, fonctionne dans le navigateur sans inscription, et le prénom saisi n'est jamais envoyé à un serveur." },
        { question: "Quel est le format des cartes ?", answer: "Carré 1080×1080 pour WhatsApp et Instagram, ou story 1080×1920 pour les statuts et stories." },
      ]
    : [
        { question: `How do I make a ${name} card with a name?`, answer: "Choose a template, type the name (and the sender if you like), pick the Arabic greeting and font, then download the card." },
        { question: "Are the cards free?", answer: "Yes. The tool is free, runs in your browser without sign-up, and the name you type is never sent to a server." },
        { question: "What size are the cards?", answer: "Square 1080×1080 for WhatsApp and Instagram, or story 1080×1920 for status updates and stories." },
      ];
}

// The occasion with its text in the requested language; templates and fonts
// are shared.
export function localizeOccasion(occasion: Occasion, locale: CardLocale): Occasion {
  if (locale === "ar") return occasion;
  const copy = OCCASION_COPY[locale][occasion.slug];
  if (!copy) return occasion;
  return { ...occasion, ...copy, faqs: occasionFaqs(locale, copy.name) };
}

const TEMPLATE_LABELS: Record<string, [string, string]> = {
  "ramadan-night": ["Ramadan night", "Nuit de Ramadan"],
  "ramadan-emerald": ["Gold pattern", "Motif doré"],
  "fitr-night": ["Eid night", "Nuit de l'Aïd"],
  "fitr-royal": ["Royal gold", "Or royal"],
  "adha-emerald": ["Gold pattern", "Motif doré"],
  "adha-night": ["Eid night", "Nuit de l'Aïd"],
  "hijri-night": ["New crescent", "Nouveau croissant"],
  "hijri-emerald": ["Gold pattern", "Motif doré"],
  "wedding-blush": ["Soft roses", "Roses douces"],
  "wedding-gold": ["Luxury gold", "Or luxueux"],
  "newborn-blue": ["Blue sky", "Ciel bleu"],
  "newborn-pink": ["Soft pink", "Rose doux"],
  "grad-navy": ["Navy and gold", "Marine et or"],
  "grad-emerald": ["Gold frame", "Cadre doré"],
  "bday-party": ["Party", "Fête"],
  "bday-light": ["Balloons", "Ballons"],
};

export function templateLabel(id: string, arabicLabel: string, locale: CardLocale): string {
  if (locale === "ar") return arabicLabel;
  const labels = TEMPLATE_LABELS[id] ?? ["Modern", "Moderne"];
  return locale === "fr" ? labels[1] : labels[0];
}

const FONT_LABELS: Record<CardFontId, string> = {
  thuluth: "Thuluth — Layla",
  gulzar: "Nastaliq — Gulzar",
  rakkas: "Rakkas",
  katibeh: "Katibeh",
  jomhuria: "Jomhuria",
  reem: "Reem Kufi",
};

export function cardFontLabel(id: CardFontId, arabicLabel: string, locale: CardLocale): string {
  return locale === "ar" ? arabicLabel : FONT_LABELS[id];
}

export const CARD_UI = {
  ar: {
    home: "الرئيسية", cards: "بطاقات التهنئة", occasions: "المناسبات", cardsFor: (name: string) => `بطاقات ${name}`,
    yourName: "اسمك هنا", couple: "أحمد وسارة", chooseTemplate: "اختر القالب", name: "الاسم", coupleNames: "اسم العروسين",
    namePlaceholder: "اكتب الاسم", from: "من (اختياري)", fromPlaceholder: "مثلاً: من عائلة أحمد", message: "العبارة",
    otherMessage: "عبارة أخرى…", customPlaceholder: "اكتب عبارتك", note: "سطر إضافي", messageFont: "خط العبارة", nameFont: "خط الاسم",
    size: "المقاس", square: "مربع — واتساب وإنستغرام", story: "ستوري — الحالات", download: "تحميل البطاقة", share: "مشاركة",
    renderError: "تعذّر رسم البطاقة", renderErrorHint: "حدّث الصفحة وحاول مرة أخرى.", greetings: (name: string) => `عبارات تهنئة ${name}`,
    faq: "أسئلة شائعة", other: "بطاقات لمناسبات أخرى", preview: (heading: string) => `معاينة ${heading}`,
    notFound: "لم نجد هذه المناسبة.", allCards: "كل البطاقات",
  },
  en: {
    home: "Home", cards: "Greeting cards", occasions: "Occasions", cardsFor: (name: string) => `${name} cards`,
    yourName: "Your Name", couple: "Ahmed & Sara", chooseTemplate: "Choose a template", name: "Name", coupleNames: "The couple's names",
    namePlaceholder: "Type the name", from: "From (optional)", fromPlaceholder: "e.g. From the Ahmed family", message: "Greeting",
    otherMessage: "Other greeting…", customPlaceholder: "Type your greeting", note: "Extra line", messageFont: "Greeting font", nameFont: "Name font",
    size: "Size", square: "Square — WhatsApp & Instagram", story: "Story — status updates", download: "Download card", share: "Share",
    renderError: "Could not draw the card", renderErrorHint: "Refresh the page and try again.", greetings: (name: string) => `${name} greetings in Arabic`,
    faq: "Frequently asked questions", other: "Cards for other occasions", preview: (heading: string) => `Preview: ${heading}`,
    notFound: "We could not find this occasion.", allCards: "All cards",
  },
  fr: {
    home: "Accueil", cards: "Cartes de vœux", occasions: "Occasions", cardsFor: (name: string) => `Cartes ${name}`,
    yourName: "Votre prénom", couple: "Ahmed & Sara", chooseTemplate: "Choisissez un modèle", name: "Prénom", coupleNames: "Prénoms des mariés",
    namePlaceholder: "Tapez le prénom", from: "De la part de (facultatif)", fromPlaceholder: "ex. De la famille Ahmed", message: "Vœu",
    otherMessage: "Autre vœu…", customPlaceholder: "Tapez votre vœu", note: "Ligne supplémentaire", messageFont: "Police du vœu", nameFont: "Police du prénom",
    size: "Format", square: "Carré — WhatsApp et Instagram", story: "Story — statuts", download: "Télécharger la carte", share: "Partager",
    renderError: "Impossible de dessiner la carte", renderErrorHint: "Actualisez la page et réessayez.", greetings: (name: string) => `Vœux en arabe : ${name}`,
    faq: "Questions fréquentes", other: "Cartes pour d'autres occasions", preview: (heading: string) => `Aperçu : ${heading}`,
    notFound: "Occasion introuvable.", allCards: "Toutes les cartes",
  },
} satisfies Record<CardLocale, Record<string, unknown>>;
