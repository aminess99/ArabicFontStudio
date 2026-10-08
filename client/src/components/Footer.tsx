import { Link } from "wouter";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const categories = [
    { name: "خط الثلث", path: "/fonts/thuluth" },
    { name: "خط الديواني", path: "/fonts/diwani" },
    { name: "خط الكوفي", path: "/fonts/kufi" },
    { name: "خط النسخ", path: "/fonts/naskh" },
    { name: "خط الرقعة", path: "/fonts/ruqaa" },
    { name: "خطوط التصميم", path: "/fonts/tasmeem" },
    { name: "خطوط الحرة", path: "/fonts/graffiti" },
    { name: "خطوط فوتوشوب", path: "/fonts/photoshop" },
    { name: "خطوط النستعليق", path: "/fonts/nastaliq" },
  ];

  const collections = [
    { name: "خطوط للشعارات", path: "/collection/khotot-lil-shiaarat" },
    { name: "خطوط للتيك توك", path: "/collection/khotot-lil-tiktok" },
    { name: "خطوط مزخرفة", path: "/collection/khotot-muzakhrafa" },
    { name: "خطوط للكتب", path: "/collection/khotot-lil-kotob" },
    { name: "خطوط للفوتوشوب", path: "/collection/khotot-lil-photoshop" },
    { name: "خطوط لليوتيوبرز", path: "/collection/khotot-lil-youtubiyeen" },
    { name: "خطوط للدعوات", path: "/collection/khotot-lil-dawaat" },
    { name: "خطوط مجانية", path: "/collection/khotot-bidoon-hoqooq" },
  ];

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">xfontat</h3>
            <p className="text-sm text-muted-foreground">
              تصفّح الخطوط العربية واطّلع على الصيغ والتراخيص المتاحة لكل ملف
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
            <h4 className="font-semibold mb-4">مجموعات الخطوط</h4>
            <ul className="space-y-2 text-sm">
              {collections.map((col) => (
                <li key={col.path}>
                  <Link href={col.path} className="text-muted-foreground hover:text-foreground transition-colors" data-testid={`link-footer-collection-${col.name}`}>
                    {col.name}
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
