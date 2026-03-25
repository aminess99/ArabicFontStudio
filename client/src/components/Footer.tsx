import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "خط الثلث", path: "/fonts/ثلث" },
    { name: "خط الديواني", path: "/fonts/ديواني" },
    { name: "خط الكوفي", path: "/fonts/كوفي" },
    { name: "خط النسخ", path: "/fonts/نسخ" },
    { name: "خط الرقعة", path: "/fonts/رقعة" },
    { name: "خطوط التصميم", path: "/fonts/تصميم" },
    { name: "خطوط فوتوشوب", path: "/fonts/فوتوشوب" },
  ];

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">xfontat</h3>
            <p className="text-sm text-muted-foreground">
              مكتبة شاملة للخطوط العربية الاحترافية مع إمكانية التحميل المجاني
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">روابط سريعة</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-home">
                  الصفحة الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/design-fonts" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-design-fonts">
                  خطوط التصميم
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-blog">
                  المدونة
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-about">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-contact">
                  اتصل بنا
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">تصنيفات الخطوط</h4>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.path}>
                  <Link href={cat.path} className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-footer-category-${cat.name}`}>
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">قانوني</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-privacy">
                  سياسة الخصوصية
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors" data-testid="link-footer-terms">
                  شروط الاستخدام
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {currentYear} xfontat. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}
