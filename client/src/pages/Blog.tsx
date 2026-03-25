import { Link } from "wouter";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createBreadcrumbSchema } from "@/lib/schemas";
import { blogPosts as allBlogPosts } from "@/lib/blogData";

export default function Blog() {
  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: "المدونة", href: "/blog" }
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "الرئيسية", url: "https://www.xfontat.com/" },
    { name: "المدونة", url: "https://www.xfontat.com/blog" }
  ]);

  const blogListSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      {
        "@type": "CollectionPage",
        "name": "مدونة xfontat - نصائح وشروحات عن الخطوط العربية",
        "description": "اقرأ مقالات مفيدة عن اختيار واستخدام الخطوط العربية في التصميم والمشاريع الرقمية.",
        "url": "https://www.xfontat.com/blog",
        "inLanguage": "ar",
        "isPartOf": {
          "@type": "WebSite",
          "name": "xfontat",
          "url": "https://www.xfontat.com"
        }
      },
      {
        "@type": "ItemList",
        "itemListElement": allBlogPosts.map((post, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "item": {
            "@type": "Article",
            "headline": post.title,
            "description": post.excerpt,
            "url": `https://www.xfontat.com/blog/${post.slug}`,
            "datePublished": post.dateISO,
            "author": { "@type": "Person", "name": post.author }
          }
        }))
      }
    ]
  };

  return (
    <>
      <SEOHead
        title="مدونة xfontat - نصائح وشروحات عن الخطوط العربية"
        description="اقرأ مقالات مفيدة عن اختيار واستخدام الخطوط العربية في التصميم والمشاريع الرقمية. دليل شامل لأنواع الخطوط العربية وأفضل الممارسات."
        path="/blog"
        schema={blogListSchema}
      />
      <div className="flex flex-col min-h-screen bg-background">
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="w-full px-4 py-3">
            <div className="flex items-center justify-between gap-2">
              <Link href="/" className="flex items-center hover:opacity-80 transition-opacity flex-shrink-0" data-testid="link-home">
                <img src="/logo.png" alt="xfontat" className="h-8 md:h-10 w-auto" />
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <Breadcrumb items={breadcrumbItems} />

        <main className="flex-1 w-full px-4 py-6 md:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">مقالات ونصائح عن الخطوط العربية</h1>
              <p className="text-base md:text-lg text-muted-foreground">شروحات ودلائل شاملة لاختيار واستخدام الخطوط العربية في مشاريعك</p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {allBlogPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`}>
                  <Card className="p-4 md:p-6 hover-elevate cursor-pointer transition-all" data-testid={`card-blog-post-${post.slug}`}>
                    <div className="space-y-3">
                      <h2 className="text-lg md:text-xl font-bold text-foreground">{post.title}</h2>
                      
                      <p className="text-sm md:text-base text-muted-foreground">{post.excerpt}</p>
                      
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 md:w-4 md:h-4" />
                          <span>{post.readTime} دقائق</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
