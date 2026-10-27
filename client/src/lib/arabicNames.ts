// Common first names written in Arabic, for the "Name in Arabic" pages.
// Western names are spelled phonetically, the way Arabic speakers write them;
// `equiv` gives the traditional Arabic form of the same name where one exists.

export type Origin =
  | "arabic" | "hebrew" | "greek" | "latin" | "germanic" | "english" | "french"
  | "persian" | "celtic" | "italian" | "spanish" | "aramaic" | "sanskrit" | "turkish" | "slavic";

export type ArabicName = {
  slug: string;
  latin: string;
  arabic: string;
  gender: "m" | "f";
  origin: Origin;
  en: string; // meaning
  fr: string;
  aliases?: string[];
  equiv?: [string, string]; // [Arabic, Latin]
};

type Row = [string, string, "m" | "f", Origin, string, string, string[]?, [string, string]?];

export const originLabels: Record<Origin, { en: string; fr: string }> = {
  arabic: { en: "Arabic", fr: "arabe" },
  hebrew: { en: "Hebrew", fr: "hébraïque" },
  greek: { en: "Greek", fr: "grecque" },
  latin: { en: "Latin", fr: "latine" },
  germanic: { en: "Germanic", fr: "germanique" },
  english: { en: "English", fr: "anglaise" },
  french: { en: "French", fr: "française" },
  persian: { en: "Persian", fr: "persane" },
  celtic: { en: "Celtic", fr: "celtique" },
  italian: { en: "Italian", fr: "italienne" },
  spanish: { en: "Spanish", fr: "espagnole" },
  aramaic: { en: "Aramaic", fr: "araméenne" },
  sanskrit: { en: "Sanskrit", fr: "sanskrite" },
  turkish: { en: "Turkish", fr: "turque" },
  slavic: { en: "Slavic", fr: "slave" },
};

// [latin, arabic, gender, origin, meaning en, meaning fr, aliases, equiv]
const ROWS: Row[] = [
  // Arabic names, female
  ["Sarah", "سارة", "f", "hebrew", "princess, noblewoman", "princesse, noble dame", ["Sara"]],
  ["Maryam", "مريم", "f", "hebrew", "the Arabic form of Mary; often read as \"beloved\" or \"wished-for child\"", "forme arabe de Marie ; souvent comprise comme « aimée » ou « enfant désirée »", ["Mariam", "Meryem"]],
  ["Fatima", "فاطمة", "f", "arabic", "one who weans; the name of the Prophet's daughter", "celle qui sèvre ; nom de la fille du Prophète", ["Fatimah", "Fatma"]],
  ["Aisha", "عائشة", "f", "arabic", "alive, living, full of life", "vivante, pleine de vie", ["Ayesha", "Aicha", "Aysha"]],
  ["Khadija", "خديجة", "f", "arabic", "early-born child; the name of the Prophet's first wife", "enfant née avant terme ; nom de la première épouse du Prophète", ["Khadijah", "Khadidja"]],
  ["Zainab", "زينب", "f", "arabic", "a fragrant flowering plant; also linked to \"adornment of her father\"", "plante parfumée ; aussi rapproché de « parure de son père »", ["Zaynab", "Zeinab"]],
  ["Amina", "آمنة", "f", "arabic", "safe, secure, trustworthy", "en sécurité, digne de confiance", ["Aminah", "Amna"]],
  ["Noor", "نور", "f", "arabic", "light", "lumière", ["Nour", "Nur"]],
  ["Layla", "ليلى", "f", "arabic", "night; the heroine of the classic love story Layla and Majnun", "nuit ; héroïne du célèbre récit d'amour Layla et Majnoun", ["Laila", "Leila", "Leyla", "Lila"]],
  ["Hana", "هناء", "f", "arabic", "bliss, happiness", "bonheur, félicité", ["Hanaa"]],
  ["Jannah", "جنة", "f", "arabic", "garden; paradise", "jardin ; paradis", ["Janna"]],
  ["Amira", "أميرة", "f", "arabic", "princess, leader", "princesse, dirigeante", ["Ameera", "Amirah"]],
  ["Yasmin", "ياسمين", "f", "persian", "jasmine flower", "fleur de jasmin", ["Yasmine", "Jasmine", "Yasmeen"]],
  ["Salma", "سلمى", "f", "arabic", "safe, peaceful", "paisible, en sécurité", ["Selma"]],
  ["Huda", "هدى", "f", "arabic", "right guidance", "bonne direction, guidance", ["Houda"]],
  ["Iman", "إيمان", "f", "arabic", "faith, belief", "foi, croyance", ["Imane"]],
  ["Rania", "رانيا", "f", "arabic", "gazing, one who looks with joy", "celle qui contemple", ["Raniya"]],
  ["Dalia", "داليا", "f", "arabic", "grapevine; also the dahlia flower", "vigne ; aussi la fleur dahlia", ["Dahlia"]],
  ["Lina", "لينا", "f", "arabic", "tender, a young palm tree", "tendre, jeune palmier", ["Leena"]],
  ["Nadia", "نادية", "f", "arabic", "moist with dew; caller", "humide de rosée ; celle qui appelle", ["Nadiya"]],
  ["Samira", "سميرة", "f", "arabic", "a companion in evening conversation", "compagne des conversations du soir", ["Sameera"]],
  ["Zahra", "زهراء", "f", "arabic", "radiant, shining", "radieuse, éclatante", ["Zahraa"]],
  ["Safiya", "صفية", "f", "arabic", "pure, sincere friend", "pure, amie sincère", ["Safia", "Safiyyah"]],
  ["Hafsa", "حفصة", "f", "arabic", "young lioness", "jeune lionne", ["Hafsah"]],
  ["Asma", "أسماء", "f", "arabic", "lofty, eminent", "élevée, éminente", ["Asmaa"]],
  ["Ruqayya", "رقية", "f", "arabic", "gentle, rising", "douce, qui s'élève", ["Ruqaya", "Roqaya"]],
  ["Sumaya", "سمية", "f", "arabic", "high, elevated", "haute, élevée", ["Sumayyah", "Soumaya"]],
  ["Habiba", "حبيبة", "f", "arabic", "beloved, darling", "bien-aimée, chérie", ["Habibah"]],
  ["Malak", "ملاك", "f", "arabic", "angel", "ange", []],
  ["Sana", "سناء", "f", "arabic", "radiance, brilliance", "éclat, splendeur", ["Sanaa"]],
  ["Rahma", "رحمة", "f", "arabic", "mercy, compassion", "miséricorde, compassion", ["Rahmah"]],
  ["Farah", "فرح", "f", "arabic", "joy, happiness", "joie, bonheur", []],
  ["Jamila", "جميلة", "f", "arabic", "beautiful", "belle", ["Jameela", "Djamila"]],
  ["Aaliyah", "عالية", "f", "arabic", "high, exalted", "élevée, sublime", ["Aliya", "Alia"]],
  ["Mona", "منى", "f", "arabic", "wishes, hopes", "souhaits, espoirs", ["Muna"]],
  ["Dina", "دينا", "f", "hebrew", "judged, vindicated", "jugée, justifiée", ["Dinah"]],
  ["Maya", "مايا", "f", "sanskrit", "illusion; also linked to water and Maia, the Greek goddess", "illusion ; aussi associé à l'eau et à Maïa, déesse grecque", ["Maia", "Maïa"]],
  ["Inès", "إيناس", "f", "greek", "pure, holy; in Arabic, \"friendliness\"", "pure, sainte ; en arabe, « convivialité »", ["Ines", "Inas"]],
  ["Nora", "نورا", "f", "latin", "honour; in Arabic, \"light\"", "honneur ; en arabe, « lumière »", ["Norah"]],
  ["Mila", "ميلا", "f", "slavic", "gracious, dear", "gracieuse, chère", []],
  // Arabic names, male
  ["Muhammad", "محمد", "m", "arabic", "praised, praiseworthy", "loué, digne d'éloges", ["Mohammed", "Mohamed", "Mohammad"]],
  ["Ahmed", "أحمد", "m", "arabic", "most praised", "le plus loué", ["Ahmad"]],
  ["Ali", "علي", "m", "arabic", "high, exalted, champion", "élevé, noble, champion", []],
  ["Omar", "عمر", "m", "arabic", "long-lived, flourishing", "qui vit longtemps, florissant", ["Umar", "Omer"]],
  ["Yusuf", "يوسف", "m", "hebrew", "God will increase; the Arabic form of Joseph", "Dieu ajoutera ; forme arabe de Joseph", ["Youssef", "Yousef", "Yousuf"]],
  ["Ibrahim", "إبراهيم", "m", "hebrew", "father of many; the Arabic form of Abraham", "père d'une multitude ; forme arabe d'Abraham", ["Ebrahim", "Brahim"]],
  ["Hamza", "حمزة", "m", "arabic", "strong, steadfast", "fort, ferme", ["Hamzah"]],
  ["Khalid", "خالد", "m", "arabic", "eternal, everlasting", "éternel, immortel", ["Khaled"]],
  ["Hassan", "حسن", "m", "arabic", "good, handsome", "bon, beau", ["Hasan"]],
  ["Hussein", "حسين", "m", "arabic", "good, handsome (diminutive of Hassan)", "bon, beau (diminutif de Hassan)", ["Hussain", "Husayn"]],
  ["Abdullah", "عبد الله", "m", "arabic", "servant of God", "serviteur de Dieu", ["Abdallah"]],
  ["Mustafa", "مصطفى", "m", "arabic", "the chosen one", "l'élu", ["Moustafa", "Mostafa"]],
  ["Bilal", "بلال", "m", "arabic", "moisture, freshness", "fraîcheur, humidité", []],
  ["Zayn", "زين", "m", "arabic", "beauty, grace", "beauté, grâce", ["Zain", "Zayne"]],
  ["Idris", "إدريس", "m", "arabic", "studious; the name of a prophet", "studieux ; nom d'un prophète", ["Idriss"]],
  ["Ismail", "إسماعيل", "m", "hebrew", "God hears; the Arabic form of Ishmael", "Dieu entend ; forme arabe d'Ismaël", ["Ismael", "Ismaël"]],
  ["Musa", "موسى", "m", "hebrew", "drawn out of the water; the Arabic form of Moses", "sauvé des eaux ; forme arabe de Moïse", ["Moussa"]],
  ["Isa", "عيسى", "m", "hebrew", "the Arabic form of Jesus", "forme arabe de Jésus", ["Issa"]],
  ["Tariq", "طارق", "m", "arabic", "the morning star; one who knocks at night", "l'étoile du matin ; celui qui frappe la nuit", ["Tarek", "Tarik"]],
  ["Karim", "كريم", "m", "arabic", "generous, noble", "généreux, noble", ["Kareem"]],
  ["Rami", "رامي", "m", "arabic", "archer", "archer", ["Ramy"]],
  ["Sami", "سامي", "m", "arabic", "elevated, sublime", "élevé, sublime", ["Samy"]],
  ["Faisal", "فيصل", "m", "arabic", "decisive, a judge", "décisif, arbitre", ["Faysal"]],
  ["Saif", "سيف", "m", "arabic", "sword", "épée", ["Sayf", "Seif"]],
  ["Malik", "مالك", "m", "arabic", "king, owner", "roi, possesseur", []],
  ["Nasser", "ناصر", "m", "arabic", "helper, supporter", "celui qui aide et soutient", ["Nasir"]],
  ["Ilyas", "إلياس", "m", "hebrew", "my God is the Lord; the Arabic form of Elijah", "mon Dieu est le Seigneur ; forme arabe d'Élie", ["Elias", "Ilias"]],
  ["Zakaria", "زكريا", "m", "hebrew", "God remembers; the Arabic form of Zachary", "Dieu se souvient ; forme arabe de Zacharie", ["Zakariya", "Zachariah"]],
  ["Imran", "عمران", "m", "arabic", "prosperity, a thriving home", "prospérité, foyer florissant", ["Imrane"]],
  ["Rayan", "ريان", "m", "arabic", "well-watered, luxuriant; a gate of paradise", "bien arrosé, luxuriant ; une porte du paradis", ["Rayyan"]],
  ["Amir", "أمير", "m", "arabic", "prince, commander", "prince, commandant", ["Ameer"]],
  ["Hadi", "هادي", "m", "arabic", "guide, calm", "guide, calme", ["Hady"]],
  ["Adel", "عادل", "m", "arabic", "just, fair", "juste, équitable", ["Adil"]],
  ["Jamal", "جمال", "m", "arabic", "beauty", "beauté", ["Djamel"]],
  ["Salman", "سلمان", "m", "arabic", "safe, peaceful", "sain et sauf, paisible", []],
  ["Anas", "أنس", "m", "arabic", "friendliness, good company", "convivialité, bonne compagnie", []],
  ["Yassin", "ياسين", "m", "arabic", "taken from the opening letters of a chapter of the Quran", "tiré des lettres qui ouvrent une sourate du Coran", ["Yassine", "Yaseen"]],
  ["Mehdi", "مهدي", "m", "arabic", "rightly guided", "bien guidé", ["Mahdi"]],
  ["Walid", "وليد", "m", "arabic", "newborn", "nouveau-né", ["Waleed"]],
  ["Nabil", "نبيل", "m", "arabic", "noble", "noble", ["Nabeel"]],
  ["Ayman", "أيمن", "m", "arabic", "blessed, fortunate; on the right side", "béni, chanceux ; du côté droit", []],
  ["Sulaiman", "سليمان", "m", "hebrew", "man of peace; the Arabic form of Solomon", "homme de paix ; forme arabe de Salomon", ["Suleiman", "Soulaymane"]],
  ["Harun", "هارون", "m", "hebrew", "the Arabic form of Aaron", "forme arabe d'Aaron", ["Haroun", "Haroon"]],
  ["Yahya", "يحيى", "m", "hebrew", "he lives; the Arabic form of John", "il vit ; forme arabe de Jean", []],
  ["Nuh", "نوح", "m", "hebrew", "rest, comfort; the Arabic form of Noah", "repos, réconfort ; forme arabe de Noé", []],
  // Western names, female
  ["Emma", "إيما", "f", "germanic", "whole, universal", "entière, universelle", []],
  ["Olivia", "أوليفيا", "f", "latin", "olive tree", "olivier", []],
  ["Sophia", "صوفيا", "f", "greek", "wisdom", "sagesse", ["Sofia", "Sophie"]],
  ["Isabella", "إيزابيلا", "f", "hebrew", "pledged to God (a form of Elizabeth)", "consacrée à Dieu (forme d'Élisabeth)", ["Isabelle", "Isabel"]],
  ["Ava", "آفا", "f", "latin", "bird; life", "oiseau ; vie", []],
  ["Mia", "ميا", "f", "italian", "mine; also a short form of Maria", "mienne ; aussi diminutif de Maria", []],
  ["Charlotte", "شارلوت", "f", "french", "free woman (feminine of Charles)", "femme libre (féminin de Charles)", []],
  ["Amelia", "أميليا", "f", "germanic", "work, industrious", "travailleuse", []],
  ["Emily", "إيميلي", "f", "latin", "rival, eager", "rivale, zélée", ["Emilie", "Émilie"]],
  ["Elizabeth", "إليزابيث", "f", "hebrew", "pledged to God", "consacrée à Dieu", ["Elisabeth", "Élisabeth"]],
  ["Jessica", "جيسيكا", "f", "hebrew", "God beholds", "Dieu voit", []],
  ["Ashley", "آشلي", "f", "english", "ash tree meadow", "prairie de frênes", []],
  ["Jennifer", "جينيفر", "f", "celtic", "fair one, white wave", "la blanche, vague blanche", []],
  ["Grace", "غريس", "f", "latin", "grace, charm", "grâce, charme", []],
  ["Chloe", "كلوي", "f", "greek", "green shoot, blooming", "jeune pousse verte", ["Chloé"]],
  ["Lily", "ليلي", "f", "english", "lily flower, purity", "fleur de lys, pureté", ["Lilly"]],
  ["Hannah", "هانا", "f", "hebrew", "grace, favour", "grâce, faveur", ["Hanna", "Anna"], ["حنّة", "Hanna"]],
  ["Maria", "ماريا", "f", "hebrew", "a form of Mary", "une forme de Marie", ["Marie", "Mary"], ["مريم", "Maryam"]],
  ["Laura", "لورا", "f", "latin", "laurel, victory", "laurier, victoire", []],
  ["Julia", "جوليا", "f", "latin", "youthful", "jeune, juvénile", ["Julie"]],
  ["Nicole", "نيكول", "f", "greek", "victory of the people", "victoire du peuple", []],
  ["Rachel", "ريتشل", "f", "hebrew", "ewe, gentle", "brebis, douceur", []],
  ["Rebecca", "ريبيكا", "f", "hebrew", "to bind, captivating", "attachante, captivante", ["Rebekah"]],
  ["Natalie", "ناتالي", "f", "latin", "born at Christmas", "née à Noël", ["Nathalie"]],
  ["Victoria", "فيكتوريا", "f", "latin", "victory", "victoire", []],
  ["Zoe", "زوي", "f", "greek", "life", "vie", ["Zoé"]],
  ["Ella", "إيلا", "f", "germanic", "all, completely; also light", "tout, entière ; aussi lumière", []],
  ["Luna", "لونا", "f", "latin", "moon", "lune", []],
  ["Aria", "آريا", "f", "italian", "air, a solo melody", "air, mélodie chantée en solo", []],
  ["Scarlett", "سكارليت", "f", "english", "red, scarlet", "rouge écarlate", []],
  ["Abigail", "أبيغيل", "f", "hebrew", "my father's joy", "la joie de mon père", []],
  ["Madison", "ماديسون", "f", "english", "son of Matthew or Maud", "fils de Matthieu ou de Maud", []],
  ["Evelyn", "إيفلين", "f", "english", "wished-for child", "enfant désirée", ["Eveline"]],
  ["Kayla", "كايلا", "f", "celtic", "slender, pure", "svelte, pure", []],
  ["Megan", "ميغان", "f", "celtic", "pearl", "perle", ["Meghan"]],
  ["Amanda", "أماندا", "f", "latin", "worthy of love", "digne d'être aimée", []],
  ["Stephanie", "ستيفاني", "f", "greek", "crown", "couronne", ["Stéphanie"]],
  ["Michelle", "ميشيل", "f", "hebrew", "who is like God? (feminine of Michael)", "qui est comme Dieu ? (féminin de Michel)", []],
  ["Melissa", "ميليسا", "f", "greek", "honeybee", "abeille", []],
  ["Anna", "آنا", "f", "hebrew", "grace, favour", "grâce, faveur", ["Anne"]],
  ["Léa", "ليا", "f", "hebrew", "weary; also linked to \"lioness\"", "lasse ; aussi rapproché de « lionne »", ["Lea", "Leah"]],
  ["Manon", "مانون", "f", "french", "a French form of Marie", "forme française de Marie", []],
  ["Camille", "كاميل", "f", "latin", "young attendant at a ceremony", "jeune servante lors des cérémonies", []],
  ["Jade", "جايد", "f", "spanish", "the jade stone", "la pierre de jade", []],
  ["Louise", "لويز", "f", "germanic", "famous warrior", "guerrière célèbre", []],
  ["Alice", "أليس", "f", "germanic", "noble", "noble", []],
  ["Clara", "كلارا", "f", "latin", "bright, clear", "claire, lumineuse", ["Claire"]],
  ["Eva", "إيفا", "f", "hebrew", "life; a form of Eve", "vie ; une forme d'Ève", ["Eve", "Ève"], ["حواء", "Hawwa"]],
  ["Lucy", "لوسي", "f", "latin", "light", "lumière", ["Lucie"]],
  ["Diana", "ديانا", "f", "latin", "divine", "divine", ["Diane"]],
  ["Elena", "إيلينا", "f", "greek", "bright, shining light", "lumière éclatante", ["Helen", "Hélène"]],
  ["Angela", "أنجيلا", "f", "greek", "messenger, angel", "messagère, ange", ["Angèle"]],
  ["Samantha", "سامانثا", "f", "aramaic", "listener", "celle qui écoute", []],
  ["Lauren", "لورين", "f", "latin", "laurel", "laurier", []],
  ["Jasmine", "جاسمين", "f", "persian", "jasmine flower; Yasmin in Arabic", "fleur de jasmin ; Yasmin en arabe", [], ["ياسمين", "Yasmin"]],
  // Western names, male
  ["John", "جون", "m", "hebrew", "God is gracious", "Dieu fait grâce", ["Jean"], ["يحيى", "Yahya"]],
  ["Michael", "مايكل", "m", "hebrew", "who is like God?", "qui est comme Dieu ?", ["Michel"], ["ميكائيل", "Mikail"]],
  ["David", "ديفيد", "m", "hebrew", "beloved", "bien-aimé", [], ["داود", "Dawud"]],
  ["James", "جيمس", "m", "hebrew", "supplanter (a form of Jacob)", "celui qui supplante (forme de Jacob)", [], ["يعقوب", "Yaqub"]],
  ["Robert", "روبرت", "m", "germanic", "bright fame", "gloire brillante", []],
  ["William", "ويليام", "m", "germanic", "resolute protector", "protecteur résolu", ["Guillaume"]],
  ["Daniel", "دانيال", "m", "hebrew", "God is my judge", "Dieu est mon juge", [], ["دانيال", "Danyal"]],
  ["Joseph", "جوزيف", "m", "hebrew", "God will increase", "Dieu ajoutera", [], ["يوسف", "Yusuf"]],
  ["Jacob", "جيكوب", "m", "hebrew", "supplanter, held by the heel", "celui qui tient le talon", [], ["يعقوب", "Yaqub"]],
  ["Ethan", "إيثان", "m", "hebrew", "strong, firm", "fort, solide", []],
  ["Noah", "نوا", "m", "hebrew", "rest, comfort", "repos, réconfort", ["Noé"], ["نوح", "Nuh"]],
  ["Liam", "ليام", "m", "celtic", "resolute protector (from William)", "protecteur résolu (de William)", []],
  ["Lucas", "لوكاس", "m", "greek", "from Lucania; light", "de Lucanie ; lumière", ["Luke", "Luc"]],
  ["Mason", "ميسون", "m", "english", "stoneworker", "tailleur de pierre", []],
  ["Logan", "لوغان", "m", "celtic", "little hollow", "petit creux", []],
  ["Elijah", "إيلايجا", "m", "hebrew", "my God is the Lord", "mon Dieu est le Seigneur", [], ["إلياس", "Ilyas"]],
  ["Benjamin", "بنجامين", "m", "hebrew", "son of the right hand", "fils de la main droite", [], ["بنيامين", "Binyamin"]],
  ["Henry", "هنري", "m", "germanic", "ruler of the home", "maître du foyer", ["Henri"]],
  ["Jack", "جاك", "m", "english", "God is gracious (from John)", "Dieu fait grâce (de John)", []],
  ["Leo", "ليو", "m", "latin", "lion", "lion", ["Léo"]],
  ["Samuel", "صموئيل", "m", "hebrew", "name of God; God has heard", "nom de Dieu ; Dieu a entendu", []],
  ["Matthew", "ماثيو", "m", "hebrew", "gift of God", "don de Dieu", ["Matthieu"]],
  ["Andrew", "أندرو", "m", "greek", "manly, brave", "viril, courageux", ["André"]],
  ["Joshua", "جوشوا", "m", "hebrew", "God is salvation", "Dieu sauve", [], ["يوشع", "Yusha"]],
  ["Anthony", "أنتوني", "m", "latin", "priceless, from the Roman family Antonius", "inestimable, de la famille romaine Antonius", ["Antoine"]],
  ["Thomas", "توماس", "m", "aramaic", "twin", "jumeau", []],
  ["Kevin", "كيفن", "m", "celtic", "gentle birth, handsome", "beau, de noble naissance", []],
  ["Brian", "براين", "m", "celtic", "noble, high", "noble, élevé", []],
  ["Eric", "إريك", "m", "germanic", "eternal ruler", "souverain éternel", []],
  ["Steven", "ستيفن", "m", "greek", "crown", "couronne", ["Stephen", "Stéphane"]],
  ["Mark", "مارك", "m", "latin", "warlike, dedicated to Mars", "guerrier, dédié à Mars", ["Marc"]],
  ["Paul", "بول", "m", "latin", "small, humble", "petit, humble", []],
  ["Peter", "بيتر", "m", "greek", "rock, stone", "pierre, rocher", ["Pierre"]],
  ["George", "جورج", "m", "greek", "farmer", "agriculteur", ["Georges"]],
  ["Edward", "إدوارد", "m", "english", "wealthy guardian", "gardien prospère", ["Édouard"]],
  ["Richard", "ريتشارد", "m", "germanic", "brave ruler", "souverain courageux", []],
  ["Charles", "تشارلز", "m", "germanic", "free man", "homme libre", []],
  ["Tyler", "تايلر", "m", "english", "tile maker", "fabricant de tuiles", []],
  ["Nathan", "ناثان", "m", "hebrew", "he gave", "il a donné", []],
  ["Aaron", "آرون", "m", "hebrew", "exalted, mountain of strength", "élevé, montagne de force", [], ["هارون", "Harun"]],
  ["Adrian", "أدريان", "m", "latin", "from Hadria", "originaire d'Hadria", ["Adrien"]],
  ["Oliver", "أوليفر", "m", "latin", "olive tree", "olivier", ["Olivier"]],
  ["Max", "ماكس", "m", "latin", "the greatest", "le plus grand", []],
  ["Alex", "أليكس", "m", "greek", "defender of the people", "défenseur du peuple", ["Alexander", "Alexandre"]],
  ["Ryan", "رايان", "m", "celtic", "little king", "petit roi", []],
  ["Chris", "كريس", "m", "greek", "bearer of Christ", "porteur du Christ", ["Christopher", "Christophe"]],
  ["Jordan", "جوردن", "m", "hebrew", "flowing down, after the river Jordan", "qui descend, d'après le Jourdain", []],
  ["Louis", "لويس", "m", "germanic", "famous warrior", "guerrier célèbre", []],
  ["Gabriel", "غابرييل", "m", "hebrew", "God is my strength", "Dieu est ma force", [], ["جبريل", "Jibril"]],
  ["Hugo", "هوغو", "m", "germanic", "mind, intellect", "esprit, intelligence", []],
  ["Jules", "جول", "m", "latin", "youthful", "jeune", []],
  ["Arthur", "آرثر", "m", "celtic", "bear", "ours", []],
  ["Raphael", "رافائيل", "m", "hebrew", "God heals", "Dieu guérit", ["Raphaël"]],
  ["Nicolas", "نيكولا", "m", "greek", "victory of the people", "victoire du peuple", ["Nicholas"]],
  ["Julien", "جوليان", "m", "latin", "youthful", "jeune", ["Julian"]],
  ["Martin", "مارتن", "m", "latin", "of Mars, warlike", "de Mars, guerrier", []],
  ["Victor", "فيكتور", "m", "latin", "winner, conqueror", "vainqueur", []],
  ["Sebastian", "سيباستيان", "m", "greek", "venerable, revered", "vénérable", ["Sébastien"]],
  ["Patrick", "باتريك", "m", "latin", "nobleman", "noble", []],
  ["Kai", "كاي", "m", "celtic", "keeper of the keys; also \"sea\" in Hawaiian", "gardien des clés ; aussi « mer » en hawaïen", []],
  ["Ayaan", "أيان", "m", "arabic", "gift of God; also read as \"time, era\"", "don de Dieu ; aussi « temps, époque »", ["Ayan"]],
  ["Aryan", "آريان", "m", "sanskrit", "noble, honourable", "noble, honorable", []],
  ["Deniz", "دنيز", "m", "turkish", "sea", "mer", []],
  ["Leon", "ليون", "m", "greek", "lion", "lion", ["Léon"]],
  ["Felix", "فيليكس", "m", "latin", "happy, lucky", "heureux, chanceux", ["Félix"]],
];

function toSlug(latin: string): string {
  return latin.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export const arabicNames: ArabicName[] = ROWS.map(([latin, arabic, gender, origin, en, fr, aliases, equiv]) => ({
  slug: toSlug(latin),
  latin,
  arabic,
  gender,
  origin,
  en,
  fr,
  aliases: aliases?.length ? aliases : undefined,
  equiv,
}));

const bySlug = new Map(arabicNames.map((name) => [name.slug, name]));
const byAlias = new Map<string, ArabicName>();
for (const name of arabicNames) {
  for (const key of [name.latin, ...(name.aliases || [])]) {
    const slug = toSlug(key);
    if (!bySlug.has(slug) && !byAlias.has(slug)) byAlias.set(slug, name);
  }
}

export function getArabicName(slug: string): ArabicName | undefined {
  return bySlug.get(slug);
}

// Finds a name by its spelling or a common variant ("Leila" finds Layla).
export function findArabicName(input: string): ArabicName | undefined {
  const slug = toSlug(input.trim());
  return bySlug.get(slug) || byAlias.get(slug);
}

export function relatedNames(name: ArabicName, count = 8): ArabicName[] {
  const index = arabicNames.indexOf(name);
  const sameGender = arabicNames.filter((item) => item !== name && item.gender === name.gender);
  const start = Math.max(0, sameGender.findIndex((item) => arabicNames.indexOf(item) > index));
  return [...sameGender.slice(start), ...sameGender.slice(0, start)].slice(0, count);
}

export const NAME_PATHS = { ar: "/asmaa", en: "/en/names-in-arabic", fr: "/fr/prenoms-en-arabe" } as const;
export const namePath = (locale: "ar" | "en" | "fr", slug: string) => `${NAME_PATHS[locale]}/${slug}`;
