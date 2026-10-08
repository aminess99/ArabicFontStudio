import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    id: "1",
    question: "كيف أحمل الخطوط من xfontat؟",
    answer: "افتح صفحة الخط واضغط على زر التنزيل؛ تعرض الصفحة الصيغة المتاحة لهذا الملف."
  },
  {
    id: "2",
    question: "هل جميع الخطوط مجانية للتحميل؟",
    answer: "نعم، جميع الخطوط في مكتبة xfontat متاحة للتحميل مجاناً بدون أي رسوم أو اشتراكات."
  },
  {
    id: "3",
    question: "ما الفرق بين صيغ الخطوط المختلفة؟",
    answer: "تختلف الصيغ المتاحة وخصائصها بحسب الملف. راجع صفحة الخط ومتطلبات البرنامج أو المتصفح المستهدف قبل الاستخدام."
  },
  {
    id: "4",
    question: "كيف أستخدم الخطوط في المشاريع التجارية؟",
    answer: "التحميل مجاني، لكن حقوق الاستخدام التجاري تختلف من خط إلى آخر. تحقق من رخصة كل خط قبل استخدامه في مشروع تجاري."
  },
  {
    id: "5",
    question: "هل يعمل الخط على نظام التشغيل الذي أستخدمه؟",
    answer: "يعتمد التوافق على صيغة الملف ونظام التشغيل والتطبيق. اختبر الخط في البيئة التي ستستخدمه فيها."
  }
];

export function FAQ() {
  return (
    <section className="border-t bg-background">
      <div className="container mx-auto px-3 md:px-4 py-8 md:py-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">الأسئلة الشائعة</h2>
        <p className="text-sm md:text-base text-muted-foreground mb-6">
          إجابات لأكثر الأسئلة التي نتلقاها من المستخدمين
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id} data-testid={`faq-item-${faq.id}`}>
              <AccordionTrigger className="text-right text-sm md:text-base hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs md:text-sm text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
