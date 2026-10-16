import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Clipboard,
  Download,
  ImagePlus,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import { SEOHead } from "@/components/SEOHead";

type ToolLocale = "ar" | "en" | "fr";
const toolLocale: ToolLocale =
  typeof window !== "undefined" && window.location.pathname.startsWith("/fr/")
    ? "fr"
    : typeof window !== "undefined" && window.location.pathname.startsWith("/en/")
      ? "en"
      : "ar";

const toolTranslations: Record<Exclude<ToolLocale, "ar">, Record<string, string>> = {
  en: {
    "وجه ضخم، تعبير مبالغ فيه، ألوان قوية، وعنصر كبير": "Large close-up, expressive face, bold colors, and a prominent object",
    "شخصية وخلفية بسيطة وتعبير كوميدي ونص قصير": "Simple background, humorous expression, and a short title",
    "ألوان قوية وقصّات حادة وعناصر رياضية أو ترفيهية": "Bold colors, sharp crops, and sports or entertainment elements",
    "صورة شخصية واضحة وخلفية مذهلة وعنصر يثير الفضول": "Clear subject, striking background, and a curiosity-driving focal point",
    "عدة أشخاص وتعبيرات مختلفة وتكوين مزدحم منظم": "Several people, varied expressions, and a carefully arranged busy composition",
    "تصميم نظيف جداً وشخصية واحدة ونص واضح": "Clean layout, one subject, and clear text",
    "لقطة سينمائية واقعية وحركة وإحساس بالمغامرة": "Cinematic, realistic shot with motion and a sense of adventure",
    "لقطة عفوية وموقف غريب أو مضحك وألوان طبيعية": "Candid moment, unusual or funny situation, and natural colors",
    "مشهد ضخم جداً وشخص صغير نسبياً وتحدٍ واضح": "Large-scale scene, relatively small subject, and a clear challenge",
    "تعبير شديد وZoom على الوجه وعناصر غريبة": "Strong expression, close-up face, and unusual elements",
    "منشئ صور مصغرة لليوتيوب بالذكاء الاصطناعي باللغة العربية. حوّل فكرة الفيديو إلى Thumbnail احترافي بمقاس 1280×720 مع عنوان عربي واضح وتصميم مناسب لرفع نسبة النقر.": "AI YouTube thumbnail maker for Arabic videos. Turn a video idea into a 1280×720 thumbnail with a clear Arabic title and a design that reflects the video.",
    "منشئ الصور المصغرة لليوتيوب": "YouTube Thumbnail Maker",
    "إنشاء صور مصغرة لليوتيوب بمقاس 1280×720": "Create YouTube thumbnails at 1280×720",
    "دعم النصوص العربية واتجاه الكتابة من اليمين إلى اليسار": "Arabic text support and right-to-left layout",
    "رفع صورة شخصية أو منتج كعنصر رئيسي": "Upload a person or product as the main subject",
    "اختيار أسلوب بصري مناسب لمحتوى الفيديو": "Choose a visual style for the video",
    "كيف أصنع صورة مصغرة احترافية لليوتيوب؟": "How do I make a professional YouTube thumbnail?",
    "اكتب فكرة الفيديو أو عنوانه، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ صورة مصغرة بمقاس 1280×720.": "Enter the video idea or title, choose a visual style, add a person or product image if useful, then create a 1280×720 thumbnail.",
    "ما المقاس المناسب لصورة Thumbnail في يوتيوب؟": "What size should a YouTube thumbnail be?",
    "المقاس المستخدم هنا هو 1280×720 بنسبة 16:9، وهو مناسب لعرض الصور المصغرة على يوتيوب والأجهزة المختلفة.": "This tool creates 1280×720 images in a 16:9 ratio for YouTube and common display sizes.",
    "هل يدعم منشئ الصور المصغرة الكتابة العربية؟": "Does the thumbnail maker support Arabic text?",
    "نعم، صُمم المنشئ لدعم العناوين العربية واتجاه الكتابة من اليمين إلى اليسار مع الحفاظ على النص الذي تدخله.": "Yes. The maker supports Arabic titles and right-to-left text while preserving the wording you enter.",
    "صورة مصغرة بأسلوب": "Thumbnail in the style",
    "مساحة النتيجة": "Preview",
    "نولّد الصورة المصغرة الآن…": "Generating your thumbnail…",
    "الوقت المنقضي:": "Time elapsed:",
    "الصورة": "Image",
    "الإجمالي": "Total",
    "جاهزة للنشر": "Ready to review",
    "تحميل الصورة": "Download image",
    "إعادة التوليد": "Generate again",
    "تم نسخ prompt": "Prompt copied",
    "نسخ prompt": "Copy prompt",
    "صورتك المصغرة ستظهر هنا": "Your thumbnail will appear here",
    "اكتب فكرة الفيديو، اختر الأسلوب، ثم اضغط إنشاء لتحصل على Thumbnail": "Enter a video idea, choose a style, then generate a thumbnail",
    "جاهز لليوتيوب.": "ready for YouTube.",
    "الأسلوب الحالي:": "Current style:",
    "عربي RTL": "Arabic · RTL",
    "تعذر قراءة الصورة. جرّب صورة أخرى.": "Could not read the image. Try another file.",
    "مثال: جربت أرخص ميكروفون لمدة 30 يوماً": "Example: I tried the cheapest microphone for 30 days",
    "أضف الشخصية أو المنتج": "Add a person or product",
    "صورة شخص أو منتج تريد أن يظهر كعنصر رئيسي": "Upload a person or product to use as the main subject",
    "اختياري": "Optional",
    "سيستخدمها الذكاء الاصطناعي كبطل للمشهد": "The AI will use it as the scene’s main subject",
    "حذف صورة البطل": "Remove subject image",
    "ارفع صورة البطل": "Upload a subject image",
    "PNG أو JPG أو WebP — حتى 6MB": "PNG, JPG, or WebP — up to 6 MB",
    "اختر أسلوب الصورة": "Choose a visual style",
    "10 ستايلات مستوحاة من تغليف صور صناع المحتوى": "10 styles inspired by creator-thumbnail conventions",
    "اختيار ستايل المشاهير": "Choose a creator-inspired style",
    "اختر أسلوب المشاهير": "Choose a creator-inspired style",
    "هذه مراجع بصرية عامة وليست نسخاً لوجوه المشاهير أو شعاراتهم؛ سيتم بناء تكوين أصلي لكل فكرة.": "These are general visual references, not copies of creators’ faces or logos. Each idea gets an original composition.",
    "شاهد الـ prompt الاحترافي قبل التوليد": "Preview the generation prompt",
    "نكتب الـ prompt ونبني المشهد…": "Preparing the prompt and building the scene…",
    "حوّل الفكرة وولّد الصورة": "Create thumbnail",
    "YouTube Thumbnail Maker بالعربي": "YouTube Thumbnail Maker for Arabic",
    "منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي": "AI YouTube Thumbnail Maker",
    "أنشئ صورة مصغّرة احترافية لليوتيوب من فكرة بسيطة. يساعدك xfontat على تحويل عنوان الفيديو إلى تصميم Thumbnail واضح وجذاب بمقاس 1280×720، مع دعم العناوين العربية، الألوان المتباينة، وترتيب بصري يجعل موضوع الفيديو مفهوماً من النظرة الأولى.": "Create a YouTube thumbnail from a simple idea. xfontat turns a video title into a clear 1280×720 design with Arabic text, strong contrast, and a visual composition that communicates the subject at a glance.",
    "صورة مصغرة واضحة وقابلة للنقر": "Clear, compelling thumbnails",
    "تكوين بسيط، عنصر رئيسي واضح، وتباين قوي يساعد المشاهد على فهم موضوع الفيديو بسرعة من نتائج البحث والاقتراحات.": "A clear subject and strong contrast help viewers understand the video topic in search results and recommendations.",
    "دعم كامل للخط العربي": "Arabic text support",
    "أضف عنوان الفيديو بالعربية، وسيحافظ التصميم على اتجاه النص من اليمين إلى اليسار مع إبقائه مقروءاً على الهاتف.": "Enter an Arabic title; the design keeps right-to-left text legible on mobile.",
    "تصميم مرتبط بفكرة الفيديو": "Design tied to the video idea",
    "لا يضيف كلمات عشوائية أو شعارات مضللة؛ بل يربط المشهد بعنوان الفيديو ليساعد على تحسين الصلة ورفع فرصة النقر.": "The scene follows the video idea rather than adding unrelated words or misleading logos.",
    "كيف تنشئ Thumbnail مناسبة لفيديو يوتيوب؟": "How do you create a YouTube thumbnail?",
    "اكتب فكرة الفيديو أو عنوانه الأساسي بوضوح.": "Clearly enter the video idea or main title.",
    "أضف صورة الشخصية أو المنتج إذا كان جزءاً مهماً من المحتوى.": "Add a person or product image if it is important to the video.",
    "اختر أسلوباً مناسباً لمجال القناة والجمهور المستهدف.": "Choose a style suited to the channel and its audience.",
    "راجع الصورة وتأكد من وضوحها قبل استخدامها على يوتيوب.": "Review the image and check its readability before using it.",
    "هل الصورة المصغرة تحسن SEO لليوتيوب؟": "Can a thumbnail improve YouTube SEO?",
    "الصورة المصغرة لا تستبدل عنوان الفيديو أو وصفه أو الكلمات المفتاحية، لكنها تساعد على تحسين الصلة البصرية ورفع نسبة النقر عندما تعكس محتوى الفيديو بصدق. لذلك يجمع هذا المنشئ بين عنوان عربي واضح ومشهد مرتبط بفكرة الفيديو، بدلاً من استخدام Clickbait مضلل.": "A thumbnail does not replace a video title, description, or keywords. It can make the topic clearer and may support clicks when it honestly reflects the video. This tool pairs an Arabic title with a related scene rather than misleading clickbait.",
    "أسئلة شائعة عن صور YouTube المصغرة": "YouTube thumbnail FAQs",
    "اكتب فكرة الفيديو، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ الصورة بمقاس 1280×720.": "Enter the video idea, choose a style, add a person or product image if useful, then create a 1280×720 thumbnail.",
    "المقاس المناسب هنا هو 1280×720 بنسبة 16:9، ليظهر جيداً على الهاتف والكمبيوتر وصفحات الاقتراحات.": "The tool creates 1280×720 images in a 16:9 ratio for display on phones, computers, and recommendation pages.",
    "هل يدعم المنشئ العناوين العربية؟": "Does the maker support Arabic titles?",
    "نعم، يدعم النص العربي واتجاه الكتابة من اليمين إلى اليسار ويحافظ على العنوان الذي تدخله داخل التصميم.": "Yes. It supports Arabic and right-to-left text, and preserves the title you enter in the design.",
    "تعذر إنشاء الصورة.": "Could not generate the image.",
    "تعذر إنشاء الصورة الآن.": "The image could not be generated right now.",
    "اختر صورة بصيغة PNG أو JPG أو WebP.": "Choose a PNG, JPG, or WebP image.",
    "حجم صورة البطل كبير. اختر صورة أصغر من 6MB.": "The subject image is too large. Choose an image under 6 MB.",
    "ابدأ من فكرة الفيديو": "Start with the video idea",
    "ماذا سيشاهد الجمهور؟": "What will the audience see?",
    "معاينة بطل الصورة": "Main subject preview",
    "إنشاء صورة مصغرة احترافية لليوتيوب بمقاس 1280×720.": "Create a professional 1280×720 YouTube thumbnail.",
    "فكرة الفيديو:": "Video idea:",
    "الأسلوب:": "Style:",
    "مساحة العمل": "Workspace",
    "اكتب فكرة الفيديو هنا": "Enter the video idea here",
    "استخدم قواعد تغليف صور صناع المحتوى كمرجع عام فقط، بدون نسخ وجه المشهور أو شعاره أو هويته أو تكوين صورته حرفياً.": "Use creator-thumbnail conventions only as general visual references. Do not copy a creator’s face, logo, identity, or exact composition.",
    "لا تضف أي كلمات أو شعارات أو علامات مائية أخرى. يجب أن يكون العنوان العربي هو النص الوحيد داخل الصورة.": "Do not add other words, logos, or watermarks. The exact Arabic title must be the only text in the image.",
  },
  fr: {
    "وجه ضخم، تعبير مبالغ فيه، ألوان قوية، وعنصر كبير": "Visage en gros plan, expression marquée, couleurs fortes et objet central",
    "شخصية وخلفية بسيطة وتعبير كوميدي ونص قصير": "Fond simple, expression comique et texte court",
    "ألوان قوية وقصّات حادة وعناصر رياضية أو ترفيهية": "Couleurs fortes, cadrage dynamique et éléments sportifs ou de divertissement",
    "صورة شخصية واضحة وخلفية مذهلة وعنصر يثير الفضول": "Sujet bien visible, décor saisissant et élément qui pique la curiosité",
    "عدة أشخاص وتعبيرات مختلفة وتكوين مزدحم منظم": "Plusieurs personnes, expressions variées et composition dense mais organisée",
    "تصميم نظيف جداً وشخصية واحدة ونص واضح": "Mise en page épurée, sujet unique et texte lisible",
    "لقطة سينمائية واقعية وحركة وإحساس بالمغامرة": "Image cinématographique réaliste, mouvement et esprit d’aventure",
    "لقطة عفوية وموقف غريب أو مضحك وألوان طبيعية": "Moment spontané, situation insolite ou drôle et couleurs naturelles",
    "مشهد ضخم جداً وشخص صغير نسبياً وتحدٍ واضح": "Scène à grande échelle, sujet relativement petit et défi évident",
    "تعبير شديد وZoom على الوجه وعناصر غريبة": "Expression intense, gros plan du visage et éléments insolites",
    "منشئ صور مصغرة لليوتيوب بالذكاء الاصطناعي باللغة العربية. حوّل فكرة الفيديو إلى Thumbnail احترافي بمقاس 1280×720 مع عنوان عربي واضح وتصميم مناسب لرفع نسبة النقر.": "Créateur de miniatures YouTube par IA pour les vidéos en arabe. Transformez une idée en miniature 1280×720 avec un titre arabe lisible et une composition fidèle au sujet.",
    "منشئ الصور المصغرة لليوتيوب": "Créateur de miniatures YouTube",
    "إنشاء صور مصغرة لليوتيوب بمقاس 1280×720": "Créer des miniatures YouTube au format 1280×720",
    "دعم النصوص العربية واتجاه الكتابة من اليمين إلى اليسار": "Prise en charge de l’arabe et de l’écriture de droite à gauche",
    "رفع صورة شخصية أو منتج كعنصر رئيسي": "Ajouter une personne ou un produit comme sujet principal",
    "اختيار أسلوب بصري مناسب لمحتوى الفيديو": "Choisir un style visuel adapté à la vidéo",
    "كيف أصنع صورة مصغرة احترافية لليوتيوب؟": "Comment créer une miniature YouTube professionnelle ?",
    "اكتب فكرة الفيديو أو عنوانه، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ صورة مصغرة بمقاس 1280×720.": "Saisissez l’idée ou le titre de la vidéo, choisissez un style visuel, ajoutez une personne ou un produit si nécessaire, puis créez une miniature 1280×720.",
    "ما المقاس المناسب لصورة Thumbnail في يوتيوب؟": "Quel est le format d’une miniature YouTube ?",
    "المقاس المستخدم هنا هو 1280×720 بنسبة 16:9، وهو مناسب لعرض الصور المصغرة على يوتيوب والأجهزة المختلفة.": "L’outil crée des images 1280×720 au format 16:9 pour YouTube et les tailles d’affichage courantes.",
    "هل يدعم منشئ الصور المصغرة الكتابة العربية؟": "Le créateur prend-il en charge le texte arabe ?",
    "نعم، صُمم المنشئ لدعم العناوين العربية واتجاه الكتابة من اليمين إلى اليسار مع الحفاظ على النص الذي تدخله.": "Oui. Il prend en charge les titres arabes et l’écriture de droite à gauche, en conservant le texte saisi.",
    "صورة مصغرة بأسلوب": "Miniature dans le style",
    "مساحة النتيجة": "Aperçu",
    "نولّد الصورة المصغرة الآن…": "Création de votre miniature…",
    "الوقت المنقضي:": "Temps écoulé :",
    "الصورة": "Image",
    "الإجمالي": "Total",
    "جاهزة للنشر": "Prête à vérifier",
    "تحميل الصورة": "Télécharger l’image",
    "إعادة التوليد": "Générer à nouveau",
    "تم نسخ prompt": "Prompt copié",
    "نسخ prompt": "Copier le prompt",
    "صورتك المصغرة ستظهر هنا": "Votre miniature apparaîtra ici",
    "اكتب فكرة الفيديو، اختر الأسلوب، ثم اضغط إنشاء لتحصل على Thumbnail": "Saisissez une idée, choisissez un style, puis créez une miniature",
    "جاهز لليوتيوب.": "prête pour YouTube.",
    "الأسلوب الحالي:": "Style actuel :",
    "عربي RTL": "Arabe · droite à gauche",
    "تعذر قراءة الصورة. جرّب صورة أخرى.": "Impossible de lire l’image. Essayez un autre fichier.",
    "مثال: جربت أرخص ميكروفون لمدة 30 يوماً": "Exemple : j’ai testé le micro le moins cher pendant 30 jours",
    "أضف الشخصية أو المنتج": "Ajouter une personne ou un produit",
    "صورة شخص أو منتج تريد أن يظهر كعنصر رئيسي": "Ajoutez une personne ou un produit comme sujet principal",
    "اختياري": "Facultatif",
    "سيستخدمها الذكاء الاصطناعي كبطل للمشهد": "L’IA l’utilisera comme sujet principal de la scène",
    "حذف صورة البطل": "Supprimer l’image du sujet",
    "ارفع صورة البطل": "Importer l’image du sujet",
    "PNG أو JPG أو WebP — حتى 6MB": "PNG, JPG ou WebP — jusqu’à 6 Mo",
    "اختر أسلوب الصورة": "Choisir un style visuel",
    "10 ستايلات مستوحاة من تغليف صور صناع المحتوى": "10 styles inspirés des codes visuels des créateurs",
    "اختيار ستايل المشاهير": "Choisir un style inspiré d’un créateur",
    "اختر أسلوب المشاهير": "Choisir un style inspiré d’un créateur",
    "هذه مراجع بصرية عامة وليست نسخاً لوجوه المشاهير أو شعاراتهم؛ سيتم بناء تكوين أصلي لكل فكرة.": "Ce sont des références visuelles générales, pas des copies de visages ou de logos. Chaque idée reçoit une composition originale.",
    "شاهد الـ prompt الاحترافي قبل التوليد": "Prévisualiser le prompt avant la génération",
    "نكتب الـ prompt ونبني المشهد…": "Préparation du prompt et de la scène…",
    "حوّل الفكرة وولّد الصورة": "Créer la miniature",
    "YouTube Thumbnail Maker بالعربي": "Créateur de miniatures YouTube en arabe",
    "منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي": "Créateur de miniatures YouTube par IA",
    "أنشئ صورة مصغّرة احترافية لليوتيوب من فكرة بسيطة. يساعدك xfontat على تحويل عنوان الفيديو إلى تصميم Thumbnail واضح وجذاب بمقاس 1280×720، مع دعم العناوين العربية، الألوان المتباينة، وترتيب بصري يجعل موضوع الفيديو مفهوماً من النظرة الأولى.": "Créez une miniature YouTube à partir d’une idée simple. xfontat transforme le titre en visuel 1280×720, avec texte arabe, contraste marqué et composition qui présente le sujet immédiatement.",
    "صورة مصغرة واضحة وقابلة للنقر": "Miniature claire et attractive",
    "تكوين بسيط، عنصر رئيسي واضح، وتباين قوي يساعد المشاهد على فهم موضوع الفيديو بسرعة من نتائج البحث والاقتراحات.": "Un sujet visible et un contraste marqué aident à comprendre rapidement le thème dans les résultats et recommandations.",
    "دعم كامل للخط العربي": "Prise en charge du texte arabe",
    "أضف عنوان الفيديو بالعربية، وسيحافظ التصميم على اتجاه النص من اليمين إلى اليسار مع إبقائه مقروءاً على الهاتف.": "Ajoutez un titre en arabe : la composition conserve l’écriture de droite à gauche et sa lisibilité sur mobile.",
    "تصميم مرتبط بفكرة الفيديو": "Visuel lié au sujet de la vidéo",
    "لا يضيف كلمات عشوائية أو شعارات مضللة؛ بل يربط المشهد بعنوان الفيديو ليساعد على تحسين الصلة ورفع فرصة النقر.": "La scène suit le sujet de la vidéo au lieu d’ajouter des mots sans rapport ou des logos trompeurs.",
    "كيف تنشئ Thumbnail مناسبة لفيديو يوتيوب؟": "Comment créer une miniature pour une vidéo YouTube ?",
    "اكتب فكرة الفيديو أو عنوانه الأساسي بوضوح.": "Saisissez clairement l’idée ou le titre principal de la vidéo.",
    "أضف صورة الشخصية أو المنتج إذا كان جزءاً مهماً من المحتوى.": "Ajoutez une personne ou un produit s’il joue un rôle important dans la vidéo.",
    "اختر أسلوباً مناسباً لمجال القناة والجمهور المستهدف.": "Choisissez un style adapté à la chaîne et à son public.",
    "راجع الصورة وتأكد من وضوحها قبل استخدامها على يوتيوب.": "Vérifiez la lisibilité de l’image avant de la publier sur YouTube.",
    "هل الصورة المصغرة تحسن SEO لليوتيوب؟": "Une miniature améliore-t-elle le référencement YouTube ?",
    "الصورة المصغرة لا تستبدل عنوان الفيديو أو وصفه أو الكلمات المفتاحية، لكنها تساعد على تحسين الصلة البصرية ورفع نسبة النقر عندما تعكس محتوى الفيديو بصدق. لذلك يجمع هذا المنشئ بين عنوان عربي واضح ومشهد مرتبط بفكرة الفيديو، بدلاً من استخدام Clickbait مضلل.": "Une miniature ne remplace ni le titre, ni la description, ni les mots-clés. Elle clarifie le sujet et peut favoriser les clics si elle représente fidèlement la vidéo. Cet outil associe donc un titre arabe à une scène pertinente, sans piège à clics trompeur.",
    "أسئلة شائعة عن صور YouTube المصغرة": "Questions fréquentes sur les miniatures YouTube",
    "اكتب فكرة الفيديو، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ الصورة بمقاس 1280×720.": "Saisissez l’idée de la vidéo, choisissez un style, ajoutez une personne ou un produit si nécessaire, puis créez l’image au format 1280×720.",
    "المقاس المناسب هنا هو 1280×720 بنسبة 16:9، ليظهر جيداً على الهاتف والكمبيوتر وصفحات الاقتراحات.": "Le format utilisé est 1280×720 au ratio 16:9, adapté aux téléphones, ordinateurs et recommandations.",
    "هل يدعم المنشئ العناوين العربية؟": "Le créateur prend-il en charge les titres arabes ?",
    "نعم، يدعم النص العربي واتجاه الكتابة من اليمين إلى اليسار ويحافظ على العنوان الذي تدخله داخل التصميم.": "Oui. Il prend en charge l’arabe, l’écriture de droite à gauche et conserve le titre saisi dans le visuel.",
    "تعذر إنشاء الصورة.": "Impossible de créer l’image.",
    "تعذر إنشاء الصورة الآن.": "La création de l’image est momentanément impossible.",
    "اختر صورة بصيغة PNG أو JPG أو WebP.": "Choisissez une image PNG, JPG ou WebP.",
    "حجم صورة البطل كبير. اختر صورة أصغر من 6MB.": "L’image du sujet est trop volumineuse. Choisissez un fichier de moins de 6 Mo.",
    "ابدأ من فكرة الفيديو": "Commencer par l’idée de la vidéo",
    "ماذا سيشاهد الجمهور؟": "Que verra le public ?",
    "معاينة بطل الصورة": "Aperçu du sujet principal",
    "إنشاء صورة مصغرة احترافية لليوتيوب بمقاس 1280×720.": "Créer une miniature YouTube professionnelle au format 1280×720.",
    "فكرة الفيديو:": "Idée de la vidéo :",
    "الأسلوب:": "Style :",
    "مساحة العمل": "Espace de travail",
    "اكتب فكرة الفيديو هنا": "Saisissez l’idée de la vidéo",
    "استخدم قواعد تغليف صور صناع المحتوى كمرجع عام فقط، بدون نسخ وجه المشهور أو شعاره أو هويته أو تكوين صورته حرفياً.": "Utilisez les codes visuels des créateurs comme références générales. Ne copiez ni visage, ni logo, ni identité, ni composition exacte.",
    "لا تضف أي كلمات أو شعارات أو علامات مائية أخرى. يجب أن يكون العنوان العربي هو النص الوحيد داخل الصورة.": "N’ajoutez aucun autre mot, logo ou filigrane. Le titre arabe exact doit être le seul texte de l’image.",
  },
};

function t(arabic: string): string {
  if (toolLocale === "ar") return arabic;
  return toolTranslations[toolLocale][arabic] ?? arabic;
}

const styles = [
  {
    id: "mrbeast",
    label: "MrBeast Style",
    description: t("وجه ضخم، تعبير مبالغ فيه، ألوان قوية، وعنصر كبير"),
  },
  {
    id: "pewdiepie",
    label: "PewDiePie Style",
    description: t("شخصية وخلفية بسيطة وتعبير كوميدي ونص قصير"),
  },
  {
    id: "ksi",
    label: "KSI Style",
    description: t("ألوان قوية وقصّات حادة وعناصر رياضية أو ترفيهية"),
  },
  {
    id: "logan-paul",
    label: "Logan Paul Style",
    description: t("صورة شخصية واضحة وخلفية مذهلة وعنصر يثير الفضول"),
  },
  {
    id: "sidemen",
    label: "Sidemen Style",
    description: t("عدة أشخاص وتعبيرات مختلفة وتكوين مزدحم منظم"),
  },
  {
    id: "ali-abdaal",
    label: "Ali Abdaal Style",
    description: t("تصميم نظيف جداً وشخصية واحدة ونص واضح"),
  },
  {
    id: "casey-neistat",
    label: "Casey Neistat Style",
    description: t("لقطة سينمائية واقعية وحركة وإحساس بالمغامرة"),
  },
  {
    id: "ryan-trahan",
    label: "Ryan Trahan Style",
    description: t("لقطة عفوية وموقف غريب أو مضحك وألوان طبيعية"),
  },
  {
    id: "airrack",
    label: "Airrack Style",
    description: t("مشهد ضخم جداً وشخص صغير نسبياً وتحدٍ واضح"),
  },
  {
    id: "ishowspeed",
    label: "IShowSpeed Style",
    description: t("تعبير شديد وZoom على الوجه وعناصر غريبة"),
  },
] as const;

const youtubeThumbnailDescription = t(
  "منشئ صور مصغرة لليوتيوب بالذكاء الاصطناعي باللغة العربية. حوّل فكرة الفيديو إلى Thumbnail احترافي بمقاس 1280×720 مع عنوان عربي واضح وتصميم مناسب لرفع نسبة النقر.",
);

const youtubeThumbnailSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: t("منشئ الصور المصغرة لليوتيوب"),
      alternateName: "AI YouTube Thumbnail Maker",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: `https://xfontat.com${toolLocale === "ar" ? "" : `/${toolLocale}`}/youtube-thumbnail-maker`,
      description: youtubeThumbnailDescription,
      inLanguage: toolLocale,
      featureList: [
        t("إنشاء صور مصغرة لليوتيوب بمقاس 1280×720"),
        t("دعم النصوص العربية واتجاه الكتابة من اليمين إلى اليسار"),
        t("رفع صورة شخصية أو منتج كعنصر رئيسي"),
        t("اختيار أسلوب بصري مناسب لمحتوى الفيديو"),
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: t("كيف أصنع صورة مصغرة احترافية لليوتيوب؟"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("اكتب فكرة الفيديو أو عنوانه، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ صورة مصغرة بمقاس 1280×720."),
          },
        },
        {
          "@type": "Question",
          name: t("ما المقاس المناسب لصورة Thumbnail في يوتيوب؟"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("المقاس المستخدم هنا هو 1280×720 بنسبة 16:9، وهو مناسب لعرض الصور المصغرة على يوتيوب والأجهزة المختلفة."),
          },
        },
        {
          "@type": "Question",
          name: t("هل يدعم منشئ الصور المصغرة الكتابة العربية؟"),
          acceptedAnswer: {
            "@type": "Answer",
            text: t("نعم، صُمم المنشئ لدعم العناوين العربية واتجاه الكتابة من اليمين إلى اليسار مع الحفاظ على النص الذي تدخله."),
          },
        },
      ],
    },
  ],
};

type StyleId = (typeof styles)[number]["id"];

type GenerationResult = {
  image: string;
  prompt: string;
  timings?: {
    promptMs: number;
    imageMs: number;
    totalMs: number;
  };
  style: {
    label: string;
    arabicLabel: string;
  };
};

function formatDuration(milliseconds: number): string {
  const seconds = Math.max(0, Math.round(milliseconds / 1000));
  if (seconds < 60) return toolLocale === "ar" ? `${seconds} ث` : `${seconds} sec`;
  const minutes = Math.floor(seconds / 60);
  return toolLocale === "ar"
    ? `${minutes} د ${String(seconds % 60).padStart(2, "0")} ث`
    : `${minutes} min ${String(seconds % 60).padStart(2, "0")} sec`;
}

type WorkspacePreviewProps = {
  result: GenerationResult | null;
  isGenerating: boolean;
  elapsedMs: number;
  style: (typeof styles)[number];
  copied: boolean;
  onGenerate: () => void;
  onCopy: () => void;
};

function WorkspacePreview({
  result,
  isGenerating,
  elapsedMs,
  style,
  copied,
  onGenerate,
  onCopy,
}: WorkspacePreviewProps) {
  return (
    <div className="order-2 rounded-[26px] border border-white/[.09] bg-[#111918]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between border-b border-white/[.08] pb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#65f2c0]/15 text-xs text-[#65f2c0]">
            2
          </span>
          {t("مساحة النتيجة")}
        </div>
        <span className="font-mono text-[10px] text-[#566760]">
          WORKSPACE / 16:9
        </span>
      </div>

      {isGenerating ? (
        <div className="grid min-h-[420px] place-items-center rounded-3xl border border-white/[.08] bg-[#0b1110] text-[#8da198]">
          <div className="text-center">
            <LoaderCircle
              size={34}
              className="mx-auto mb-3 animate-spin text-[#65f2c0]"
            />
            <p className="text-sm">{t("نولّد الصورة المصغرة الآن…")}</p>
            <p className="mt-2 font-mono text-[11px] text-[#65f2c0]">
              {t("الوقت المنقضي:")} {formatDuration(elapsedMs)}
            </p>
          </div>
        </div>
      ) : result ? (
        <div className="grid gap-4 xl:grid-cols-[1.18fr_.82fr]">
          <div className="relative aspect-video overflow-hidden rounded-3xl border border-white/[.1] bg-[#101615] shadow-2xl">
            <img
              src={result.image}
              alt={`${t("صورة مصغرة بأسلوب")} ${result.style.label}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="rounded-3xl border border-white/[.08] bg-[#0b1110] p-4">
            {result.timings && (
              <div className="mb-4 grid grid-cols-3 gap-2 rounded-2xl border border-[#65f2c0]/15 bg-[#65f2c0]/[.05] p-3 text-center">
                <div>
                  <p className="font-mono text-sm text-[#65f2c0]">
                    {formatDuration(result.timings.promptMs)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#81948a]">prompt</p>
                </div>
                <div>
                  <p className="font-mono text-sm text-[#65f2c0]">
                    {formatDuration(result.timings.imageMs)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#81948a]">{t("الصورة")}</p>
                </div>
                <div>
                  <p className="font-mono text-sm text-[#65f2c0]">
                    {formatDuration(result.timings.totalMs)}
                  </p>
                  <p className="mt-1 text-[10px] text-[#81948a]">{t("الإجمالي")}</p>
                </div>
              </div>
            )}
            <p className="text-xs uppercase tracking-[.15em] text-[#65f2c0]">
              {t("جاهزة للنشر")}
            </p>
            <p className="mt-3 line-clamp-6 whitespace-pre-wrap text-xs leading-6 text-[#9aaca3]">
              {result.prompt}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <a
                href={result.image}
                download="xfontat-youtube-thumbnail.png"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#65f2c0] px-3 py-3 text-xs font-semibold text-[#07100d] transition hover:bg-[#7af6cb]"
              >
                <Download size={14} />
                {t("تحميل الصورة")}
              </a>
              <button
                type="button"
                onClick={onGenerate}
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs text-[#d5e1da] transition hover:border-[#65f2c0]/40"
              >
                <RotateCcw size={14} />
                {t("إعادة التوليد")}
              </button>
            </div>
            <button
              type="button"
              onClick={onCopy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-3 text-xs text-[#aebfb6] transition hover:border-white/20"
            >
              {copied ? <Check size={14} /> : <Clipboard size={14} />}
              {copied ? t("تم نسخ prompt") : t("نسخ prompt")}
            </button>
          </div>
        </div>
      ) : (
        <div className="grid min-h-[420px] place-items-center rounded-3xl border border-dashed border-white/[.12] bg-[#0b1110] p-8 text-center">
          <div>
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-[#65f2c0]/10 text-[#65f2c0]">
              <Sparkles size={27} />
            </div>
            <h2 className="mt-5 text-xl font-medium text-[#e9f5ee]">
              {t("صورتك المصغرة ستظهر هنا")}
            </h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[#81948a]">
              {t("اكتب فكرة الفيديو، اختر الأسلوب، ثم اضغط إنشاء لتحصل على Thumbnail")} {t("جاهز لليوتيوب.")}
            </p>
            <p className="mt-4 text-[11px] text-[#64766d]">
              {t("الأسلوب الحالي:")} {style.label}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 text-[10px] text-[#71837a]">
              <span className="rounded-full border border-white/[.08] px-3 py-2">
                1280×720
              </span>
              <span className="rounded-full border border-white/[.08] px-3 py-2">
                16:9
              </span>
              <span className="rounded-full border border-white/[.08] px-3 py-2">
                {t("عربي RTL")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function createPreviewPrompt(idea: string, style: (typeof styles)[number]) {
  return [
    t("إنشاء صورة مصغرة احترافية لليوتيوب بمقاس 1280×720."),
    `${t("فكرة الفيديو:")} ${idea || t("اكتب فكرة الفيديو هنا")}`,
    `${t("الأسلوب:")} ${style.label} — ${style.description}.`,
    toolLocale === "ar"
      ? `لقطة بصرية واحدة واضحة، موضوع رئيسي قوي، إضاءة سينمائية، وتباين عالٍ. اكتب هذا العنوان العربي داخل الصورة بخط كبير وواضح: «${idea || "اكتب فكرة الفيديو هنا"}»`
      : toolLocale === "fr"
        ? `Une scène visuelle claire, un sujet principal fort, une lumière cinématographique et un contraste élevé. Insérez exactement ce titre arabe, en grand et lisible, sans le traduire ni le modifier : «${idea}».`
        : `Create one clear visual scene with a strong focal subject, cinematic lighting, and high contrast. Render this exact Arabic title prominently and legibly; do not translate or alter it: “${idea}”.`,
    t("استخدم قواعد تغليف صور صناع المحتوى كمرجع عام فقط، بدون نسخ وجه المشهور أو شعاره أو هويته أو تكوين صورته حرفياً."),
    t("لا تضف أي كلمات أو شعارات أو علامات مائية أخرى. يجب أن يكون العنوان العربي هو النص الوحيد داخل الصورة."),
  ].join("\n");
}

export default function YouTubeThumbnailStudio() {
  const [idea, setIdea] = useState("كيف تختار الخط العربي المناسب؟");
  const [selectedStyle, setSelectedStyle] = useState<StyleId>("mrbeast");
  const [stylesOpen, setStylesOpen] = useState(false);
  const [heroImage, setHeroImage] = useState<string | null>(null);
  const [heroImageName, setHeroImageName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [copied, setCopied] = useState(false);

  const style = styles.find((item) => item.id === selectedStyle) ?? styles[0];
  const previewPrompt = useMemo(
    () => createPreviewPrompt(idea, style),
    [idea, style],
  );

  useEffect(() => {
    if (!isGenerating) return;

    const startedAt = performance.now();
    setElapsedMs(0);
    const timer = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt);
    }, 250);

    return () => window.clearInterval(timer);
  }, [isGenerating]);

  async function generateThumbnail() {
    setIsGenerating(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/thumbnail/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, style: selectedStyle, heroImage }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t("تعذر إنشاء الصورة."));
      }

      setResult(data);
    } catch (generationError) {
      setError(
        generationError instanceof Error
          ? generationError.message
          : t("تعذر إنشاء الصورة الآن."),
      );
    } finally {
      setIsGenerating(false);
    }
  }

  function handleHeroImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setError(t("اختر صورة بصيغة PNG أو JPG أو WebP."));
      return;
    }

    if (file.size > 6 * 1024 * 1024) {
      setError(t("حجم صورة البطل كبير. اختر صورة أصغر من 6MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setHeroImage(reader.result);
        setHeroImageName(file.name);
        setError("");
      }
    };
    reader.onerror = () => setError(t("تعذر قراءة الصورة. جرّب صورة أخرى."));
    reader.readAsDataURL(file);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(result?.prompt ?? previewPrompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <>
      <SEOHead
        title={`${t("منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي")} | xfontat`}
        description={youtubeThumbnailDescription}
        path={toolLocale === "ar" ? "/youtube-thumbnail-maker" : `/${toolLocale}/youtube-thumbnail-maker`}
        schema={youtubeThumbnailSchema}
        lang={toolLocale}
        direction={toolLocale === "ar" ? "rtl" : "ltr"}
      />
      <main
        dir={toolLocale === "ar" ? "rtl" : "ltr"}
        className="min-h-screen overflow-hidden bg-[#070b0b] text-[#eef6f0]"
      >
      <div className="pointer-events-none fixed inset-0 opacity-30 [background-image:linear-gradient(rgba(132,255,211,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(132,255,211,.05)_1px,transparent_1px)] [background-size:44px_44px]" />
      <header className="relative z-10 mx-auto flex max-w-[1240px] items-center justify-between border-b border-white/[.07] px-5 py-5 sm:px-9">
        <div className="flex items-center gap-3">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#65f2c0] text-[#08100e]">
            <Sparkles size={17} />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">
              xfontat<span className="text-[#65f2c0]">.</span>
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[.2em] text-[#6f8179]">
              thumbnail studio
            </p>
          </div>
        </div>
        <span className="rounded-full border border-[#65f2c0]/20 bg-[#65f2c0]/[.06] px-3 py-2 text-[10px] text-[#65f2c0]">
          {toolLocale === "fr" ? "Espace de travail" : t("مساحة العمل")}
        </span>
        <nav className="flex gap-2 text-[10px]" aria-label={toolLocale === "fr" ? "Langue" : toolLocale === "en" ? "Language" : "اللغة"}>
          <a className="rounded-full border border-white/10 px-2.5 py-1.5 hover:border-[#65f2c0]/50" href="/en/youtube-thumbnail-maker" hrefLang="en">EN</a>
          <a className="rounded-full border border-white/10 px-2.5 py-1.5 hover:border-[#65f2c0]/50" href="/fr/youtube-thumbnail-maker" hrefLang="fr">FR</a>
          <a className="rounded-full border border-white/10 px-2.5 py-1.5 hover:border-[#65f2c0]/50" href="/youtube-thumbnail-maker" hrefLang="ar">AR</a>
        </nav>
      </header>

      <section className="relative z-10 mx-auto grid max-w-[1240px] gap-8 px-5 pb-14 pt-8 sm:px-9 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start lg:pt-10">
        <WorkspacePreview
          result={result}
          isGenerating={isGenerating}
          elapsedMs={elapsedMs}
          style={style}
          copied={copied}
          onGenerate={generateThumbnail}
          onCopy={copyPrompt}
        />

        <div className="order-1 rounded-[26px] border border-white/[.09] bg-[#111918]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-white/[.08] pb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-[#65f2c0]/15 text-xs text-[#65f2c0]">
                1
              </span>
              {t("ابدأ من فكرة الفيديو")}
            </div>
            <span className="font-mono text-[10px] text-[#566760]">
              THUMBNAIL / 16:9
            </span>
          </div>

          <label htmlFor="thumbnail-idea" className="mb-2 block text-[11px] font-medium uppercase tracking-[.14em] text-[#82958c]">
            {t("ماذا سيشاهد الجمهور؟")}
          </label>
          <textarea
            id="thumbnail-idea"
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            dir="auto"
            className="h-28 w-full resize-none rounded-2xl border border-white/10 bg-[#0a100f] p-4 text-lg leading-8 text-[#f0f7f2] outline-none transition focus:border-[#65f2c0]/60"
            placeholder={t("مثال: جربت أرخص ميكروفون لمدة 30 يوماً")}
          />

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{t("أضف الشخصية أو المنتج")}</p>
                <p className="mt-1 text-xs text-[#71837a]">
                  {t("صورة شخص أو منتج تريد أن يظهر كعنصر رئيسي")}
                </p>
              </div>
              <span className="rounded-full border border-white/[.08] px-2.5 py-1 text-[10px] text-[#71837a]">
                {t("اختياري")}
              </span>
            </div>

            <input
              id="hero-image"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleHeroImage}
              className="sr-only"
            />
            {heroImage ? (
              <div className="flex items-center gap-3 rounded-2xl border border-[#65f2c0]/30 bg-[#65f2c0]/[.06] p-3">
                <img
                  src={heroImage}
                  alt={t("معاينة بطل الصورة")}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-[#eafff4]">
                    {heroImageName}
                  </p>
                  <p className="mt-1 text-[11px] text-[#81948a]">
                    {t("سيستخدمها الذكاء الاصطناعي كبطل للمشهد")}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label={t("حذف صورة البطل")}
                  onClick={() => {
                    setHeroImage(null);
                    setHeroImageName("");
                  }}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#81948a] transition hover:bg-white/[.08] hover:text-white"
                >
                  <X size={15} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="hero-image"
                className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/[.14] bg-[#0b1110] p-4 transition hover:border-[#65f2c0]/50 hover:bg-[#65f2c0]/[.04]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/[.06] text-[#65f2c0]">
                  <ImagePlus size={19} />
                </span>
                <span>
                  <span className="block text-sm text-[#d9e8df]">
                    {t("ارفع صورة البطل")}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#71837a]">
                    {t("PNG أو JPG أو WebP — حتى 6MB")}
                  </span>
                </span>
              </label>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("اختر أسلوب الصورة")}</p>
              <p className="mt-1 text-xs text-[#71837a]">
                {t("10 ستايلات مستوحاة من تغليف صور صناع المحتوى")}
              </p>
            </div>
            <span className="rounded-full bg-white/[.05] px-2.5 py-1 font-mono text-[10px] text-[#8ea59a]">
              {styles.length} styles
            </span>
          </div>

          <div className="relative mt-4">
            <button
              type="button"
              aria-expanded={stylesOpen}
              aria-haspopup="listbox"
              onClick={() => setStylesOpen((open) => !open)}
              className={`flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-right transition ${
                stylesOpen
                  ? "border-[#65f2c0]/70 bg-[#65f2c0]/10"
                  : "border-white/[.1] bg-[#0b1110] hover:border-white/20"
              }`}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#65f2c0]/15 text-xs font-bold text-[#65f2c0]">
                  {styles.findIndex((item) => item.id === selectedStyle) + 1}
                </span>
                <span>
                  <span className="block text-sm font-medium text-[#eafff4]">
                    {style.label}
                  </span>
                  <span className="mt-1 block text-[11px] text-[#81948a]">
                    {style.description}
                  </span>
                </span>
              </span>
              <ChevronDown
                size={18}
                className={`text-[#65f2c0] transition ${
                  stylesOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {stylesOpen && (
              <div
                role="listbox"
                aria-label={t("اختيار ستايل المشاهير")}
                className="absolute inset-x-0 top-[calc(100%+8px)] z-20 max-h-[340px] overflow-y-auto rounded-2xl border border-white/[.12] bg-[#111918] p-2 shadow-2xl shadow-black/50"
              >
                <p className="px-3 py-2 text-[10px] uppercase tracking-[.14em] text-[#64766d]">
                  {t("اختر أسلوب المشاهير")}
                </p>
                <div className="grid gap-1 sm:grid-cols-2">
                  {styles.map((item) => {
                    const isSelected = selectedStyle === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          setSelectedStyle(item.id);
                          setStylesOpen(false);
                        }}
                        className={`rounded-xl p-3 text-right transition ${
                          isSelected
                            ? "bg-[#65f2c0]/10 text-[#eafff4]"
                            : "text-[#81948a] hover:bg-white/[.05] hover:text-[#eafff4]"
                        }`}
                      >
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium">{item.label}</span>
                          {isSelected && (
                            <Check
                              size={14}
                              className="shrink-0 text-[#65f2c0]"
                            />
                          )}
                        </span>
                        <span className="mt-1 block text-[10px] leading-5 opacity-70">
                          {item.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <p className="mt-3 text-[11px] leading-5 text-[#64766d]">
            {t("هذه مراجع بصرية عامة وليست نسخاً لوجوه المشاهير أو شعاراتهم؛ سيتم بناء تكوين أصلي لكل فكرة.")}
          </p>

          <details className="group mt-5 rounded-2xl border border-white/[.08] bg-[#0b1110]">
            <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3 text-xs text-[#a2b3aa]">
              <span>{t("شاهد الـ prompt الاحترافي قبل التوليد")}</span>
              <span className="text-[#65f2c0] transition group-open:rotate-180">⌄</span>
            </summary>
            <div className="border-t border-white/[.08] p-3">
              <p className="whitespace-pre-wrap rounded-xl bg-black/20 p-3 text-xs leading-6 text-[#8da198]">
                {previewPrompt}
              </p>
            </div>
          </details>

          {error && (
            <div className="mt-4 rounded-xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generateThumbnail}
            disabled={isGenerating || idea.trim().length < 4}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#65f2c0] py-4 text-sm font-semibold text-[#07100d] transition hover:-translate-y-0.5 hover:bg-[#7af6cb] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <LoaderCircle size={17} className="animate-spin" />
                {t("نكتب الـ prompt ونبني المشهد…")} {formatDuration(elapsedMs)}
              </>
            ) : (
              <>
                <Sparkles size={17} />
                {t("حوّل الفكرة وولّد الصورة")}
                <ArrowLeft size={16} />
              </>
            )}
          </button>
        </div>
      </section>

        <section
          aria-labelledby="youtube-thumbnail-seo-title"
          className="relative z-10 mx-auto max-w-[1240px] px-5 pb-20 sm:px-9"
        >
          <div className="rounded-[28px] border border-white/[.08] bg-[#0d1513]/90 p-6 sm:p-9">
            <p className="mb-3 text-[10px] uppercase tracking-[.2em] text-[#65f2c0]">
              {t("YouTube Thumbnail Maker بالعربي")}
            </p>
            <h2
              id="youtube-thumbnail-seo-title"
              className="max-w-3xl text-2xl font-semibold leading-[1.4] tracking-tight sm:text-3xl"
            >
              {t("منشئ الصور المصغرة لليوتيوب بالذكاء الاصطناعي")}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-8 text-[#9aaca3]">
              {t("أنشئ صورة مصغّرة احترافية لليوتيوب من فكرة بسيطة. يساعدك xfontat على تحويل عنوان الفيديو إلى تصميم Thumbnail واضح وجذاب بمقاس 1280×720، مع دعم العناوين العربية، الألوان المتباينة، وترتيب بصري يجعل موضوع الفيديو مفهوماً من النظرة الأولى.")}
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <article className="rounded-2xl border border-white/[.07] bg-black/15 p-5">
                <h3 className="text-sm font-medium text-[#e9f5ee]">
                  {t("صورة مصغرة واضحة وقابلة للنقر")}
                </h3>
                <p className="mt-2 text-xs leading-7 text-[#81948a]">
                  {t("تكوين بسيط، عنصر رئيسي واضح، وتباين قوي يساعد المشاهد على فهم موضوع الفيديو بسرعة من نتائج البحث والاقتراحات.")}
                </p>
              </article>
              <article className="rounded-2xl border border-white/[.07] bg-black/15 p-5">
                <h3 className="text-sm font-medium text-[#e9f5ee]">
                  {t("دعم كامل للخط العربي")}
                </h3>
                <p className="mt-2 text-xs leading-7 text-[#81948a]">
                  {t("أضف عنوان الفيديو بالعربية، وسيحافظ التصميم على اتجاه النص من اليمين إلى اليسار مع إبقائه مقروءاً على الهاتف.")}
                </p>
              </article>
              <article className="rounded-2xl border border-white/[.07] bg-black/15 p-5">
                <h3 className="text-sm font-medium text-[#e9f5ee]">
                  {t("تصميم مرتبط بفكرة الفيديو")}
                </h3>
                <p className="mt-2 text-xs leading-7 text-[#81948a]">
                  {t("لا يضيف كلمات عشوائية أو شعارات مضللة؛ بل يربط المشهد بعنوان الفيديو ليساعد على تحسين الصلة ورفع فرصة النقر.")}
                </p>
              </article>
            </div>

            <div className="mt-9 grid gap-8 border-t border-white/[.08] pt-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-medium text-[#e9f5ee]">
                  {t("كيف تنشئ Thumbnail مناسبة لفيديو يوتيوب؟")}
                </h3>
                <ol className="mt-4 space-y-3 text-sm leading-7 text-[#9aaca3]">
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">01</span>
                    {t("اكتب فكرة الفيديو أو عنوانه الأساسي بوضوح.")}
                  </li>
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">02</span>
                    {t("أضف صورة الشخصية أو المنتج إذا كان جزءاً مهماً من المحتوى.")}
                  </li>
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">03</span>
                    {t("اختر أسلوباً مناسباً لمجال القناة والجمهور المستهدف.")}
                  </li>
                  <li>
                    <span className="ml-2 font-mono text-[#65f2c0]">04</span>
                    {t("راجع الصورة وتأكد من وضوحها قبل استخدامها على يوتيوب.")}
                  </li>
                </ol>
              </div>
              <div>
                <h3 className="text-lg font-medium text-[#e9f5ee]">
                  {t("هل الصورة المصغرة تحسن SEO لليوتيوب؟")}
                </h3>
                <p className="mt-4 text-sm leading-8 text-[#9aaca3]">
                  {t("الصورة المصغرة لا تستبدل عنوان الفيديو أو وصفه أو الكلمات المفتاحية، لكنها تساعد على تحسين الصلة البصرية ورفع نسبة النقر عندما تعكس محتوى الفيديو بصدق. لذلك يجمع هذا المنشئ بين عنوان عربي واضح ومشهد مرتبط بفكرة الفيديو، بدلاً من استخدام Clickbait مضلل.")}
                </p>
              </div>
            </div>

            <div className="mt-9 border-t border-white/[.08] pt-8">
              <h3 className="text-lg font-medium text-[#e9f5ee]">
                {t("أسئلة شائعة عن صور YouTube المصغرة")}
              </h3>
              <div className="mt-4 grid gap-3">
                <details className="rounded-2xl border border-white/[.07] bg-black/15 p-4">
                  <summary className="cursor-pointer text-sm text-[#dcebe2]">
                    {t("كيف أصنع صورة مصغرة احترافية لليوتيوب؟")}
                  </summary>
                  <p className="mt-3 text-xs leading-7 text-[#81948a]">
                    {t("اكتب فكرة الفيديو، اختر الأسلوب البصري، وأضف صورة الشخصية أو المنتج عند الحاجة، ثم أنشئ الصورة بمقاس 1280×720.")}
                  </p>
                </details>
                <details className="rounded-2xl border border-white/[.07] bg-black/15 p-4">
                  <summary className="cursor-pointer text-sm text-[#dcebe2]">
                    {t("ما المقاس المناسب لصورة Thumbnail في يوتيوب؟")}
                  </summary>
                  <p className="mt-3 text-xs leading-7 text-[#81948a]">
                    {t("المقاس المناسب هنا هو 1280×720 بنسبة 16:9، ليظهر جيداً على الهاتف والكمبيوتر وصفحات الاقتراحات.")}
                  </p>
                </details>
                <details className="rounded-2xl border border-white/[.07] bg-black/15 p-4">
                  <summary className="cursor-pointer text-sm text-[#dcebe2]">
                    {t("هل يدعم المنشئ العناوين العربية؟")}
                  </summary>
                  <p className="mt-3 text-xs leading-7 text-[#81948a]">
                    {t("نعم، يدعم النص العربي واتجاه الكتابة من اليمين إلى اليسار ويحافظ على العنوان الذي تدخله داخل التصميم.")}
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}