// Well-known Arabic words and phrases for the "in Arabic" pages.

export type PhraseKind = "religious" | "word" | "greeting";

export type ArabicPhrase = {
  slug: string;
  latin: string; // how English speakers usually write it
  arabic: string;
  say: string; // pronunciation guide
  kind: PhraseKind;
  en: { meaning: string; usage: string };
  fr: { meaning: string; usage: string };
};

export const arabicPhrases: ArabicPhrase[] = [
  {
    slug: "allah", latin: "Allah", arabic: "الله", say: "al-LAH", kind: "religious",
    en: { meaning: "God. Arabic-speaking Muslims, Christians and Jews all use this word for God.", usage: "Seen on wall art, mosque decoration and jewellery. Calligraphers often write it with the shadda and a small alif above the lam." },
    fr: { meaning: "Dieu. Les musulmans, chrétiens et juifs arabophones emploient tous ce mot pour désigner Dieu.", usage: "Présent dans les tableaux, la décoration des mosquées et les bijoux. Les calligraphes l'écrivent souvent avec la chadda et un petit alif au-dessus du lam." },
  },
  {
    slug: "bismillah", latin: "Bismillah", arabic: "بسم الله الرحمن الرحيم", say: "bis-mil-LAH ir-rah-MAN ir-ra-HEEM", kind: "religious",
    en: { meaning: "In the name of God, the Most Gracious, the Most Merciful. The short form \"Bismillah\" means \"in the name of God\".", usage: "Said before eating, travelling or starting any task, and written at the top of letters and books." },
    fr: { meaning: "Au nom de Dieu, le Tout Miséricordieux, le Très Miséricordieux. La forme courte « Bismillah » signifie « au nom de Dieu ».", usage: "Prononcée avant de manger, de voyager ou de commencer une tâche, et écrite en tête des lettres et des livres." },
  },
  {
    slug: "alhamdulillah", latin: "Alhamdulillah", arabic: "الحمد لله", say: "al-ham-du-lil-LAH", kind: "religious",
    en: { meaning: "Praise be to God; thank God.", usage: "Said to express gratitude, in good news and in everyday answers such as \"I'm fine, alhamdulillah\"." },
    fr: { meaning: "Louange à Dieu ; Dieu merci.", usage: "Exprime la gratitude, après une bonne nouvelle ou dans une réponse comme « ça va, al-hamdoulillah »." },
  },
  {
    slug: "inshallah", latin: "Inshallah", arabic: "إن شاء الله", say: "in-SHA-al-lah", kind: "religious",
    en: { meaning: "If God wills.", usage: "Said when speaking about the future, from plans for tomorrow to long-term hopes." },
    fr: { meaning: "Si Dieu le veut.", usage: "Se dit en parlant de l'avenir, d'un projet pour demain comme d'un espoir lointain." },
  },
  {
    slug: "mashallah", latin: "Mashallah", arabic: "ما شاء الله", say: "MA-sha-al-lah", kind: "religious",
    en: { meaning: "What God has willed.", usage: "Said to admire something good, such as a child, a new home or an achievement, without envy." },
    fr: { meaning: "Ce que Dieu a voulu.", usage: "Se dit pour admirer une chose belle, un enfant, une maison ou une réussite, sans envie." },
  },
  {
    slug: "subhanallah", latin: "Subhanallah", arabic: "سبحان الله", say: "sub-HA-nal-lah", kind: "religious",
    en: { meaning: "Glory be to God.", usage: "Said in wonder at something beautiful or surprising, and repeated in prayer." },
    fr: { meaning: "Gloire à Dieu.", usage: "Exprime l'émerveillement devant une chose belle ou surprenante, et se répète dans la prière." },
  },
  {
    slug: "allahu-akbar", latin: "Allahu Akbar", arabic: "الله أكبر", say: "al-LA-hu AK-bar", kind: "religious",
    en: { meaning: "God is the greatest.", usage: "Opens the call to prayer and each prayer, and is said at moments of joy and celebration." },
    fr: { meaning: "Dieu est le plus grand.", usage: "Ouvre l'appel à la prière et chaque prière, et se dit dans les moments de joie et de fête." },
  },
  {
    slug: "shahada", latin: "La ilaha illallah", arabic: "لا إله إلا الله", say: "la i-LA-ha il-lal-LAH", kind: "religious",
    en: { meaning: "There is no god but God. The first part of the Shahada, the Muslim declaration of faith.", usage: "A central phrase of Islam, often written in square Kufic and on flags and wall art." },
    fr: { meaning: "Il n'y a de dieu que Dieu. Première partie de la chahada, la profession de foi musulmane.", usage: "Phrase centrale de l'islam, souvent écrite en coufique carré, sur des drapeaux et des tableaux." },
  },
  {
    slug: "astaghfirullah", latin: "Astaghfirullah", arabic: "أستغفر الله", say: "as-tagh-fi-rul-LAH", kind: "religious",
    en: { meaning: "I seek forgiveness from God.", usage: "Said after a mistake, when hearing something wrong, and repeated in prayer." },
    fr: { meaning: "Je demande pardon à Dieu.", usage: "Se dit après une faute, en entendant quelque chose de mal, et se répète dans la prière." },
  },
  {
    slug: "assalamu-alaikum", latin: "Assalamu Alaikum", arabic: "السلام عليكم", say: "as-sa-LA-mu a-LAY-kum", kind: "greeting",
    en: { meaning: "Peace be upon you. The reply is \"Wa alaikum assalam\" (and upon you be peace).", usage: "The standard greeting across the Arab and Muslim world." },
    fr: { meaning: "Que la paix soit sur vous. On répond « Wa alaykoum as-salam » (et sur vous la paix).", usage: "La salutation habituelle dans le monde arabe et musulman." },
  },
  {
    slug: "jazakallah", latin: "Jazakallah Khair", arabic: "جزاك الله خيرا", say: "ja-za-KAL-la-hu KHAY-ran", kind: "religious",
    en: { meaning: "May God reward you with good.", usage: "A warm way to say thank you." },
    fr: { meaning: "Que Dieu te récompense par le bien.", usage: "Une manière chaleureuse de dire merci." },
  },
  {
    slug: "ramadan-mubarak", latin: "Ramadan Mubarak", arabic: "رمضان مبارك", say: "ra-ma-DAN mu-BA-rak", kind: "greeting",
    en: { meaning: "Blessed Ramadan.", usage: "A greeting for the month of Ramadan; \"Ramadan Kareem\" (generous Ramadan) is also common." },
    fr: { meaning: "Ramadan béni.", usage: "Vœu pour le mois de ramadan ; « Ramadan Karim » (ramadan généreux) est aussi courant." },
  },
  {
    slug: "eid-mubarak", latin: "Eid Mubarak", arabic: "عيد مبارك", say: "EED mu-BA-rak", kind: "greeting",
    en: { meaning: "Blessed Eid.", usage: "The greeting for Eid al-Fitr and Eid al-Adha, often written on cards and banners." },
    fr: { meaning: "Bonne fête de l'Aïd.", usage: "Vœu pour l'Aïd el-Fitr et l'Aïd el-Adha, souvent écrit sur les cartes et banderoles." },
  },
  {
    slug: "habibi", latin: "Habibi", arabic: "حبيبي", say: "ha-BEE-bee", kind: "word",
    en: { meaning: "My love, my dear (said to a man or boy; widely used for anyone in everyday speech).", usage: "Used with friends, family and partners, and in countless Arabic songs." },
    fr: { meaning: "Mon amour, mon chéri (au masculin ; employé pour tout le monde dans la langue courante).", usage: "S'emploie entre amis, en famille et en couple, et dans d'innombrables chansons arabes." },
  },
  {
    slug: "habibti", latin: "Habibti", arabic: "حبيبتي", say: "ha-BEEB-tee", kind: "word",
    en: { meaning: "My love, my dear (said to a woman or girl).", usage: "The feminine form of habibi." },
    fr: { meaning: "Mon amour, ma chérie (au féminin).", usage: "Forme féminine de habibi." },
  },
  {
    slug: "love", latin: "Love (Hubb)", arabic: "حب", say: "HUBB", kind: "word",
    en: { meaning: "Love. Arabic has many words for degrees of love; hubb is the general one.", usage: "Popular for tattoos and jewellery because it is short and well balanced in calligraphy." },
    fr: { meaning: "Amour. L'arabe possède de nombreux mots pour les degrés de l'amour ; houbb est le plus général.", usage: "Apprécié pour les tatouages et les bijoux, car court et harmonieux en calligraphie." },
  },
  {
    slug: "peace", latin: "Peace (Salam)", arabic: "سلام", say: "sa-LAM", kind: "word",
    en: { meaning: "Peace; also used to mean \"hello\".", usage: "Common in wall art and as a short greeting." },
    fr: { meaning: "Paix ; s'emploie aussi pour dire « bonjour ».", usage: "Fréquent dans la décoration et comme salutation courte." },
  },
  {
    slug: "hope", latin: "Hope (Amal)", arabic: "أمل", say: "A-mal", kind: "word",
    en: { meaning: "Hope. Also a popular girl's name.", usage: "A short word that suits small tattoos and pendants." },
    fr: { meaning: "Espoir. C'est aussi un prénom féminin courant.", usage: "Mot court, adapté aux petits tatouages et pendentifs." },
  },
  {
    slug: "sabr", latin: "Patience (Sabr)", arabic: "صبر", say: "SABR", kind: "word",
    en: { meaning: "Patience, endurance, perseverance through hardship.", usage: "A meaningful word in Islamic tradition and a frequent tattoo choice." },
    fr: { meaning: "Patience, endurance, persévérance dans l'épreuve.", usage: "Mot important dans la tradition islamique et choix fréquent de tatouage." },
  },
  {
    slug: "faith", latin: "Faith (Iman)", arabic: "إيمان", say: "ee-MAN", kind: "word",
    en: { meaning: "Faith, belief. Also a girl's name.", usage: "Used in calligraphy art and as a name." },
    fr: { meaning: "Foi, croyance. C'est aussi un prénom féminin.", usage: "Employé en calligraphie et comme prénom." },
  },
  {
    slug: "strength", latin: "Strength (Quwwa)", arabic: "قوة", say: "QUW-wa", kind: "word",
    en: { meaning: "Strength, power.", usage: "A popular choice for motivational tattoos." },
    fr: { meaning: "Force, puissance.", usage: "Choix courant pour les tatouages de motivation." },
  },
  {
    slug: "freedom", latin: "Freedom (Hurriya)", arabic: "حرية", say: "hur-REE-ya", kind: "word",
    en: { meaning: "Freedom, liberty.", usage: "Seen in posters, murals and tattoos." },
    fr: { meaning: "Liberté.", usage: "Présent sur les affiches, les fresques et les tatouages." },
  },
  {
    slug: "family", latin: "Family (Aila)", arabic: "عائلة", say: "AA-i-la", kind: "word",
    en: { meaning: "Family.", usage: "Used in home decoration and family tattoos." },
    fr: { meaning: "Famille.", usage: "Utilisé en décoration intérieure et pour les tatouages familiaux." },
  },
  {
    slug: "mother", latin: "Mother (Umm)", arabic: "أمي", say: "UM-mee", kind: "word",
    en: { meaning: "My mother. The word for mother on its own is أم (umm).", usage: "A frequent dedication in tattoos and gifts." },
    fr: { meaning: "Ma mère. Le mot « mère » seul s'écrit أم (oumm).", usage: "Dédicace fréquente pour les tatouages et les cadeaux." },
  },
  {
    slug: "life", latin: "Life (Hayat)", arabic: "حياة", say: "ha-YAT", kind: "word",
    en: { meaning: "Life. Also a girl's name.", usage: "Short and elegant in most calligraphy styles." },
    fr: { meaning: "Vie. C'est aussi un prénom féminin.", usage: "Court et élégant dans la plupart des styles calligraphiques." },
  },
  {
    slug: "dream", latin: "Dream (Hulm)", arabic: "حلم", say: "HULM", kind: "word",
    en: { meaning: "Dream.", usage: "A popular short word for tattoos and decor." },
    fr: { meaning: "Rêve.", usage: "Mot court apprécié pour les tatouages et la décoration." },
  },
  {
    slug: "beautiful", latin: "Beautiful (Jamil)", arabic: "جميل", say: "ja-MEEL", kind: "word",
    en: { meaning: "Beautiful (masculine). The feminine form is جميلة (jamila).", usage: "Used as a compliment and as a name." },
    fr: { meaning: "Beau (masculin). Le féminin est جميلة (jamila).", usage: "S'emploie comme compliment et comme prénom." },
  },
  {
    slug: "thank-you", latin: "Thank you (Shukran)", arabic: "شكرا", say: "SHUK-ran", kind: "greeting",
    en: { meaning: "Thank you.", usage: "The everyday way to say thanks in every Arabic dialect." },
    fr: { meaning: "Merci.", usage: "La façon courante de remercier dans tous les dialectes arabes." },
  },
  {
    slug: "light", latin: "Light (Noor)", arabic: "نور", say: "NOOR", kind: "word",
    en: { meaning: "Light. Also a popular name for girls and boys.", usage: "Common in calligraphy art and jewellery." },
    fr: { meaning: "Lumière. C'est aussi un prénom courant, féminin comme masculin.", usage: "Fréquent dans la calligraphie et les bijoux." },
  },
  {
    slug: "this-too-shall-pass", latin: "This too shall pass", arabic: "هذا أيضا سيمضي", say: "HA-dha AY-dan sa-yam-DEE", kind: "word",
    en: { meaning: "This too shall pass.", usage: "One of the most requested tattoo phrases in Arabic." },
    fr: { meaning: "Cela aussi passera.", usage: "L'une des phrases de tatouage en arabe les plus demandées." },
  },
];

export function getArabicPhrase(slug: string): ArabicPhrase | undefined {
  return arabicPhrases.find((phrase) => phrase.slug === slug);
}

export const PHRASE_PATHS = { ar: "/ibarat", en: "/en/arabic-phrases", fr: "/fr/expressions-arabes" } as const;
export const phrasePath = (locale: "ar" | "en" | "fr", slug: string) => `${PHRASE_PATHS[locale]}/${slug}`;
