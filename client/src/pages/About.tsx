import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { createWebPageSchema } from "@/lib/schemas";

export default function About() {
  const schema = createWebPageSchema({
    name: "من نحن - xfontat | منصة الخطوط العربية",
    description: "تعرف على xfontat، منصة لتصفح الخطوط العربية ومعاينتها والاطلاع على معلومات الصيغ والتراخيص المتاحة.",
    url: "https://xfontat.com/about"
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead
        title="من نحن | xfontat — مكتبة الخطوط العربية"
        description="تعرف على xfontat، منصة لتصفح الخطوط العربية ومعاينتها والاطلاع على معلومات الصيغ والتراخيص المتاحة."
        path="/about"
        schema={schema}
      />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">من نحن</h1>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4">مرحباً بك في xfontat</h2>
              <p className="text-muted-foreground leading-loose mb-4">
                xfontat منصة عربية لتصفح الخطوط العربية ومعاينتها. تعرض المكتبة تصنيفات متعددة؛ وتختلف الصيغ وشروط الاستخدام بحسب كل ملف، لذا راجع تفاصيله وترخيصه قبل استخدامه.
              </p>
              <p className="text-muted-foreground leading-loose">
                نهدف إلى تسهيل استكشاف الخطوط العربية وتجربة مظهرها على نصوص مختلفة قبل التنزيل.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">مهمتنا ورؤيتنا</h2>
              <p className="text-muted-foreground leading-loose mb-4">
                نعمل على تنظيم الخطوط المعروضة وتوفير معاينة تساعد المصممين والمطورين والكتّاب على تجربة النص قبل التنزيل.
              </p>
              <p className="text-muted-foreground leading-loose">
                نطمح إلى تحسين بيانات الخطوط المعروضة وتسهيل الوصول إلى تفاصيل المصدر والصيغة والترخيص كلما توفرت.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">لمحة عن الخط العربي</h2>
              <p className="text-muted-foreground leading-loose mb-4">
                تطورت أساليب الكتابة العربية ضمن سياقات تاريخية وثقافية متعددة. تختلف المراجع في تصنيف بعض الأنماط ونسبها وتواريخها، لذلك لا ننسب هنا تاريخاً محدداً من دون مرجع موثوق ظاهر للقارئ.
              </p>
              <p className="text-muted-foreground leading-loose mb-4">
                تركز صفحات التصنيفات في xfontat على خصائص الملفات الرقمية المعروضة وطرق اختبارها، ولا تحل محل مرجع تاريخي متخصص.
              </p>
              <p className="text-muted-foreground leading-loose">
                عند إضافة معلومات تاريخية أو نسب إلى خطاطين، ينبغي إرفاق مصدر يمكن للقارئ الرجوع إليه؛ لن نضيف تفاصيل غير موثقة في هذه النبذة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-6">أصناف الخطوط في مكتبتنا</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "خط الثلث",
                    desc: "أسلوب زخرفي يُستخدم في اللوحات والعناوين، ويحتاج عادةً إلى مساحة تسمح بوضوح تفاصيله."
                  },
                  {
                    name: "خط الديواني",
                    desc: "أسلوب انسيابي مزخرف يمكن تجربته في الدعوات والشهادات والعناوين، مع التحقق من وضوح النص."
                  },
                  {
                    name: "خط الرقعة",
                    desc: "أسلوب مختصر يمكن تجربته في الكتابة والعناوين القصيرة؛ يختلف وضوحه الرقمي باختلاف تصميم الخط وحجمه."
                  },
                  {
                    name: "خط الكوفي",
                    desc: "تضم تسميته أنماطاً متعددة، ومنها أشكال هندسية يمكن تجربتها في الشعارات والأعمال البصرية."
                  },
                  {
                    name: "خط النسخ",
                    desc: "يظهر في سياقات الطباعة والقراءة؛ اختبر كل خط وحجم على المحتوى الفعلي قبل اعتماده."
                  },
                  {
                    name: "خطوط التصميم",
                    desc: "مجموعة من الأساليب البصرية التي يمكن استكشافها للإعلانات والمنشورات ومشروعات التصميم."
                  },
                  {
                    name: "خطوط الحرة",
                    desc: "أساليب تعبيرية وزخرفية يمكن تجربتها في العناوين والملصقات والتصاميم."
                  },
                  {
                    name: "خطوط الفوتوشوب",
                    desc: "خطوط يمكن تجربتها في برامج التصميم التي تدعم صيغها؛ يختلف دعم العربية باختلاف البرنامج وإصداره."
                  },
                  {
                    name: "خط النستعليق",
                    desc: "أسلوب يرتبط بالخط الفارسي والأردية، ويُستخدم في بعض السياقات الأدبية والزخرفية."
                  }
                ].map((cat, i) => (
                  <div key={i} className="border rounded-lg p-5">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{cat.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{cat.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">الخط العربي والتصميم الرقمي الحديث</h2>
              <p className="text-muted-foreground leading-loose mb-4">
                  أتاح النشر الرقمي عرض الخطوط العربية في ملفات قابلة للاستخدام على الأجهزة والبرامج الداعمة لها، إلى جانب وسائل الكتابة والطباعة التقليدية.
              </p>
              <p className="text-muted-foreground leading-loose mb-4">
                  يتطلب التصميم العربي الرقمي الانتباه إلى اتجاه الكتابة ووصل الحروف والتشكيل، واختبار الخط على الأنظمة والمتصفحات المستهدفة. راجع تفاصيل كل ملف قبل استخدامه.
              </p>
              <p className="text-muted-foreground leading-loose">
                  عند تصميم واجهة عربية، استخدم اتجاه HTML الصحيح واختبر النصوص والأحجام والتباعد على أجهزة مختلفة. لا توجد قيمة واحدة للتباعد تناسب كل الخطوط والشاشات.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">ما الذي يميز xfontat؟</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: "تنزيل مجاني", desc: "يمكن تنزيل الملفات المتاحة مجاناً؛ راجع ترخيص كل خط قبل استخدامه أو إعادة توزيعه." },
                  { title: "معاينة تفاعلية", desc: "اكتب نصك الخاص وجرّب مظهره بالخط قبل التنزيل." },
                  { title: "تصنيفات للاستكشاف", desc: "تصفح الخطوط وفق التصنيفات المعروضة في المكتبة." },
                  { title: "مقالات تعليمية", desc: "اقرأ مقالات عن الخطوط العربية واستخدامها في التصميم." },
                  { title: "واجهة عربية RTL", desc: "المنصة مُصمَّمة أصلاً للعربية بدعم كامل للاتجاه من اليمين لليسار." },
                  { title: "معلومات الخطوط", desc: "اطّلع على بيانات الملف والصيغة والترخيص عند توفرها." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 border rounded-lg">
                    <span className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">{i + 1}</span>
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">رؤيتنا للمستقبل</h2>
              <p className="text-muted-foreground leading-loose mb-4">
                نسعى في xfontat إلى أن نكون أكثر من مجرد مكتبة خطوط. نريد أن نكون منظومة متكاملة تخدم مجتمع التصميم العربي على مختلف مستوياته: من المبتدئين الذين يبحثون عن خطهم الأول، إلى المحترفين الذين يحتاجون مكتبة واسعة وموثوقة، إلى الباحثين الذين يدرسون تطور الخط العربي عبر التاريخ.
              </p>
              <p className="text-muted-foreground leading-loose">
                في الأفق القريب، نعمل على تطوير أدوات تصميم مدمجة تتيح لك تخصيص الخط مباشرة على المنصة، وبناء محرك بحث ذكي يقترح الخط الأنسب بناءً على وصفك لمشروعك. نحن هنا لنبقى ولنخدمك بأفضل ما يمكن، لأن الخط العربي يستحق منصة في مستوى عظمته.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
