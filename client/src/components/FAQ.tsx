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
    answer: "يمكنك تحميل أي خط بسهولة من خلال الضغط على زر 'تحميل' الأخضر بجانب كل خط. الخطوط متاحة بصيغ TTF و OTF و WOFF و WOFF2."
  },
  {
    id: "2",
    question: "هل جميع الخطوط مجانية للتحميل؟",
    answer: "نعم، جميع الخطوط في مكتبة xfontat متاحة للتحميل مجاناً بدون أي رسوم أو اشتراكات."
  },
  {
    id: "3",
    question: "ما الفرق بين صيغ الخطوط المختلفة؟",
    answer: "TTF: الصيغة الأساسية للخطوط، تعمل على معظم البرامج. OTF: صيغة متقدمة بميزات إضافية. WOFF: مصممة للويب بأحجام أصغر. WOFF2: نسخة محسّنة من WOFF بضغط أفضل."
  },
  {
    id: "4",
    question: "كيف أستخدم الخطوط في المشاريع التجارية؟",
    answer: "جميع الخطوط في xfontat متاحة للاستخدام في المشاريع الشخصية والتجارية. تحقق من رخصة كل خط للحصول على تفاصيل الاستخدام الكاملة."
  },
  {
    id: "5",
    question: "هل تدعم xfontat جميع أنظمة التشغيل؟",
    answer: "نعم، الخطوط متاحة لجميع أنظمة التشغيل: Windows و macOS و Linux وحتى الأجهزة المحمولة."
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
