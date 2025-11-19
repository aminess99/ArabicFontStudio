import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
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
          <h1 className="text-4xl font-bold mb-8">شروط الاستخدام</h1>
          
          <div className="prose prose-lg max-w-none space-y-6">
            <p className="text-muted-foreground">
              آخر تحديث: نوفمبر 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">قبول الشروط</h2>
              <p className="text-muted-foreground leading-relaxed">
                باستخدامك لموقع xfontat، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على هذه الشروط، يرجى عدم استخدام الموقع.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">استخدام الخطوط</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                الخطوط المتوفرة على موقعنا مقدمة للاستخدام وفقاً للشروط التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>يمكنك تحميل واستخدام الخطوط للأغراض الشخصية والتجارية</li>
                <li>لا يجوز إعادة بيع الخطوط أو توزيعها كملفات خط منفصلة</li>
                <li>يمكنك تضمين الخطوط في مشاريعك ومنتجاتك</li>
                <li>يرجى احترام حقوق الملكية الفكرية للمصممين الأصليين</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">حقوق الملكية الفكرية</h2>
              <p className="text-muted-foreground leading-relaxed">
                جميع الخطوط المتوفرة على الموقع هي ملك لأصحابها ومصمميها. نحن نوفر هذه الخطوط كخدمة للمجتمع، ونحترم حقوق الملكية الفكرية لجميع المبدعين.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">القيود على الاستخدام</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                يُحظر عليك القيام بما يلي:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>استخدام الموقع بأي طريقة تنتهك القوانين المحلية أو الدولية</li>
                <li>محاولة الوصول غير المصرح به إلى أنظمة الموقع</li>
                <li>نشر محتوى ضار أو مسيء من خلال الموقع</li>
                <li>استخدام برامج آلية لجمع البيانات من الموقع دون إذن</li>
                <li>انتهاك حقوق الملكية الفكرية لأي طرف</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">إخلاء المسؤولية</h2>
              <p className="text-muted-foreground leading-relaxed">
                يتم توفير الخطوط والخدمات "كما هي" دون أي ضمانات من أي نوع. نحن لا نضمن أن الخطوط ستكون خالية من الأخطاء أو أن الموقع سيعمل دون انقطاع. استخدامك للموقع والخطوط على مسؤوليتك الخاصة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">تحديد المسؤولية</h2>
              <p className="text-muted-foreground leading-relaxed">
                لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة أو عرضية أو خاصة أو تبعية ناتجة عن استخدام أو عدم القدرة على استخدام الموقع أو الخطوط.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">التعديلات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم نشر التعديلات على هذه الصفحة مع تاريخ "آخر تحديث" الجديد. استمرارك في استخدام الموقع بعد إجراء التعديلات يعني قبولك لهذه التعديلات.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">القانون الحاكم</h2>
              <p className="text-muted-foreground leading-relaxed">
                تخضع هذه الشروط وتفسر وفقاً للقوانين المعمول بها، دون النظر إلى أحكام تنازع القوانين.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">الاتصال</h2>
              <p className="text-muted-foreground leading-relaxed">
                إذا كان لديك أي أسئلة حول شروط الاستخدام هذه، يرجى التواصل معنا عبر البريد الإلكتروني: legal@arabic-fonts.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
