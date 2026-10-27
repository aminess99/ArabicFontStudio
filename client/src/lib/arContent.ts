// Text for the Arabic name and phrase pages ("اسم سارة بالإنجليزي"), built
// from the shared data. Shared by the React pages and server/seoHtml.ts.

import type { ArabicName } from "./arabicNames";
import type { ArabicPhrase } from "./arabicPhrases";
import { nameMeaningsAr, originLabelsAr } from "./arabicNamesAr";
import { phraseTextAr } from "./arabicPhrasesAr";
import type { DetailContent } from "./intlContent";

const MAX_DESCRIPTION = 160;

function fitTitle(candidates: string[]): string {
  return candidates.find((title) => title.replace(/ \| xfontat$/, "").length <= 65) ?? candidates[candidates.length - 1];
}

function fitDescription(candidates: string[]): string {
  return candidates.find((text) => text.length <= MAX_DESCRIPTION) ?? candidates[candidates.length - 1].slice(0, MAX_DESCRIPTION);
}

export function nameMeaningAr(name: ArabicName): string {
  return nameMeaningsAr[name.latin] ?? name.en;
}

export function nameContentAr(name: ArabicName): DetailContent {
  const meaning = nameMeaningAr(name);
  const origin = originLabelsAr[name.origin];
  const others = name.aliases ?? [];
  const gender = name.gender === "f" ? "مؤنث" : "مذكر";
  const equiv = name.equiv && name.equiv[0] !== name.arabic ? name.equiv : undefined;
  const spellings = others.length ? ` أو ${others.slice(0, 2).join(" أو ")}` : "";
  return {
    title: fitTitle([
      `اسم ${name.arabic} بالإنجليزي ${name.latin} — معناه وزخرفته | xfontat`,
      `اسم ${name.arabic} بالإنجليزي ${name.latin} | xfontat`,
    ]),
    description: fitDescription([
      `اسم ${name.arabic} بالإنجليزي يُكتب ${name.latin}${spellings}. معنى اسم ${name.arabic}: ${meaning}. شاهده بالخط العربي ومزخرفاً جاهزاً للنسخ.`,
      `اسم ${name.arabic} بالإنجليزي يُكتب ${name.latin}${spellings}. معنى اسم ${name.arabic}: ${meaning}.`,
      `اسم ${name.arabic} بالإنجليزي يُكتب ${name.latin}. معنى اسم ${name.arabic}: ${meaning}.`,
    ]),
    heading: `اسم ${name.arabic} بالإنجليزي`,
    intro: `يُكتب اسم ${name.arabic} بالحروف الإنجليزية ${name.latin}${others.length ? `، ومن طرق كتابته أيضاً: ${others.join("، ")}` : ""}. وهو اسم ${gender} أصله ${origin}، ومعناه: ${meaning}.`,
    facts: [
      ["بالإنجليزي", name.latin],
      ...(others.length ? [["كتابات أخرى", others.join("، ")] as [string, string]] : []),
      ["الجنس", name.gender === "f" ? "أنثى" : "ذكر"],
      ["الأصل", origin],
      ["المعنى", meaning],
      ...(equiv ? [["الاسم المقابل في العربية", `${equiv[0]} (${equiv[1]})`] as [string, string]] : []),
    ],
    sections: [
      {
        heading: `اسم ${name.arabic} على قلادة أو هدية`,
        body: `للقلادات والأساور وبطاقات الهدايا يمكنك كتابة الاسم بالإنجليزي ${name.latin} أو بالعربي ${name.arabic}. حمّل الاسم بالخط العربي من الأعلى صورةً شفافة، أو انسخ أحد أشكال الزخرفة للصقه في الحسابات والألعاب.`,
      },
    ],
    faqs: [
      { question: `كيف يُكتب اسم ${name.arabic} بالإنجليزي؟`, answer: `يُكتب ${name.latin}${others.length ? `، ويُكتب أيضاً ${others.join(" أو ")}` : ""}.` },
      { question: `ما معنى اسم ${name.arabic}؟`, answer: `معناه ${meaning}، وأصله ${origin}.` },
      { question: `كيف أزخرف اسم ${name.arabic}؟`, answer: `انسخ أحد أشكال الزخرفة في هذه الصفحة، أو اكتب الاسم في أداة زخرفة الأسماء لتحصل على عشرات الأشكال.` },
    ],
  };
}

// How the phrase is written in Latin letters: the word in brackets for
// single words ("Love (Hubb)"), else the usual spelling.
export function phraseTransliteration(phrase: ArabicPhrase): string {
  const bracket = phrase.latin.match(/\(([^)]+)\)/)?.[1];
  if (bracket) return bracket;
  const english = phraseTextAr[phrase.slug]?.english;
  return phrase.latin !== english ? phrase.latin : phrase.say;
}

// The Latin text shown as "X in English": the English word for single words
// (حب → Love), the usual spelling for phrases (الحمد لله → Alhamdulillah).
export function phraseDisplayLatin(phrase: ArabicPhrase): string {
  return phrase.kind === "word" ? phraseTextAr[phrase.slug]?.english ?? phrase.latin : phraseTransliteration(phrase);
}

export function phraseContentAr(phrase: ArabicPhrase): DetailContent {
  const text = phraseTextAr[phrase.slug];
  const translit = phraseTransliteration(phrase);
  const english = text?.english ?? phrase.latin;
  const meaning = text?.meaning ?? phrase.en.meaning;
  const usage = text?.usage ?? phrase.en.usage;
  const religious = phrase.kind === "religious";
  const word = phrase.kind === "word";
  const display = phraseDisplayLatin(phrase);
  const lead = word
    ? `${phrase.arabic} بالإنجليزي ${english}، وتُكتب بحروف إنجليزية حسب النطق ${translit}.`
    : `${phrase.arabic} بالإنجليزي تُكتب ${translit}، وترجمتها: ${english}.`;
  return {
    title: fitTitle([
      `${phrase.arabic} بالإنجليزي ${display} — المعنى والكتابة | xfontat`,
      `${phrase.arabic} بالإنجليزي — المعنى والكتابة | xfontat`,
      `${phrase.arabic} بالإنجليزي | xfontat`,
    ]),
    description: fitDescription([
      `${lead} ${meaning} شاهدها بالخط العربي ومزخرفة.`,
      `${lead} ${meaning}`,
      lead,
    ]),
    heading: `${phrase.arabic} بالإنجليزي`,
    intro: word
      ? `كلمة «${phrase.arabic}» بالإنجليزي ${english}، وتُكتب بحروف إنجليزية حسب نطقها العربي ${translit}. ${meaning}`
      : `تُكتب «${phrase.arabic}» بالحروف الإنجليزية ${translit}، وترجمتها إلى الإنجليزية: ${english}. ${meaning}`,
    facts: [
      ["بالحروف الإنجليزية", translit],
      ["الترجمة الإنجليزية", english],
      ["النطق", phrase.say],
      ["المعنى", meaning],
    ],
    sections: [
      { heading: "متى تُقال", body: usage },
      ...(religious ? [{ heading: "الوشم والعبارات الدينية", body: "يرى كثير من المسلمين أن وشم لفظ الجلالة أو العبارات الدينية على الجسد لا يليق. أما في اللوحات والبطاقات وزخرفة الجدران فهي شائعة جداً." }] : []),
    ],
    faqs: [
      word
        ? { question: `ما معنى ${phrase.arabic} بالإنجليزي؟`, answer: `${english}، وتُكتب بحروف إنجليزية حسب النطق العربي ${translit}.` }
        : { question: `كيف تُكتب ${phrase.arabic} بالإنجليزي؟`, answer: `تُكتب ${translit}، وترجمتها إلى الإنجليزية ${english}.` },
      { question: `ما معنى ${phrase.arabic}؟`, answer: meaning },
    ],
  };
}
