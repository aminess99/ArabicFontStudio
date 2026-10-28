import { specsDescriptionAr, type FontSpecs } from "./fontSpecs";
// Hand-written descriptions for the most-used fonts, shown on their font pages
// and used for the meta description. The first sentence of each language is
// the meta description, so keep it under 160 characters. Only state a
// designer or licence when it is recorded or well documented.

type Profile = { ar: string[]; en: string[] };

const OFL_AR = "منشور بترخيص SIL Open Font License، فيمكن استخدامه في المشاريع الشخصية والتجارية.";
const OFL_EN = "It is published under the SIL Open Font License, so it can be used in personal and commercial projects.";
const COMMERCIAL_AR = "هذا خط تجاري؛ تحقق من ترخيصه لدى الناشر قبل أي استخدام تجاري.";
const COMMERCIAL_EN = "This is a commercial typeface; check its licence with the publisher before any commercial use.";
const CHECK_AR = "لا نعرف ترخيص هذا الملف بدقة، فراجع مصدره قبل الاستخدام التجاري.";
const CHECK_EN = "We do not have verified licence details for this file, so check its source before commercial use.";

export const fontProfiles: Record<string, Profile> = {
  "cairo-regular": {
    ar: ["خط القاهرة (Cairo) خط عربي معاصر واضح صممه محمد جابر، يمزج روح الكوفي مع بساطة الخطوط الحديثة.", "يتميز بفتحات واسعة وحروف متوازنة، فيصلح للمواقع والتطبيقات والعناوين والعروض التقديمية، وهو من أكثر الخطوط العربية استخداماً على الويب.", "يُنشر في Google Fonts بترخيص SIL Open Font License."],
    en: ["Cairo is a clear contemporary Arabic typeface by Mohamed Gaber that blends a Kufi spirit with modern simplicity.", "Its open shapes and balanced letters suit websites, apps, headings and presentations, and it is one of the most used Arabic fonts on the web.", "It is available on Google Fonts under the SIL Open Font License."],
  },
  "tajawal-regular": {
    ar: ["خط تجوال (Tajawal) خط عربي هندسي بسيط من تصميم Boutros Fonts، بخطوط منخفضة التباين وحروف واضحة على الشاشات.", "يناسب واجهات التطبيقات والمواقع والنصوص القصيرة والعناوين النظيفة، ويتوفر بأوزان متعددة من الرفيع إلى الأسود.", "يُنشر في Google Fonts بترخيص SIL Open Font License."],
    en: ["Tajawal is a simple geometric Arabic sans-serif by Boutros Fonts, with low contrast and clear letters on screen.", "It suits app interfaces, websites, short texts and clean headings, and comes in several weights from extra light to black.", "It is available on Google Fonts under the SIL Open Font License."],
  },
  "amiri-regular": {
    ar: ["خط أميري (Amiri) خط نسخ كلاسيكي صممه خالد حسني، مستوحى من حروف مطبعة بولاق الأميرية في القاهرة أوائل القرن العشرين.", "حروفه رشيقة وغنية بالتفاصيل مع دعم كامل للتشكيل، فيناسب الكتب والمقالات الطويلة والنصوص الأدبية والدينية.", "يُنشر بترخيص SIL Open Font License."],
    en: ["Amiri is a classical Naskh typeface by Khaled Hosny, inspired by the type of the Bulaq (Amiria) Press in Cairo in the early 20th century.", "Its graceful, detailed letters support full vowel marks, making it a good fit for books, long articles, literary and religious texts.", "It is published under the SIL Open Font License."],
  },
  "amiri-quran": {
    ar: ["أميري قرآن (Amiri Quran) نسخة من خط أميري مخصصة للنص القرآني، مع علامات الضبط والوقف ورموز المصحف.", "يحافظ على أسلوب النسخ الكلاسيكي لخط أميري مع تباعد مناسب للتشكيل الكامل. راجع النص مع مصدر موثوق قبل النشر.", "يُنشر بترخيص SIL Open Font License ضمن عائلة أميري."],
    en: ["Amiri Quran is a version of Amiri made for Quranic text, with full vowel marks, pause signs and mushaf symbols.", "It keeps Amiri's classical Naskh style with spacing suited to fully vocalised text. Check the text against a trusted source before publishing.", "It is part of the Amiri family, published under the SIL Open Font License."],
  },
  almarai: {
    ar: ["خط المراعي (Almarai) خط عربي حديث بلا زخارف من تصميم Boutros International، صُمم للقراءة المريحة على الشاشات.", "حروفه مفتوحة وخفيفة ومتناسقة، فيناسب المواقع والتطبيقات والنصوص المتوسطة الطول.", OFL_AR],
    en: ["Almarai is a modern Arabic sans-serif by Boutros International, designed for comfortable reading on screen.", "Its open, light and consistent letters suit websites, apps and medium-length texts.", OFL_EN],
  },
  changa: {
    ar: ["خط شنقا (Changa) خط عربي بطابع كوفي حديث صممه إدواردو رودريغيز توني، بحروف مضغوطة قليلاً وزوايا مستديرة.", "يعطي حضوراً قوياً في العناوين والشعارات والإعلانات، ويبقى مقروءاً في الأحجام المتوسطة.", OFL_AR],
    en: ["Changa is an Arabic typeface with a modern Kufi feel by Eduardo Rodriguez Tunni, with slightly condensed letters and rounded corners.", "It gives headings, logos and ads a strong presence and stays readable at medium sizes.", OFL_EN],
  },
  "lalezar-regular": {
    ar: ["خط لاله‌زار (Lalezar) خط عرض عربي ثقيل صممه بورنا إيزدبناه، مستوحى من لافتات شارع لاله‌زار في طهران.", "حروفه سميكة ومستديرة، فيصلح للعناوين الكبيرة والملصقات وصور يوتيوب المصغرة، ولا يناسب النصوص الطويلة."],
    en: ["Lalezar is a heavy Arabic display typeface by Borna Izadpanah, inspired by the signs of Lalezar Street in Tehran.", "Its thick, rounded letters work for large headings, posters and YouTube thumbnails, not for long texts."],
  },
  "elmessiri-regular": {
    ar: ["خط المسيري (El Messiri) خط عربي معاصر صممه محمد جابر، يجمع بين بساطة الخطوط الحديثة ولمسة من انحناءات الخط اليدوي.", "يصلح للعناوين والهوية البصرية والمطاعم والمطبوعات التي تحتاج طابعاً عربياً أنيقاً غير تقليدي."],
    en: ["El Messiri is a contemporary Arabic typeface by Mohamed Gaber that combines modern simplicity with a touch of handwritten curves.", "It works for headings, brand identities, restaurants and print that need an elegant, non-traditional Arabic look."],
  },
  "reem-kufi": {
    ar: ["خط ريم الكوفي (Reem Kufi) خط كوفي عربي صممه خالد حسني، مستوحى من الكوفي الفاطمي بخطوطه المستقيمة وزواياه الحادة.", "يعطي طابعاً تراثياً هندسياً في الشعارات والعناوين واللافتات، ويُستخدم كثيراً في التصميم الإسلامي المعاصر.", OFL_AR],
    en: ["Reem Kufi is an Arabic Kufi typeface by Khaled Hosny, inspired by Fatimid Kufic with its straight strokes and sharp corners.", "It gives logos, headings and signs a geometric heritage look and is popular in contemporary Islamic design.", OFL_EN],
  },
  rakkas: {
    ar: ["خط رقّاص (Rakkas) خط عرض عربي ثقيل ومائل صممته زينب أكاي، بحروف تشبه الكتابة بالفرشاة العريضة.", "مناسب للملصقات وأغلفة الكتب والعناوين القصيرة التي تحتاج حيوية وحضوراً قوياً.", OFL_AR],
    en: ["Rakkas is a heavy, slanted Arabic display typeface by Zeynep Akay, with letters that look written with a broad brush.", "It suits posters, book covers and short headings that need energy and a strong presence.", OFL_EN],
  },
  jomhuria: {
    ar: ["خط جمهورية (Jomhuria) خط عرض عربي سميك جداً بتصميم كوروش بيغبور، بحروف قصيرة ومتراصة.", "يملأ المساحة بقوة، فيناسب العناوين الضخمة والملصقات والشعارات القصيرة.", OFL_AR],
    en: ["Jomhuria is a very bold Arabic display typeface designed by Kourosh Beigpour, with short, tightly packed letters.", "It fills space with impact and suits huge headings, posters and short logos.", OFL_EN],
  },
  katibeh: {
    ar: ["خط كاتبة (Katibeh) خط عربي بطابع يدوي من تصميم كوروش بيغبور، يحاكي الكتابة بالقلم المقطوع بتباين واضح بين الخطوط.", "يناسب العناوين والاقتباسات والمطبوعات ذات الطابع الأدبي والتراثي.", OFL_AR],
    en: ["Katibeh is an Arabic typeface with a handwritten character by Kourosh Beigpour, echoing a cut-nib pen with clear stroke contrast.", "It suits headings, quotes and print with a literary or heritage feel.", OFL_EN],
  },
  lateef: {
    ar: ["خط لطيف (Lateef) خط نسخ من SIL International، صُمم أساساً للغتين السندية والأردية ويدعم العربية بالكامل.", "حروفه واضحة ومريحة للنصوص الطويلة، ويدعم الحروف الإضافية المستخدمة في لغات جنوب آسيا.", OFL_AR],
    en: ["Lateef is a Naskh typeface from SIL International, made mainly for Sindhi and Urdu with full Arabic support.", "Its clear letters are comfortable in long texts, and it covers the extra letters used in South Asian languages.", OFL_EN],
  },
  "scheherazade-new": {
    ar: ["خط شهرزاد الجديد (Scheherazade New) خط نسخ تقليدي من SIL International، بحروف كبيرة وواضحة وتشكيل دقيق.", "يغطي حروف لغات كثيرة تُكتب بالحرف العربي، فيناسب الكتب والنصوص التعليمية والمحتوى المتعدد اللغات.", OFL_AR],
    en: ["Scheherazade New is a traditional Naskh typeface from SIL International, with large, clear letters and precise vowel marks.", "It covers many languages written in Arabic script, making it good for books, educational texts and multilingual content.", OFL_EN],
  },
  harmattan: {
    ar: ["خط هرمتان (Harmattan) خط نسخ من SIL International، صُمم للغات غرب إفريقيا التي تُكتب بالحرف العربي على طريقة ورش.", "حروفه بسيطة وواضحة في الأحجام الصغيرة، ويصلح للنصوص التعليمية والوثائق.", OFL_AR],
    en: ["Harmattan is a Naskh typeface from SIL International, made for West African languages written in Arabic script in the Warsh style.", "Its simple letters stay clear at small sizes and suit educational texts and documents.", OFL_EN],
  },
  "markazi-text": {
    ar: ["خط مركزي (Markazi Text) خط نصوص عربي صممه بورنا إيزدبناه بإشراف فيونا روس، مستوحى من خط النسخ.", "صُمم للقراءة الطويلة في الكتب والمقالات، بحروف هادئة ومتوازنة في الأحجام الصغيرة والمتوسطة.", OFL_AR],
    en: ["Markazi Text is an Arabic text typeface by Borna Izadpanah, directed by Fiona Ross and inspired by Naskh.", "It is designed for long reading in books and articles, with calm, balanced letters at small and medium sizes.", OFL_EN],
  },
  mirza: {
    ar: ["خط ميرزا (Mirza) خط عربي بتصميم كوروش بيغبور، بحروف سميكة ذات طابع نسخي واضح.", "يناسب العناوين الفرعية والمطبوعات والتصاميم التي تحتاج خطاً تقليدياً قوياً.", OFL_AR],
    en: ["Mirza is an Arabic typeface designed by Kourosh Beigpour, with bold letters in a clear Naskh style.", "It suits subheadings, print and designs that need a strong traditional font.", OFL_EN],
  },
  "noto-naskh-arabic": {
    ar: ["خط نوتو نسخ عربي (Noto Naskh Arabic) خط نسخ من عائلة Noto التي طورتها Google مع Monotype، لقراءة واضحة في النصوص.", "يتميز بدعم واسع للحروف والتشكيل، فيصلح للمواقع والكتب الرقمية والوثائق.", OFL_AR],
    en: ["Noto Naskh Arabic is a Naskh typeface from the Noto family developed by Google with Monotype, built for clear text reading.", "It has wide character and vowel-mark coverage, suiting websites, e-books and documents.", OFL_EN],
  },
  "noto-kufi-arabic": {
    ar: ["خط نوتو كوفي عربي (Noto Kufi Arabic) خط عربي هندسي من عائلة Noto من Google، بحروف مستقيمة ومنخفضة التباين.", "يناسب الواجهات والعناوين واللافتات، ويتناسق مع خطوط Noto اللاتينية في التصاميم متعددة اللغات.", "يُنشر ضمن عائلة Noto بترخيص SIL Open Font License."],
    en: ["Noto Kufi Arabic is a geometric Arabic typeface from Google's Noto family, with straight, low-contrast letters.", "It suits interfaces, headings and signage, and pairs well with Noto Latin fonts in multilingual designs.", "Noto fonts are published under the SIL Open Font License."],
  },
  "noto-sans-arabic": {
    ar: ["خط نوتو سانس عربي (Noto Sans Arabic) خط عربي بلا زخارف من عائلة Noto، شاركت في تصميمه نادين شاهين.", "حروفه واضحة على الشاشات وبأوزان متعددة، فيناسب التطبيقات والمواقع والنصوص الواجهية.", OFL_AR],
    en: ["Noto Sans Arabic is an Arabic sans-serif from the Noto family, co-designed by Nadine Chahine.", "Its clear letters and multiple weights work well in apps, websites and interface text.", OFL_EN],
  },
  "ibm-plex-sans-arabic": {
    ar: ["خط IBM Plex Sans Arabic النسخة العربية من عائلة IBM Plex، شارك في تصميمها وائل مرقص وخاجاك أبيليان.", "حروفه عملية ومحايدة مع لمسة تقنية، فتناسب المنتجات الرقمية والتقارير والواجهات.", OFL_AR],
    en: ["IBM Plex Sans Arabic is the Arabic version of the IBM Plex family, co-designed by Wael Morcos and Khajak Apelian.", "Its practical, neutral letters with a technical touch suit digital products, reports and interfaces.", OFL_EN],
  },
  "readex-pro": {
    ar: ["خط ريدكس برو (Readex Pro) خط عربي ولاتيني مبني على عائلة Lexend التي صُممت لتسهيل القراءة.", "حروفه واسعة ومريحة للعين، فيناسب المحتوى التعليمي والمواقع والتطبيقات.", OFL_AR],
    en: ["Readex Pro is an Arabic and Latin typeface built on the Lexend family, which was designed to make reading easier.", "Its wide, easy-on-the-eye letters suit educational content, websites and apps.", OFL_EN],
  },
  mada: {
    ar: ["خط مدى (Mada) خط عربي هندسي بسيط صممه خالد حسني، بحروف نظيفة وأوزان متعددة.", "يصلح للواجهات والعناوين والهويات البصرية الحديثة، خاصة بأوزانه الرفيعة.", OFL_AR],
    en: ["Mada is a simple geometric Arabic typeface by Khaled Hosny, with clean letters and several weights.", "It suits interfaces, headings and modern brand identities, especially in its lighter weights.", OFL_EN],
  },
  kufam: {
    ar: ["خط كوفام (Kufam) خط عربي مستوحى من الكوفي بتصميم وائل مرقص وأرتور شمال، بحروف عريضة وقوية.", "يناسب العناوين والشعارات والملصقات التي تحتاج طابعاً حديثاً بجذور كوفية.", OFL_AR],
    en: ["Kufam is a Kufi-inspired Arabic typeface by Wael Morcos and Artur Schmal, with wide, strong letters.", "It suits headings, logos and posters that need a modern look with Kufic roots.", OFL_EN],
  },
  "montserrat-arabic": {
    ar: ["خط مونتسرات عربي (Montserrat Arabic) النسخة العربية من خط Montserrat الشهير، صممها محمد جابر.", "حروفه هندسية متناسقة مع النسخة اللاتينية، فيناسب الهويات والمواقع ثنائية اللغة.", OFL_AR],
    en: ["Montserrat Arabic is the Arabic companion to the popular Montserrat typeface, designed by Mohamed Gaber.", "Its geometric letters match the Latin version, making it a good choice for bilingual brands and websites.", OFL_EN],
  },
  rubik: {
    ar: ["خط روبيك (Rubik) خط بزوايا مستديرة قليلاً من تصميم Hubert & Fischer، وتتضمن عائلته حروفاً عربية.", "يعطي إحساساً ودوداً وحديثاً في التطبيقات والعناوين والمنتجات الرقمية.", OFL_AR],
    en: ["Rubik is a typeface with slightly rounded corners by Hubert & Fischer, and its family includes Arabic letters.", "It gives apps, headings and digital products a friendly, modern feel.", OFL_EN],
  },
  gulzar: {
    ar: ["خط گلزار (Gulzar) خط نستعليق صُمم للغة الأردية، شارك في تصميمه بورنا إيزدبناه وفيونا روس.", "يحاكي انسيابية النستعليق المكتوب باليد مع انحدار الكلمات، فيناسب الشعر والعناوين والتصاميم الأدبية.", OFL_AR],
    en: ["Gulzar is a Nastaliq typeface made for Urdu, co-designed by Borna Izadpanah and Fiona Ross.", "It captures the flow of hand-written Nastaliq with its sloping words, suiting poetry, headings and literary designs.", OFL_EN],
  },
  "notonastaliqurdu-regular": {
    ar: ["خط نوتو نستعليق أردو (Noto Nastaliq Urdu) خط نستعليق من عائلة Noto من Google، مخصص للغة الأردية.", "يدعم تراكب الحروف وانحدار الكلمات المميز للنستعليق، ويصلح للنصوص الأردية والفارسية والعناوين الأدبية.", "يُنشر ضمن عائلة Noto بترخيص SIL Open Font License."],
    en: ["Noto Nastaliq Urdu is a Nastaliq typeface from Google's Noto family, made for Urdu.", "It handles the stacked letters and sloping words typical of Nastaliq, suiting Urdu and Persian texts and literary headings.", "Noto fonts are published under the SIL Open Font License."],
  },
  blaka: {
    ar: ["خط بلاكا (Blaka) خط عربي صممه محمد جابر، يمزج الحروف العربية بأسلوب الخط القوطي الأوروبي (Blackletter).", "يعطي طابعاً جريئاً وغير مألوف، فيناسب أغلفة الموسيقى والملصقات والملابس والشعارات الجريئة.", OFL_AR],
    en: ["Blaka is an Arabic typeface by Mohamed Gaber that blends Arabic letters with the European Blackletter style.", "Its bold, unusual look suits music covers, posters, clothing and daring logos.", OFL_EN],
  },
  "blaka-hollow": {
    ar: ["خط بلاكا المفرّغ (Blaka Hollow) النسخة المحددة بإطار من خط بلاكا لمحمد جابر، حيث الحروف مفرغة من الداخل.", "يصلح للعناوين الكبيرة والتصاميم متعددة الطبقات، ويمكن وضعه فوق نسخة بلاكا العادية لتأثيرات لونية.", OFL_AR],
    en: ["Blaka Hollow is the outlined version of Mohamed Gaber's Blaka, with letters hollow inside.", "It works for large headings and layered designs, and can be placed over regular Blaka for colour effects.", OFL_EN],
  },
  "baloo-bhaijaan-2": {
    ar: ["خط بالو بهايجان 2 (Baloo Bhaijaan 2) خط عربي مستدير ومرح من تصميم Ek Type، ضمن عائلة Baloo متعددة اللغات.", "حروفه ناعمة وودودة، فيناسب محتوى الأطفال والألعاب والعلامات التجارية المرحة.", OFL_AR],
    en: ["Baloo Bhaijaan 2 is a rounded, playful Arabic typeface by Ek Type, part of the multilingual Baloo family.", "Its soft, friendly letters suit children's content, games and playful brands.", OFL_EN],
  },
  "arefruqaa-bold-1": {
    ar: ["خط عارف رقعة (Aref Ruqaa) خط رقعة رقمي ينسب إلى عبد الله عارف، يحاكي خط الرقعة المكتوب باليد بحروفه السريعة المائلة.", "يعطي طابعاً يدوياً عربياً أصيلاً في العناوين والملصقات ومنشورات وسائل التواصل.", CHECK_AR],
    en: ["Aref Ruqaa is a digital Ruqaa typeface attributed to Abdullah Aref, echoing hand-written Ruqaa with quick, slanted letters.", "It gives headings, posters and social media posts an authentic handwritten Arabic feel.", CHECK_EN],
  },
  "al-jazeera-arabic-regular": {
    ar: ["خط الجزيرة العربي (Al Jazeera Arabic) خط عربي حديث يرتبط بالهوية البصرية لشبكة الجزيرة الإعلامية.", "حروفه هندسية نظيفة، ويستخدم الأرقام اللاتينية، فيعطي طابعاً إخبارياً معاصراً.", "خط مؤسسي وليس بترخيص مفتوح معروف؛ تحقق من حقوق استخدامه قبل أي مشروع تجاري."],
    en: ["Al Jazeera Arabic is a modern Arabic typeface associated with the visual identity of the Al Jazeera network.", "Its clean geometric letters, with Latin numerals, give a contemporary news-style look.", "It is a corporate typeface without a known open licence; check usage rights before any commercial project."],
  },
  "dubai-regular": {
    ar: ["خط دبي (Dubai Font) خط عربي ولاتيني أطلقته حكومة دبي عام 2017 ليكون خطاً للمدينة.", "حروفه واضحة ومعاصرة، فيناسب الوثائق والمواقع والعروض والهويات الحديثة.", "له شروط ترخيص خاصة به؛ راجعها قبل الاستخدام التجاري."],
    en: ["Dubai Font is an Arabic and Latin typeface launched by the Government of Dubai in 2017 as a font for the city.", "Its clear, contemporary letters suit documents, websites, presentations and modern brands.", "It comes with its own licence terms; review them before commercial use."],
  },
  "frutigerltarabic-55roman": {
    ar: ["خط فروتيغر عربي (Frutiger Arabic) النسخة العربية من خط Frutiger الشهير، صممتها نادين شاهين لدار Linotype.", "حروفه واضحة ومتوازنة في اللافتات والمطبوعات والهويات المؤسسية.", COMMERCIAL_AR],
    en: ["Frutiger Arabic is the Arabic companion to the famous Frutiger typeface, designed by Nadine Chahine for Linotype.", "Its clear, balanced letters suit signage, print and corporate identities.", COMMERCIAL_EN],
  },
  "ge-ss-two-medium-5": {
    ar: ["خط GE SS Two من عائلة GE SS المنتشرة في الإعلام والإعلانات العربية، بحروف حديثة واضحة.", "يصلح للعناوين والنصوص القصيرة والإعلانات والتصاميم التجارية.", COMMERCIAL_AR],
    en: ["GE SS Two belongs to the GE SS family widely used in Arabic media and advertising, with clear modern letters.", "It suits headings, short texts, ads and commercial designs.", COMMERCIAL_EN],
  },
  "hacen-tunisia": {
    ar: ["خط هاسن تونس (Hacen Tunisia) من سلسلة خطوط Hacen المعروفة بين المصممين العرب، بحروف حديثة سميكة وواضحة.", "يستخدم كثيراً في العناوين والإعلانات والتصاميم على الفوتوشوب.", CHECK_AR],
    en: ["Hacen Tunisia is part of the Hacen series well known among Arab designers, with bold, clear modern letters.", "It is widely used for headings, ads and Photoshop designs.", CHECK_EN],
  },
  "hacen-casablanca": {
    ar: ["خط هاسن كازابلانكا (Hacen Casablanca) خط عربي سميك من سلسلة Hacen، بحروف عريضة وقوية.", "مناسب للعناوين الكبيرة والملصقات والإعلانات التي تحتاج وضوحاً من بعيد.", CHECK_AR],
    en: ["Hacen Casablanca is a bold Arabic typeface from the Hacen series, with wide, strong letters.", "It works for large headings, posters and ads that must read clearly from a distance.", CHECK_EN],
  },
  "hacen-algeria": {
    ar: ["خط هاسن الجزائر (Hacen Algeria) خط عربي من سلسلة Hacen، بحروف عريضة واضحة وطابع إعلاني.", "يناسب العناوين والإعلانات وتصاميم وسائل التواصل.", CHECK_AR],
    en: ["Hacen Algeria is an Arabic typeface from the Hacen series, with wide, clear letters and an advertising feel.", "It suits headings, ads and social media designs.", CHECK_EN],
  },
  "hacen-maghreb": {
    ar: ["خط هاسن المغرب (Hacen Maghreb) خط عربي سميك جداً من سلسلة Hacen، بحروف هندسية مسطحة.", "يصلح للعناوين القصيرة والشعارات والتصاميم الجريئة.", CHECK_AR],
    en: ["Hacen Maghreb is a very bold Arabic typeface from the Hacen series, with flat geometric letters.", "It suits short headings, logos and bold designs.", CHECK_EN],
  },
  "hacen-promoter": {
    ar: ["خط هاسن بروموتر (Hacen Promoter) خط عرض عربي ثقيل من سلسلة Hacen، بحروف ممتدة أفقياً وزوايا حادة.", "صُمم للإعلانات والعروض الترويجية والعناوين اللافتة.", CHECK_AR],
    en: ["Hacen Promoter is a heavy Arabic display typeface from the Hacen series, with horizontally stretched letters and sharp corners.", "It is made for ads, promotions and eye-catching headings.", CHECK_EN],
  },
  hacensaudiarabia: {
    ar: ["خط هاسن السعودية (Hacen Saudi Arabia) خط عربي حديث من سلسلة Hacen، بحروف واسعة واضحة.", "يناسب العناوين والإعلانات والتصاميم التجارية والهويات.", CHECK_AR],
    en: ["Hacen Saudi Arabia is a modern Arabic typeface from the Hacen series, with wide, clear letters.", "It suits headings, ads, commercial designs and brand identities.", CHECK_EN],
  },
  "droidkufi-regular": {
    ar: ["خط درويد كوفي (Droid Arabic Kufi) خط عربي هندسي من عائلة Droid التي صُممت أصلاً لنظام أندرويد.", "حروفه واضحة على الشاشات الصغيرة، فيناسب التطبيقات والمواقع والعناوين.", CHECK_AR],
    en: ["Droid Arabic Kufi is a geometric Arabic typeface from the Droid family, originally made for Android.", "Its letters stay clear on small screens, suiting apps, websites and headings.", CHECK_EN],
  },
  "droidnaskh-regular": {
    ar: ["خط درويد نسخ (Droid Arabic Naskh) خط عربي بسيط من عائلة Droid التي صُممت لنظام أندرويد.", "حروفه هادئة وواضحة على الشاشات، فيصلح للنصوص في التطبيقات والمواقع.", CHECK_AR],
    en: ["Droid Arabic Naskh is a simple Arabic typeface from the Droid family made for Android.", "Its calm, clear letters work for text in apps and websites.", CHECK_EN],
  },
  "tasees-saudi": {
    ar: ["خط تأسيس السعودي (Tasees Saudi) خط عربي بطابع يدوي قريب من الرقعة، بحروف مائلة وسريعة.", "يُستخدم كثيراً في تصاميم المناسبات الوطنية والمنشورات التي تحتاج لمسة يدوية.", CHECK_AR],
    en: ["Tasees Saudi is an Arabic typeface with a handwritten feel close to Ruqaa, with slanted, quick letters.", "It is often used for national-occasion designs and posts that need a handwritten touch.", CHECK_EN],
  },
  dthuluth: {
    ar: ["خط د. ثلث (Dthuluth) خط عربي رفيع بأسلوب الثلث، بحروف طويلة وانحناءات واسعة.", "يناسب العناوين الزخرفية والدعوات واللوحات حيث يكون الحجم كبيراً.", CHECK_AR],
    en: ["Dthuluth is a fine Arabic typeface in the Thuluth style, with tall letters and wide curves.", "It suits decorative headings, invitations and artwork at large sizes.", CHECK_EN],
  },
  "ge-thuluth-light": {
    ar: ["خط GE Thuluth Light خط ثلث رقمي رفيع من عائلة GE، بحروف أنيقة ممتدة.", "يصلح للعناوين والدعوات والتصاميم الإسلامية والزخرفية.", COMMERCIAL_AR],
    en: ["GE Thuluth Light is a fine digital Thuluth typeface from the GE family, with elegant, extended letters.", "It suits headings, invitations and Islamic or decorative designs.", COMMERCIAL_EN],
  },
  "uthmantn1-ver07": {
    ar: ["خط عثمان طه (Uthman Taha Naskh) خط نسخ مستوحى من خط الخطاط عثمان طه الذي كتب مصحف المدينة النبوية.", "يُستخدم في النصوص القرآنية والدينية، وراجع النص دائماً مع مصدر موثوق قبل النشر.", CHECK_AR],
    en: ["Uthman Taha Naskh is a Naskh typeface inspired by the hand of calligrapher Uthman Taha, who wrote the Madinah Mushaf.", "It is used for Quranic and religious texts; always check the text against a trusted source before publishing.", CHECK_EN],
  },
  wafeq: {
    ar: ["خط وافق (Wafeq) خط عربي ولاتيني حديث صممه راسموس أندرسون وعزة علم الدين، بحروف هندسية متوازنة.", "مناسب للواجهات الرقمية والتطبيقات والهويات البصرية ثنائية اللغة.", OFL_AR],
    en: ["Wafeq is a modern Arabic and Latin typeface by Rasmus Andersson and Azza Alameddine, with balanced geometric letters.", "It suits digital interfaces, apps and bilingual brand identities.", OFL_EN],
  },
  alyamama: {
    ar: ["خط اليمامة (Alyamama) خط عربي حديث صممه يزيد عمر، بحروف هندسية سميكة وطابع كوفي معاصر.", "يناسب العناوين والهويات البصرية والإعلانات.", OFL_AR],
    en: ["Alyamama is a modern Arabic typeface by Yazeed Omar, with bold geometric letters and a contemporary Kufi feel.", "It suits headings, brand identities and ads.", OFL_EN],
  },
};

export function getFontProfile(slug: string): Profile | undefined {
  return fontProfiles[slug];
}

// The meta description: the profile's first sentence when it fits.
export function profileDescription(slug: string, locale: "ar" | "en"): string | undefined {
  const first = fontProfiles[slug]?.[locale][0];
  return first && first.length <= 160 ? first : undefined;
}

// Arabic meta description, shared by FontDetails.tsx and server/seoHtml.ts.
export function arabicFontDescription(font: { slug: string; name: string; nameArabic: string; fileFormat: string; category?: string; designer?: string | null; specs?: FontSpecs }): string {
  return profileDescription(font.slug, "ar")
    ?? specsDescriptionAr(font)
    ?? `حمّل خط ${font.nameArabic} بصيغة ${font.fileFormat}. راجع التصنيف والمصمم والترخيص والمصدر قبل استخدام ملف الخط.`;
}
