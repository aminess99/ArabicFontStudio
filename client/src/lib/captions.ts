// Ready-made Arabic captions for photos and stories. Each page lists captions
// the visitor can copy or turn into an image in an Arabic font. The captions
// are Arabic in every language; the page text around them is translated.
// Shared by the React page and server/seoHtml.ts.

export type Locale = "ar" | "en" | "fr";
type Text = Record<Locale, string>;

export type CaptionPage = {
  slug: string; // "" is the hub at /captions
  name: Text;
  title: Text;
  heading: Text;
  description: Text;
  intro: Text;
  faqs: Record<Locale, Array<{ question: string; answer: string }>>;
  captions: string[];
};

export const CAPTION_PAGES: CaptionPage[] = [
  {
    slug: "",
    name: { ar: "كابشن للصور", en: "Photo captions", fr: "Légendes pour photos" },
    title: {
      ar: "كابشن للصور — جمل عربية جاهزة للستوريز والصور | xfontat",
      en: "Arabic Captions for Photos — Ready to Copy | xfontat",
      fr: "Légendes arabes pour photos — prêtes à copier | xfontat",
    },
    heading: { ar: "كابشن للصور: جمل عربية جاهزة", en: "Arabic captions for photos", fr: "Légendes arabes pour vos photos" },
    description: {
      ar: "كابشن للصور بالعربي: جمل قصيرة جاهزة للنسخ للستوريز والريلز والصور الشخصية، وحوّل أي كابشن إلى صورة بخط عربي بضغطة زر.",
      en: "Short Arabic captions ready to copy for stories, reels and profile photos. Turn any caption into an image in an Arabic font with one click.",
      fr: "Des légendes arabes courtes à copier pour stories, reels et photos de profil. Transformez chaque légende en image avec une police arabe en un clic.",
    },
    intro: {
      ar: "اخترنا لك جملاً عربية قصيرة تناسب الصور والستوريز والريلز. انسخ ما يعجبك، أو اضغط «حمّله صورة» لتكتبه بخط عربي جميل وتحمّله صورة شفافة تضعها فوق صورتك.",
      en: "Short Arabic lines that suit photos, stories and reels. Copy the one you like, or press the image button to write it in a beautiful Arabic font and download a transparent image to place over your photo.",
      fr: "Des phrases arabes courtes pour photos, stories et reels. Copiez celle qui vous plaît ou créez-en une image dans une belle police arabe, à placer sur votre photo.",
    },
    faqs: {
      ar: [
        { question: "كيف أضع الكابشن على صورتي بخط عربي؟", answer: "اضغط «حمّله صورة» بجانب الجملة لتفتح أداة الكتابة بالخط العربي، اختر الخط واللون، ثم حمّل النص صورة شفافة PNG وأضفها فوق صورتك في انشوت أو كاب كات أو أي تطبيق." },
        { question: "هل يمكنني استخدام هذه الجمل في حساباتي؟", answer: "نعم، جملنا أصلية وقصيرة ويمكنك نسخها واستخدامها في منشوراتك وصورك دون ذكر المصدر." },
        { question: "هل توجد كابشنات بحسب المزاج؟", answer: "نعم، تصفح الصفحات المتفرعة: كابشن عميق، وكابشن رايق، وكابشن للبنات، وكابشن كريتف بالعامية." },
      ],
      en: [
        { question: "How do I put a caption on my photo in an Arabic font?", answer: "Press the image button next to a caption to open the Arabic font generator, choose a font and colour, then download a transparent PNG and place it over your photo in InShot, CapCut or any app." },
        { question: "Can I use these captions on my accounts?", answer: "Yes. The captions are original and short; copy and use them in your posts and photos." },
        { question: "Are there captions for different moods?", answer: "Yes: deep captions, calm captions, captions for girls, and creative colloquial captions." },
      ],
      fr: [
        { question: "Comment mettre une légende sur ma photo avec une police arabe ?", answer: "Cliquez sur le bouton image à côté d'une légende pour ouvrir le générateur de police arabe, choisissez police et couleur, téléchargez un PNG transparent et placez-le sur votre photo dans InShot, CapCut ou une autre application." },
        { question: "Puis-je utiliser ces légendes sur mes comptes ?", answer: "Oui. Les légendes sont originales et courtes ; copiez-les et utilisez-les dans vos publications." },
        { question: "Y a-t-il des légendes selon l'humeur ?", answer: "Oui : légendes profondes, calmes, pour filles et créatives en dialecte." },
      ],
    },
    captions: [
      "ابتسامة صغيرة تغيّر يوماً كاملاً.",
      "أنا كما أنا، ولا أعتذر عن ذلك.",
      "خطوة صغيرة كل يوم تصنع فرقاً كبيراً.",
      "ما كتبه الله لك سيأتيك، فاطمئن.",
      "كن لنفسك أول من يصدّقها.",
      "الطريق طويل، لكن القلب مطمئن.",
      "هدوء بعد عاصفة طويلة.",
      "لا شيء يشبه راحة البال.",
      "اليوم أفضل من أمس بقليل، وهذا يكفي.",
      "على مهلي أصل.",
      "الضحك أقصر طريق إلى القلب.",
      "ما زال في الحياة ما يستحق.",
      "نمشي ونحن نعرف وجهتنا.",
      "كل صباح فرصة جديدة.",
      "الامتنان يجعل القليل كثيراً.",
      "أحب تفاصيل الأشياء البسيطة.",
      "من يعرف قيمتك لا يحتاج إلى تذكير.",
      "الأحلام لا تتحقق وحدها، لكنها تبدأ بحالم.",
      "ليلة هادئة وفكرة جميلة.",
      "أنا أبني نفسي بصمت.",
      "قلب مطمئن خير من ألف خطة.",
      "حيث يكون السلام، أكون.",
      "الأجمل أن تبقى بسيطاً.",
      "لحظة جميلة تستحق أن تُحفظ.",
      "لا تستعجل، لكل شيء وقته.",
      "تفاءلوا بالخير تجدوه.",
      "الحمد لله على كل حال.",
      "ابقَ قريباً ممن يشبهك.",
      "الغد يحمل ما لا نتوقعه.",
      "رحلة جميلة وصحبة أجمل.",
    ],
  },
  {
    slug: "deep",
    name: { ar: "كابشن عميق", en: "Deep captions", fr: "Légendes profondes" },
    title: {
      ar: "كابشن للصور الشخصية عميق — جمل عميقة جاهزة | xfontat",
      en: "Deep Arabic Captions for Profile Photos | xfontat",
      fr: "Légendes arabes profondes pour photos de profil | xfontat",
    },
    heading: { ar: "كابشن للصور الشخصية عميق", en: "Deep Arabic captions for profile photos", fr: "Légendes arabes profondes pour photos de profil" },
    description: {
      ar: "كابشن عميق للصور الشخصية: جمل عربية قصيرة بمعانٍ هادئة وعميقة، جاهزة للنسخ أو التحويل إلى صورة بخط عربي.",
      en: "Deep Arabic captions for profile photos: short lines with quiet, meaningful ideas, ready to copy or turn into an image in an Arabic font.",
      fr: "Légendes arabes profondes pour photos de profil : phrases courtes au sens calme et fort, à copier ou à transformer en image.",
    },
    intro: {
      ar: "جمل قصيرة بمعانٍ عميقة تناسب صورتك الشخصية: عن الصمت والنضج والصبر وقيمة النفس. انسخها أو حوّلها إلى صورة بخط عربي أنيق.",
      en: "Short lines with deep meaning for your profile photo: about silence, maturity, patience and self-worth. Copy them or turn them into an image in an elegant Arabic font.",
      fr: "Des phrases courtes au sens profond pour votre photo de profil : silence, maturité, patience, valeur de soi. Copiez-les ou transformez-les en image.",
    },
    faqs: {
      ar: [
        { question: "ما الخط المناسب للكابشن العميق؟", answer: "اختر خطاً هادئاً مثل خطوط النسخ أو الرقعة أو الكوفي الخفيف، وتجنب الخطوط الثقيلة المزخرفة لأن الجملة العميقة تحتاج وضوحاً." },
        { question: "كم طول الكابشن المناسب للصورة الشخصية؟", answer: "من خمس إلى عشر كلمات تكفي، فالجملة القصيرة أوضح على الصورة وأسهل في القراءة." },
      ],
      en: [
        { question: "Which font suits a deep caption?", answer: "Choose a calm font such as Naskh, Ruqaa or a light Kufi. Avoid heavy ornate fonts, since a deep line needs clarity." },
        { question: "How long should a profile-photo caption be?", answer: "Five to ten words are enough; short lines read more clearly on a photo." },
      ],
      fr: [
        { question: "Quelle police convient à une légende profonde ?", answer: "Une police calme : naskh, ruqaa ou koufi léger. Évitez les polices lourdes et ornées, car une phrase profonde demande de la clarté." },
        { question: "Quelle longueur pour une photo de profil ?", answer: "Cinq à dix mots suffisent ; une phrase courte se lit mieux sur une photo." },
      ],
    },
    captions: [
      "أحياناً الصمت أبلغ من كل الكلام.",
      "من يعرف قيمة نفسه لا يبيعها بثمن رخيص.",
      "ليس كل ما يُعرف يُقال.",
      "تعلّمت أن أخفف الحمل حتى أمشي أبعد.",
      "الذين رحلوا علّمونا كيف نبقى.",
      "في داخلي بيت لا يدخله إلا من يستحق.",
      "لا أطلب الكثير، يكفيني قلب هادئ وطريق واضح.",
      "الأيام تعلّمنا ما لم تعلّمه الكتب.",
      "كلما كبرتُ قلّ ما يدهشني وزاد ما يهمّني.",
      "لا أخسر؛ إما أن أفوز أو أتعلّم.",
      "بعض الخسارات ربح مؤجل.",
      "النضج أن تفهم دون أن تشرح.",
      "الصبر ليس انتظاراً، بل طريقة في الوقوف.",
      "أصعب المعارك تلك التي لا يراها أحد.",
      "لا تحزن على من رحل؛ فقد أخلى مكاناً لمن يستحق.",
      "القلب الذي ينكسر يتّسع.",
      "أن تبقى لطيفاً في عالم قاسٍ شجاعة.",
      "ما لا يقتلني يعلّمني.",
      "الأشياء الجميلة تأتي حين نتوقف عن ملاحقتها.",
      "كن عميقاً، لا مزدحماً.",
      "الوحدة ليست ألماً دائماً، أحياناً هي سلام.",
      "أحمل أحلامي في صمت وأمشي.",
      "من لا يفهم صمتك لن يفهم كلامك.",
      "لا أحد يرى الطريق كما تراه أنت.",
      "كل نهاية تخبّئ بداية لم نرها بعد.",
      "الحنين لغة لا يترجمها أحد.",
      "أفكاري كثيرة، وكلماتي قليلة.",
      "ما بيني وبين نفسي أجمل ما فيّ.",
      "يا قلب، تعلّم أن تكتفي.",
      "في الهدوء أسمع نفسي.",
    ],
  },
  {
    slug: "calm",
    name: { ar: "كابشن رايق", en: "Calm captions", fr: "Légendes calmes" },
    title: {
      ar: "كابشن للصور الشخصية رايق — جمل هادئة وجميلة | xfontat",
      en: "Calm and Cheerful Arabic Captions for Photos | xfontat",
      fr: "Légendes arabes calmes et légères pour photos | xfontat",
    },
    heading: { ar: "كابشن للصور الشخصية رايق", en: "Calm and cheerful Arabic captions", fr: "Légendes arabes calmes et légères" },
    description: {
      ar: "كابشن رايق للصور الشخصية: جمل هادئة وخفيفة عن القهوة والصباح والراحة، جاهزة للنسخ أو التحويل إلى صورة بخط عربي.",
      en: "Calm captions for profile photos: light, relaxed lines about coffee, mornings and peace, ready to copy or turn into an Arabic-font image.",
      fr: "Légendes calmes pour photos de profil : phrases légères sur le café, le matin et la sérénité, à copier ou à transformer en image.",
    },
    intro: {
      ar: "جمل خفيفة وهادئة لصور الصباح والقهوة والسفر والجلسات الرايقة. انسخ ما يناسب مزاجك أو حوّله إلى صورة بخط عربي.",
      en: "Light, relaxed lines for morning, coffee, travel and easy moments. Copy what suits your mood or turn it into an Arabic-font image.",
      fr: "Des phrases légères et calmes pour matins, café, voyages et moments tranquilles. Copiez-les ou transformez-les en image.",
    },
    faqs: {
      ar: [
        { question: "ما الفرق بين الكابشن الرايق والعميق؟", answer: "الرايق خفيف وهادئ ويناسب الصور اليومية والقهوة والسفر، أما العميق فيحمل فكرة أو شعوراً أثقل ويناسب الصور الشخصية الجادة." },
        { question: "ما الخط المناسب للكابشن الرايق؟", answer: "الخطوط المستديرة الخفيفة أو خطوط الرقعة تعطي إحساساً رايقاً وودوداً." },
      ],
      en: [
        { question: "What is the difference between calm and deep captions?", answer: "Calm captions are light and suit everyday photos, coffee and travel; deep captions carry a heavier idea and suit more serious profile photos." },
        { question: "Which font suits a calm caption?", answer: "Light rounded fonts or Ruqaa give a relaxed, friendly feel." },
      ],
      fr: [
        { question: "Quelle différence entre légendes calmes et profondes ?", answer: "Les légendes calmes sont légères (quotidien, café, voyage) ; les profondes portent une idée plus lourde pour des photos plus sérieuses." },
        { question: "Quelle police pour une légende calme ?", answer: "Des polices arrondies légères ou la ruqaa donnent une impression détendue et chaleureuse." },
      ],
    },
    captions: [
      "قهوة وهدوء وصباح جميل.",
      "اليوم رايق وأنا أحسن.",
      "خذ نفساً عميقاً؛ كل شيء سيكون بخير.",
      "سلام داخلي بلا ضجيج.",
      "ابتسامة صغيرة تكفي.",
      "هنا لا شيء يعكّر صفوي.",
      "جلسة بسيطة ومزاج عالٍ.",
      "الصباح أجمل مع كوب دافئ.",
      "ماشي على مهلي، والدنيا حلوة.",
      "لحظة هدوء تعدل مزاج يوم كامل.",
      "رايق بما يكفي لأبتسم للجميع.",
      "نسمة هواء وفنجان قهوة.",
      "الدنيا بخير ما دام فيها صباح.",
      "اليوم بلا استعجال.",
      "أحب الأيام التي لا تحتاج شرحاً.",
      "ضحكة صافية وقلب خفيف.",
      "غروب جميل ومزاج أجمل.",
      "اجلس، تنفّس، وارتح.",
      "رحلة قصيرة تعيد ترتيب الروح.",
      "كل شيء في وقته الجميل.",
      "على الشاطئ تتوقف الهموم.",
      "أحياناً تكفي جلسة صغيرة لتصلح اليوم.",
      "الجو رايق والقلب أرحب.",
      "بسيط وهادئ، كما أحب.",
      "يوم جميل لمن يراه.",
      "صباح الخير لكل قلب صافٍ.",
      "الهدوء نعمة لا يعرفها إلا من فقدها.",
      "ليلة صافية ونجوم قريبة.",
      "شاي دافئ ومطر وكتاب.",
      "مزاجي اليوم مرتب جداً.",
    ],
  },
  {
    slug: "girls",
    name: { ar: "كابشن للبنات", en: "Captions for girls", fr: "Légendes pour filles" },
    title: {
      ar: "كابشن للصور الشخصية للبنات — جمل أنيقة جاهزة | xfontat",
      en: "Elegant Arabic Captions for Girls' Photos | xfontat",
      fr: "Légendes arabes élégantes pour photos de filles | xfontat",
    },
    heading: { ar: "كابشن للصور الشخصية للبنات", en: "Arabic captions for girls' photos", fr: "Légendes arabes pour photos de filles" },
    description: {
      ar: "كابشن للصور الشخصية للبنات: جمل أنيقة وواثقة وهادئة بالعربي، جاهزة للنسخ أو التحويل إلى صورة بخط عربي جميل.",
      en: "Arabic captions for girls' profile photos: elegant, confident and calm lines, ready to copy or turn into an image in a beautiful Arabic font.",
      fr: "Légendes arabes pour photos de profil de filles : phrases élégantes, confiantes et calmes, à copier ou à transformer en image.",
    },
    intro: {
      ar: "جمل أنيقة وواثقة تناسب الصور الشخصية للبنات: عن الثقة بالنفس والرقة والقوة الهادئة. انسخها أو اكتبها بخط عربي جميل وضعها فوق صورتك.",
      en: "Elegant, confident lines for girls' profile photos about self-belief, grace and quiet strength. Copy them or write them in a beautiful Arabic font over your photo.",
      fr: "Des phrases élégantes et confiantes pour photos de profil de filles : confiance, grâce et force tranquille. Copiez-les ou écrivez-les en police arabe sur votre photo.",
    },
    faqs: {
      ar: [
        { question: "ما الخط الأجمل لكابشن البنات؟", answer: "خطوط الثلث والديواني الخفيف تعطي أناقة، وخطوط الرقعة والنسخ الناعمة تعطي رقة. جرّب أكثر من خط على الجملة نفسها." },
        { question: "كيف أضيف الزخرفة إلى الكابشن؟", answer: "يمكنك زخرفة الأسماء والكلمات بأداة الزخرفة في موقعنا ثم لصقها في صورتك أو منشورك." },
      ],
      en: [
        { question: "Which font looks best for girls' captions?", answer: "Thuluth and light Diwani give elegance; soft Ruqaa and Naskh give gentleness. Try several fonts on the same line." },
        { question: "How do I add decoration to a caption?", answer: "Use the decoration tool on our site for names and words, then paste the result into your photo or post." },
      ],
      fr: [
        { question: "Quelle police pour les légendes de filles ?", answer: "Le thuluth et le diwani léger donnent de l'élégance ; la ruqaa et le naskh doux donnent de la douceur. Essayez plusieurs polices." },
        { question: "Comment ajouter de la décoration ?", answer: "Utilisez l'outil de décoration du site pour noms et mots, puis collez le résultat dans votre photo ou publication." },
      ],
    },
    captions: [
      "أنيقة بهدوء.",
      "بنت تعرف قيمتها لا تحتاج من يذكّرها.",
      "رقيقة، لكن لا تنكسر.",
      "ثقتي بنفسي أجمل ما أرتديه.",
      "بسيطة وأنيقة وتشبه نفسها.",
      "أبتسم لأن الله أنعم عليّ.",
      "قوتي في هدوئي.",
      "لا أقارن نفسي بأحد؛ فلي طريقي.",
      "الأنوثة ليست ضعفاً، بل أناقة قوة.",
      "أختار السلام قبل الجدال.",
      "جمال الروح يظهر في العينين.",
      "ابنة عصرها، وفيّة لأصلها.",
      "لا أزيّن وجهي فقط، أزيّن قلبي أيضاً.",
      "أحلامي كبيرة وخطواتي هادئة.",
      "في عينيّ حكاية لا تُقال.",
      "كوني ما تريدين، لا ما يريدونه.",
      "الورد لا يعتذر عن جماله.",
      "أنا الهدوء الذي يسبق النجاح.",
      "ابتسامتي سرّي الجميل.",
      "أحب نفسي بما فيها.",
      "أنيقة في الكلام، قوية في الموقف.",
      "ما زلت أؤمن بالأشياء الجميلة.",
      "كريمة الأصل لا ترفع صوتها ولا تتعالى على أحد.",
      "أحمل الدنيا بخفة وأمشي.",
      "قلبي صافٍ وإن اختلفت الدنيا.",
      "أنوثتي في أخلاقي أولاً.",
      "أنا فخورة بما أصبحت عليه.",
      "رحلتي تعلّمني كل يوم أن أكون أجمل.",
      "هادئة، لكن ذاكرتي قوية.",
      "كل يوم أكتب فصلاً جديداً من نفسي.",
    ],
  },
  {
    slug: "creative",
    name: { ar: "كابشن كريتف بالعامية", en: "Creative colloquial captions", fr: "Légendes créatives en dialecte" },
    title: {
      ar: "كابشن كريتف للشباب بالعامية — جمل جاهزة | xfontat",
      en: "Creative Colloquial Arabic Captions for Photos | xfontat",
      fr: "Légendes arabes créatives en dialecte pour photos | xfontat",
    },
    heading: { ar: "كابشن كريتف بالعامية للشباب", en: "Creative colloquial Arabic captions", fr: "Légendes arabes créatives en dialecte" },
    description: {
      ar: "كابشن كريتف بالعامية للشباب والصور الشخصية: جمل خفيفة ومرحة جاهزة للنسخ أو التحويل إلى صورة بخط عربي.",
      en: "Creative Arabic captions in everyday dialect for young people and profile photos: playful lines ready to copy or turn into an Arabic-font image.",
      fr: "Légendes arabes créatives en dialecte pour jeunes et photos de profil : phrases légères et amusantes, à copier ou à transformer en image.",
    },
    intro: {
      ar: "جمل بالعامية خفيفة ومرحة وجريئة تناسب الستوريز والريلز وصور الأصدقاء. انسخها أو حوّلها إلى صورة بخط عربي وأضفها فوق صورتك.",
      en: "Light, playful lines in everyday Arabic dialect for stories, reels and photos with friends. Copy them or turn them into an Arabic-font image.",
      fr: "Des phrases légères et amusantes en dialecte pour stories, reels et photos entre amis. Copiez-les ou transformez-les en image.",
    },
    faqs: {
      ar: [
        { question: "هل الجمل بلهجة معينة؟", answer: "أغلبها بعامية بسيطة مفهومة في مصر والمشرق، ويمكنك تعديل الكلمات لتناسب لهجتك." },
        { question: "ما الخط المناسب للعامية؟", answer: "خطوط الرقعة والخطوط الحديثة المرحة تناسب العامية أكثر من الخطوط الكلاسيكية الثقيلة." },
      ],
      en: [
        { question: "Which dialect are the captions in?", answer: "Mostly simple colloquial Arabic understood in Egypt and the Levant; you can adjust words to your own dialect." },
        { question: "Which font suits colloquial captions?", answer: "Ruqaa and playful modern fonts fit colloquial lines better than heavy classical fonts." },
      ],
      fr: [
        { question: "Dans quel dialecte sont les légendes ?", answer: "Surtout un arabe courant simple compris en Égypte et au Levant ; adaptez les mots à votre dialecte." },
        { question: "Quelle police pour des légendes en dialecte ?", answer: "La ruqaa et les polices modernes ludiques conviennent mieux que les polices classiques lourdes." },
      ],
    },
    captions: [
      "ماشي على مزاجي ومش فارق مع حد.",
      "الدنيا حلوة لما نحلّيها.",
      "على راحتي، ومش مستعجل على حاجة.",
      "الضحكة أحسن علاج.",
      "يوم جديد وطاقة جديدة.",
      "مش كل حاجة تتشرح، في حاجات تتحس.",
      "أنا كده، ومبسوط.",
      "بالهدوء ده بقى كل حاجة تمام.",
      "الصحاب هم الدنيا الحلوة.",
      "خليك رايق والدنيا هتظبط.",
      "مش لازم أكون كامل عشان أكون حلو.",
      "اللي يحبك هيفضل، واللي مش هيفضل ماشي.",
      "قلبي أبيض ودماغي مشغولة.",
      "كل يوم بتعلم حاجة جديدة.",
      "الحياة قصيرة، اضحك كتير.",
      "رايح بعيد وأنا مبسوط.",
      "خليني في حالي، أنا هادي.",
      "بحب البساطة وناس البساطة.",
      "ما تتعبش نفسك، الرزق بيجي.",
      "ماشيين وربنا معانا.",
      "اللي ليا هيجيلي ولو بعد حين.",
      "إحنا مش بنتغير، بنتعلم.",
      "الأيام الحلوة جاية.",
      "لسه فيه أمل وحاجات حلوة.",
      "قهوتي وأنا ومزاجي.",
      "مش مهم الطريق، المهم مع مين.",
      "ابتسم، الكاميرا بتصوّر.",
      "أنا سيد مزاجي.",
      "الناس الحلوة تعيش بسهولة.",
      "أجمل ما فينا إننا لسه بنحلم.",
    ],
  },
];

export const captionPath = (locale: Locale, slug: string) => {
  const base = slug ? `/captions/${slug}` : "/captions";
  return locale === "ar" ? base : `/${locale}${base}`;
};

export const findCaptionPage = (slug: string) => CAPTION_PAGES.find((page) => page.slug === slug);

export function captionImageHref(locale: Locale, text: string): string {
  const base = locale === "ar" ? "/arabic-text-to-image" : locale === "fr" ? "/fr/generateur-police-arabe" : "/en/arabic-font-generator";
  return `${base}?text=${encodeURIComponent(text)}`;
}
