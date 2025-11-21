import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Card } from "@/components/ui/card";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: number;
}

const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "دليل شامل لاختيار الخط العربي المناسب",
    excerpt: "تعرف على كيفية اختيار الخط العربي الذي يناسب مشروعك التصميمي والعوامل التي يجب مراعاتها.",
    content: `اختيار الخط المناسب هو أحد أهم عناصر التصميم. عند العمل مع النصوص العربية، يجب أن تأخذ في الاعتبار عدة عوامل:

1. **الجمهور المستهدف**: اختر خطاً مناسباً لجمهورك. الخطوط الكلاسيكية مثل النسخ والكوفي تناسب المحتوى الرسمي والديني.

2. **الوضوح والقراءة**: تأكد من أن الخط سهل القراءة، خاصة إذا كان يُستخدم على أحجام صغيرة.

3. **التوافقية**: اختر خطاً متوافقاً مع جميع المنصات والأجهزة.

4. **الأسلوب والشخصية**: كل خط له شخصية خاصة. اختر الخط الذي ينقل رسالتك بشكل صحيح.

مكتبة xfontat توفر مجموعة شاملة من الخطوط العربية المحترفة التي تناسب جميع احتياجات مشاريعك.`,
    author: "فريق xfontat",
    date: "21 نوفمبر 2025",
    readTime: 5
  },
  {
    id: "2",
    title: "الفرق بين خطوط الثلث والكوفي والرقعة",
    excerpt: "شرح مفصل للفروقات بين أشهر أنواع الخطوط العربية وحالات استخدام كل منها.",
    content: `الخطوط العربية تتمتع بتنوع غني وتاريخ عريق. إليك شرح للفروقات الرئيسية:

**خط الثلث**:
- يتميز بأناقته وجماله
- يُستخدم في العنوانات والنصوص الفاخرة
- يتطلب مهارة عالية في الكتابة

**خط الكوفي**:
- خط هندسي وكلاسيكي
- يُستخدم في الزخرفة والعناوين
- يتميز بقوة وجرأة في الشكل

**خط الرقعة**:
- خط عملي وسهل القراءة
- يُستخدم في الكتابات اليومية والرسائل
- يتميز برشاقة وسهولة الكتابة

اختيار النوع المناسب يعتمد على احتياجات مشروعك والجمهور المستهدف.`,
    author: "أحمد محمد",
    date: "20 نوفمبر 2025",
    readTime: 7
  },
  {
    id: "3",
    title: "أفضل الممارسات في استخدام الخطوط العربية في التصميم الرقمي",
    excerpt: "نصائح عملية لاستخدام الخطوط العربية بفعالية في تصميم المواقع والتطبيقات.",
    content: `عند تصميم واجهات رقمية بالعربية، هناك عدة ممارسات يجب اتباعها:

**1. حجم الخط المناسب**:
- للعناوين الرئيسية: 32px فأعلى
- للعناوين الفرعية: 24px
- للنصوص العادية: 16px على الأقل
- للملاحظات الصغيرة: 14px

**2. التباعد والهامش**:
- أضف تباعداً كافياً بين الأسطر
- استخدم هوامش مناسبة حول النص
- تأكد من أن النص ليس مكتظاً جداً

**3. التباين اللوني**:
- تأكد من وجود تباين كافٍ بين النص والخلفية
- تجنب الألوان الضعيفة التي صعب قراءتها

**4. اختبار على أجهزة مختلفة**:
- اختبر الخط على أحجام شاشات مختلفة
- تأكد من التوافقية عبر المتصفحات والأجهزة`,
    author: "فاطمة علي",
    date: "19 نوفمبر 2025",
    readTime: 6
  },
  {
    id: "4",
    title: "كيفية تنزيل واستخدام الخطوط العربية من xfontat",
    excerpt: "شرح خطوة بخطوة لتنزيل وتثبيت واستخدام الخطوط العربية في مشاريعك.",
    content: `مكتبة xfontat تجعل من السهل جداً العثور على الخطوط المناسبة واستخدامها:

**خطوات التنزيل**:
1. تصفح مكتبتنا الشاملة للخطوط العربية
2. اختر الخط الذي يعجبك
3. اضغط على زر التحميل الأخضر
4. سيبدأ التنزيل تلقائياً

**تثبيت الخط على نظام Windows**:
1. افتح المجلد الذي قمت بتحميل الخط فيه
2. انقر بزر الماوس الأيمن على ملف الخط
3. اختر "Install" أو "تثبيت"
4. انتظر حتى اكتمل التثبيت

**تثبيت الخط على Mac**:
1. افتح ملف الخط بـ Font Book
2. اضغط على "Install Font"
3. الخط جاهز للاستخدام

**استخدام الخط في برامج التصميم**:
1. بعد التثبيت، ستجد الخط في قائمة الخطوط
2. اختره وابدأ بالاستخدام

نتمنى لك تجربة رائعة مع خطوطنا!`,
    author: "محمود سالم",
    date: "18 نوفمبر 2025",
    readTime: 4
  },
  {
    id: "5",
    title: "التصميم المسؤول: استخدام الخطوط العربية بشكل أخلاقي",
    excerpt: "نقاش حول الاستخدام الأخلاقي والمسؤول للخطوط العربية واحترام حقوق التصميم.",
    content: `مع نمو صناعة التصميم الرقمي، يجب أن نركز على الاستخدام الأخلاقي والمسؤول للخطوط:

**احترام حقوق النشر**:
- تأكد من استخدام الخطوط بموجب الترخيص المناسبة
- تحقق من شروط الاستخدام قبل الاستخدام التجاري
- أعط الفضل للمصمم الأصلي عند الإمكان

**المسؤولية الاجتماعية**:
- استخدم الخطوط لنشر محتوى مفيد وقيم
- تجنب استخدام الخطوط في محتوى مسيء أو ضار
- ادعم الفنانين والمصممين المحليين

**الشمول والإتاحة**:
- اختر خطوطاً سهلة القراءة للمستخدمين الذين يعانون من صعوبات في البصر
- تأكد من أن تصميمك يخدم الجميع
- استخدم أحجام خطوط مناسبة للقراءة

xfontat ملتزمة بتقديم خطوط عالية الجودة مع احترام حقوق المصممين والمستخدمين.`,
    author: "ليلى عمر",
    date: "17 نوفمبر 2025",
    readTime: 5
  }
];

export default function Blog() {
  return (
    <>
      <SEOHead
        title="مدونة xfontat - نصائح وشروحات عن الخطوط العربية"
        description="اقرأ مقالات مفيدة عن اختيار واستخدام الخطوط العربية في التصميم والمشاريع الرقمية."
        path="/blog"
      />
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="w-full px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <Link href="/" className="flex items-center gap-1 hover:opacity-80 transition-opacity flex-shrink-0">
                <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
                <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">العودة</span>
              </Link>
              <h1 className="text-lg md:text-2xl font-bold flex-1 text-center">مدونة</h1>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 w-full px-4 py-6 md:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">مقالات ونصائح</h2>
              <p className="text-base md:text-lg text-muted-foreground">شروحات عن الخطوط العربية</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {blogPosts.map((post) => (
                <Card key={post.id} className="p-4 md:p-6 hover-elevate cursor-pointer transition-all" data-testid={`card-blog-post-${post.id}`}>
                  <div className="space-y-3">
                    <h3 className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors">{post.title}</h3>
                    
                    <p className="text-sm md:text-base text-muted-foreground">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground pt-3 border-t">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span>{post.readTime} دقائق</span>
                      </div>
                      <span className="ml-auto">{post.date}</span>
                    </div>

                    <div className="pt-3 md:pt-4 border-t">
                      <p className="text-xs md:text-sm text-foreground whitespace-pre-wrap leading-relaxed line-clamp-3">{post.content}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
