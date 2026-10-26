import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { homeFaqs } from "@/lib/homeContent";

const faqs = homeFaqs.map((faq, index) => ({ id: String(index + 1), ...faq }));

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
