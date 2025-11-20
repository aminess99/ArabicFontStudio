import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { createWebPageSchema } from "@/lib/schemas";
import { Mail, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Contact() {
  const schema = createWebPageSchema({
    name: "اتصل بنا - xfontat",
    description: "تواصل مع فريق xfontat. نحن هنا للإجابة على أسئلتك ومساعدتك في كل ما يتعلق بالخطوط العربية.",
    url: "https://www.xfontat.com/contact"
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SEOHead 
        title="اتصل بنا | xfontat"
        description="تواصل مع فريق xfontat للدعم الفني والاقتراحات والاستفسارات. نحن هنا لمساعدتك في الحصول على أفضل تجربة مع الخطوط العربية."
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
          <h1 className="text-4xl font-bold mb-8 text-center">اتصل بنا</h1>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <p className="text-center text-muted-foreground text-lg">
              نحن هنا للإجابة على أسئلتك ومساعدتك. لا تتردد في التواصل معنا!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
              <div className="text-center p-6 border rounded-lg">
                <Mail className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">البريد الإلكتروني</h3>
                <p className="text-sm text-muted-foreground">
                  info@arabic-fonts.com
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">الدعم الفني</h3>
                <p className="text-sm text-muted-foreground">
                  support@arabic-fonts.com
                </p>
              </div>
              
              <div className="text-center p-6 border rounded-lg">
                <Send className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">الاقتراحات</h3>
                <p className="text-sm text-muted-foreground">
                  suggestions@arabic-fonts.com
                </p>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6">أرسل لنا رسالة</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">الاسم</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="أدخل اسمك"
                    data-testid="input-name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="أدخل بريدك الإلكتروني"
                    data-testid="input-email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">الموضوع</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg bg-background"
                    placeholder="موضوع الرسالة"
                    data-testid="input-subject"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">الرسالة</label>
                  <textarea 
                    className="w-full px-4 py-2 border rounded-lg bg-background min-h-[150px]"
                    placeholder="اكتب رسالتك هنا..."
                    data-testid="input-message"
                  />
                </div>
                
                <Button className="w-full" size="lg" data-testid="button-send">
                  <Send className="ml-2 h-4 w-4" />
                  إرسال الرسالة
                </Button>
              </div>
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
