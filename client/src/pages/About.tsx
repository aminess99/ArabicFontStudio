import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header 
        searchQuery=""
        onSearchChange={() => {}}
        previewText="بسم الله الرحمن الرحيم"
        onPreviewTextChange={() => {}}
        fontSize={48}
        onFontSizeChange={() => {}}
      />

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">من نحن</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">مرحباً بك في xfontat</h2>
              <p className="text-muted-foreground leading-relaxed">
                xfontat هي منصة متخصصة في توفير مجموعة متنوعة من الخطوط العربية الاحترافية والمجانية. نهدف إلى جعل الخطوط العربية عالية الجودة متاحة للجميع، سواء كنت مصمماً محترفاً أو هاوياً.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">مهمتنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                نؤمن بأن الخط العربي هو فن وتراث يجب الحفاظ عليه وتطويره. مهمتنا هي توفير منصة سهلة الاستخدام تمكن المصممين والمطورين من الوصول إلى خطوط عربية احترافية بأنماط متعددة تشمل الثلث، الديواني، الكوفي، النسخ، والرقعة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">ما نقدمه</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>مجموعة واسعة من الخطوط العربية بأنماط مختلفة</li>
                <li>إمكانية معاينة الخطوط مباشرة مع نص قابل للتخصيص</li>
                <li>تحميل مجاني لجميع الخطوط بصيغ TTF وOTF</li>
                <li>تصنيف منظم حسب أنواع الخطوط التقليدية</li>
                <li>واجهة عربية بالكامل مع دعم RTL</li>
                <li>تحديثات منتظمة بخطوط جديدة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">تصنيفات الخطوط</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">خط الثلث</h3>
                  <p className="text-sm text-muted-foreground">خط عربي جمالي بارز، يتميز بالمرونة وتنوع الأشكال</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">خط الديواني</h3>
                  <p className="text-sm text-muted-foreground">خط زخرفي أنيق يستخدم في الوثائق الرسمية</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">خط الكوفي</h3>
                  <p className="text-sm text-muted-foreground">أقدم الخطوط العربية، يتميز بالهندسية والبساطة</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">خط النسخ</h3>
                  <p className="text-sm text-muted-foreground">الخط الأكثر استخداماً، واضح وسهل القراءة</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-2">خط الرقعة</h3>
                  <p className="text-sm text-muted-foreground">خط سريع الكتابة، يستخدم في الحياة اليومية</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">رؤيتنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                نسعى لأن نكون المرجع الأول للخطوط العربية على الإنترنت، ونطمح إلى توسيع مكتبتنا باستمرار لتشمل المزيد من الخطوط العربية الأصيلة والحديثة، مع الحفاظ على أعلى معايير الجودة.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
