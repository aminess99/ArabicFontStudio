// Text for the name and phrase pages, built from the data in arabicNames.ts and
// arabicPhrases.ts. Shared by the React pages and server/seoHtml.ts.

import { originLabels, type ArabicName } from "./arabicNames";
import type { ArabicPhrase } from "./arabicPhrases";

type Locale = "en" | "fr";

const MAX_DESCRIPTION = 160;

// Uses the long description when it fits in search results, else the short one.
function fit(long: string, short: string): string {
  return long.length <= MAX_DESCRIPTION ? long : short;
}

function firstSentence(text: string): string {
  return text.match(/^[^.!?]*[.!?]/)?.[0] ?? text;
}

export type DetailContent = {
  title: string;
  description: string;
  heading: string;
  intro: string;
  facts: Array<[string, string]>;
  sections: Array<{ heading: string; body: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

export function nameContent(name: ArabicName, locale: Locale): DetailContent {
  const origin = originLabels[name.origin][locale];
  const others = name.aliases?.join(", ");
  if (locale === "fr") {
    const gender = name.gender === "f" ? "féminin" : "masculin";
    return {
      title: `${name.latin} en arabe (${name.arabic}) — écriture et calligraphie | xfontat`,
      description: fit(`${name.latin} en arabe s'écrit ${name.arabic}. Sens : ${name.fr}. Lettres, prononciation et ${name.latin} en calligraphie arabe à télécharger.`, `${name.latin} en arabe s'écrit ${name.arabic}. Sens : ${name.fr}. En calligraphie arabe à télécharger.`),
      heading: `${name.latin} en arabe`,
      intro: `Le prénom ${name.latin} s'écrit ${name.arabic} en arabe. C'est un prénom ${gender} d'origine ${origin}, qui signifie « ${name.fr} ».`,
      facts: [
        ["En arabe", name.arabic],
        ["Genre", name.gender === "f" ? "Féminin" : "Masculin"],
        ["Origine", origin.charAt(0).toUpperCase() + origin.slice(1)],
        ["Signification", name.fr],
        ...(others ? [["Autres orthographes", others] as [string, string]] : []),
        ...(name.equiv && name.equiv[0] !== name.arabic ? [["Forme arabe traditionnelle", `${name.equiv[0]} (${name.equiv[1]})`] as [string, string]] : []),
      ],
      sections: [
        {
          heading: `Tatouage, collier ou cadeau avec ${name.latin} en arabe`,
          body: `Pour un collier prénom ou un tatouage, gardez l'orthographe ${name.arabic} et vérifiez que les lettres restent liées et se lisent de droite à gauche. Le thuluth et le diwani donnent un rendu orné pour les grands formats, le coufique reste lisible en petit.`,
        },
      ],
      faqs: [
        { question: `Comment écrire ${name.latin} en arabe ?`, answer: `${name.latin} s'écrit ${name.arabic}, de droite à gauche.` },
        { question: `Que signifie le prénom ${name.latin} ?`, answer: `${name.latin} est d'origine ${origin} et signifie « ${name.fr} ».` },
        ...(name.equiv && name.equiv[0] !== name.arabic ? [{ question: `Quel est l'équivalent arabe de ${name.latin} ?`, answer: `La forme arabe traditionnelle est ${name.equiv[1]} (${name.equiv[0]}). L'écriture ${name.arabic} reproduit la prononciation occidentale.` }] : []),
      ],
    };
  }
  const gender = name.gender === "f" ? "girl's" : "boy's";
  return {
    title: `${name.latin} in Arabic (${name.arabic}) — Writing & Calligraphy | xfontat`,
    description: fit(`${name.latin} in Arabic is written ${name.arabic}. Meaning: ${name.en}. See the letters and ${name.latin} in Arabic calligraphy to download.`, `${name.latin} in Arabic is written ${name.arabic}. Meaning: ${name.en}. See it in Arabic calligraphy.`),
    heading: `${name.latin} in Arabic`,
    intro: `The name ${name.latin} is written ${name.arabic} in Arabic. It is a ${gender} name of ${origin} origin meaning "${name.en}".`,
    facts: [
      ["In Arabic", name.arabic],
      ["Gender", name.gender === "f" ? "Female" : "Male"],
      ["Origin", origin],
      ["Meaning", name.en],
      ...(others ? [["Other spellings", others] as [string, string]] : []),
      ...(name.equiv && name.equiv[0] !== name.arabic ? [["Traditional Arabic form", `${name.equiv[0]} (${name.equiv[1]})`] as [string, string]] : []),
    ],
    sections: [
      {
        heading: `${name.latin} in Arabic for a tattoo, necklace or gift`,
        body: `For a name necklace or tattoo, keep the spelling ${name.arabic} and make sure the letters stay joined and read from right to left. Thuluth and Diwani give an ornate look for larger pieces, while Kufi stays readable at small sizes.`,
      },
    ],
    faqs: [
      { question: `How do you write ${name.latin} in Arabic?`, answer: `${name.latin} is written ${name.arabic}, from right to left.` },
      { question: `What does the name ${name.latin} mean?`, answer: `${name.latin} is of ${origin} origin and means "${name.en}".` },
      ...(name.equiv && name.equiv[0] !== name.arabic ? [{ question: `What is ${name.latin} in Arabic tradition?`, answer: `The traditional Arabic form is ${name.equiv[1]} (${name.equiv[0]}). The spelling ${name.arabic} follows the Western pronunciation.` }] : []),
    ],
  };
}

const FR_LABELS: Record<string, string> = {
  love: "Amour", peace: "Paix", hope: "Espoir", sabr: "Patience", faith: "Foi", strength: "Force",
  freedom: "Liberté", family: "Famille", mother: "Mère", life: "Vie", dream: "Rêve", beautiful: "Beau",
  "thank-you": "Merci", light: "Lumière", "this-too-shall-pass": "Cela aussi passera", "assalamu-alaikum": "Salam aleykoum",
  alhamdulillah: "Al-hamdoulillah", inshallah: "Inchallah", shahada: "La ilaha illa Allah",
};

export function phraseLabel(phrase: ArabicPhrase, locale: Locale): string {
  return locale === "fr" ? FR_LABELS[phrase.slug] || phrase.latin.split(" (")[0] : phrase.latin.split(" (")[0];
}

export function phraseContent(phrase: ArabicPhrase, locale: Locale): DetailContent {
  const label = phraseLabel(phrase, locale);
  const copy = phrase[locale];
  const religious = phrase.kind === "religious";
  if (locale === "fr") {
    return {
      title: `${label} en arabe (${phrase.arabic}) — sens et calligraphie | xfontat`,
      description: fit(`${label} en arabe : ${phrase.arabic}. ${firstSentence(copy.meaning)} Prononciation et calligraphie à télécharger.`, `${label} en arabe : ${phrase.arabic}. ${firstSentence(copy.meaning)}`),
      heading: `${label} en arabe`,
      intro: `« ${label} » s'écrit ${phrase.arabic} en arabe et se prononce ${phrase.say}. ${copy.meaning}`,
      facts: [["En arabe", phrase.arabic], ["Prononciation", phrase.say], ["Sens", copy.meaning]],
      sections: [
        { heading: "Quand l'utiliser", body: copy.usage },
        ...(religious ? [{ heading: "Tatouage et respect", body: "Beaucoup de musulmans jugent irrespectueux de porter le nom de Dieu ou une formule religieuse en tatouage, car l'encre se trouve sur la peau et peut être exposée à l'impureté. Pour un tableau, une carte ou une décoration, ces formules sont en revanche très courantes." }] : []),
      ],
      faqs: [
        { question: `Comment écrit-on ${label} en arabe ?`, answer: `${phrase.arabic}, de droite à gauche.` },
        { question: `Comment prononcer ${phrase.arabic} ?`, answer: `${phrase.say}. Les syllabes en majuscules sont accentuées.` },
      ],
    };
  }
  return {
    title: `${label} in Arabic (${phrase.arabic}) — Meaning & Calligraphy | xfontat`,
    description: fit(`${label} in Arabic: ${phrase.arabic}. ${firstSentence(copy.meaning)} Pronunciation and calligraphy to download.`, `${label} in Arabic: ${phrase.arabic}. ${firstSentence(copy.meaning)}`),
    heading: `${label} in Arabic`,
    intro: `"${label}" is written ${phrase.arabic} in Arabic and pronounced ${phrase.say}. ${copy.meaning}`,
    facts: [["In Arabic", phrase.arabic], ["Pronunciation", phrase.say], ["Meaning", copy.meaning]],
    sections: [
      { heading: "When it is used", body: copy.usage },
      ...(religious ? [{ heading: "Tattoos and respect", body: "Many Muslims consider it disrespectful to tattoo the name of God or a religious phrase, because the ink sits on the skin and can be exposed to impurity. For wall art, cards and decoration, these phrases are very common." }] : []),
    ],
    faqs: [
      { question: `How do you write ${label} in Arabic?`, answer: `${phrase.arabic}, from right to left.` },
      { question: `How do you pronounce ${phrase.arabic}?`, answer: `${phrase.say}. The syllables in capitals are stressed.` },
    ],
  };
}
