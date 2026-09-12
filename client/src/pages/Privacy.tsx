import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { createWebPageSchema, SITE_ORIGIN } from "@/lib/schemas";

export default function Privacy() {
  const schema = createWebPageSchema({
    name: "سياسة الخصوصية - xfontat",
    description: "اطلع على سياسة الخصوصية لموقع xfontat وكيفية حماية بياناتك الشخصية عند استخدام خدماتنا.",
    url: `${SITE_ORIGIN}/privacy`
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="سياسة الخصوصية | xfontat — حماية بيانات زوار مكتبة الخطوط"
        description="اقرأ سياسة الخصوصية في xfontat وتعرف على البيانات التي نجمعها، وكيف نستخدمها ونحميها أثناء تصفح مكتبة الخطوط العربية وتحميلها بأمان."
        path="/privacy"
        schema={schema}
      />
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
          <h1 className="text-4xl font-bold mb-8">سياسة الخصوصية</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-muted-foreground">
              آخر تحديث: نوفمبر 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">مقدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحن في xfontat نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحماية معلوماتك عند استخدام موقعنا الإلكتروني.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">المعلومات التي نجمعها</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                قد نجمع الأنواع التالية من المعلومات:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>معلومات التصفح: عنوان IP، نوع المتصفح، صفحات الموقع التي تزورها</li>
                <li>معلومات الاستخدام: الخطوط التي تتصفحها وتحملها</li>
                <li>ملفات تعريف الارتباط (Cookies) لتحسين تجربة المستخدم</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">كيف نستخدم معلوماتك</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                نستخدم المعلومات التي نجمعها للأغراض التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>تحسين خدماتنا وتجربة المستخدم</li>
                <li>تحليل أنماط استخدام الموقع</li>
                <li>حفظ تفضيلاتك (مثل الوضع الداكن/الفاتح)</li>
                <li>توفير محتوى مخصص بناءً على اهتماماتك</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-muted-foreground leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك على الموقع. يمكنك إدارة تفضيلات ملفات تعريف الارتباط من خلال إعدادات المتصفح الخاص بك. لاحظ أن تعطيل ملفات تعريف الارتباط قد يؤثر على بعض وظائف الموقع.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">حماية البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو التعديل أو الكشف أو التدمير. ومع ذلك، لا توجد طريقة نقل عبر الإنترنت أو طريقة تخزين إلكترونية آمنة بنسبة 100%.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">مشاركة المعلومات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحن لا نبيع أو نؤجر أو نشارك معلوماتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك معلومات مجمعة وغير محددة الهوية لأغراض تحليلية.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">حقوقك</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                لديك الحقوق التالية فيما يتعلق ببياناتك:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>حق الوصول إلى بياناتك الشخصية</li>
                <li>حق تصحيح البيانات غير الدقيقة</li>
                <li>حق حذف بياناتك</li>
                <li>حق الاعتراض على معالجة بياناتك</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">التغييرات على هذه السياسة</h2>
              <p className="text-muted-foreground leading-relaxed">
                قد نقوم بتحديث سياسة الخصوصية هذه من وقت لآخر. سنقوم بنشر أي تغييرات على هذه الصفحة مع تاريخ "آخر تحديث" الجديد.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">اتصل بنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية هذه، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@arabic-fonts.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
