import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { createWebPageSchema, SITE_ORIGIN } from "@/lib/schemas";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FormEvent } from "react";

export default function Contact() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const subject = String(form.get("subject") || "").trim() || "رسالة عبر موقع xfontat";
    const message = String(form.get("message") || "").trim();
    const body = `الاسم: ${name}\nالبريد الإلكتروني: ${email}\n\n${message}`;
    window.location.href = `mailto:info@xfontat.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const schema = createWebPageSchema({
    name: "اتصل بنا - xfontat",
    description: "تواصل مع فريق xfontat. نحن هنا للإجابة على أسئلتك ومساعدتك في كل ما يتعلق بالخطوط العربية.",
    url: `${SITE_ORIGIN}/contact`
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="اتصل بنا | xfontat — دعم مكتبة الخطوط العربية والمساعدة"
        description="تواصل مع فريق xfontat للحصول على دعم مكتبة الخطوط العربية، إرسال الاقتراحات، والإبلاغ عن مشكلات التحميل أو الاستخدام وسنساعدك سريعاً."
        path="/contact"
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
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">تواصل معنا</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-center text-muted-foreground text-lg">
              نحن هنا للإجابة على أسئلتك ومساعدتك. لا تتردد في التواصل معنا!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="text-center p-6 border rounded-lg">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">البريد الإلكتروني</h3>
                <p className="text-sm text-muted-foreground">
                  <a className="text-primary underline" href="mailto:info@xfontat.com">info@xfontat.com</a>
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">الدعم الفني</h3>
                <p className="text-sm text-muted-foreground">
                  <a className="text-primary underline" href="mailto:support@xfontat.com">support@xfontat.com</a>
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <Send className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">الاقتراحات</h3>
                <p className="text-sm text-muted-foreground">
                  <a className="text-primary underline" href="mailto:suggestions@xfontat.com">suggestions@xfontat.com</a>
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">أرسل لنا رسالة</h2>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-2">الاسم</label>
                  <input 
                    id="contact-name"
                    type="text" 
                    name="name"
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="أدخل اسمك"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input 
                    id="contact-email"
                    type="email" 
                    name="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="أدخل بريدك الإلكتروني"
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-subject" className="block text-sm font-medium mb-2">الموضوع</label>
                  <input 
                    id="contact-subject"
                    type="text" 
                    name="subject"
                    required
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="موضوع الرسالة"
                    data-testid="input-subject"
                  />
                </div>
                
                <div>
                  <label htmlFor="contact-message" className="block text-sm font-medium mb-2">الرسالة</label>
                  <textarea 
                    id="contact-message"
                    name="message"
                    className="w-full px-4 py-2 border rounded-lg bg-background min-h-[150px]"
                    placeholder="اكتب رسالتك هنا..."
                    required
                    data-testid="input-message"
                  />
                </div>
                
                <Button type="submit" className="w-full" size="lg" data-testid="button-send">
                  <Send className="ml-2 h-4 w-4" />
                  فتح تطبيق البريد وإرسال الرسالة
                </Button>
                <p className="text-xs text-muted-foreground">
                  ستُفتح الرسالة في تطبيق البريد لديك؛ لا تُرسل الرسالة من الموقع مباشرة.
                </p>
              </form>
            </div>

            <div className="text-center text-muted-foreground text-sm">
              <p>سنقوم بالرد على رسالتك في أقرب وقت ممكن. شكراً لتواصلك معنا!</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
