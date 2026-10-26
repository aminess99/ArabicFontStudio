import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Clock, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { createBreadcrumbSchema, SITE_ORIGIN } from "@/lib/schemas";
import { blogPosts as staticBlogPosts } from "@/lib/blogData";

interface GeneratedPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  dateISO: string;
  dateModified?: string;
  readTime: number;
  keywords: string[];
  generated: true;
}

export default function Blog() {
  const { data: generatedPosts = [] } = useQuery<GeneratedPost[]>({
    queryKey: ["/api/blog/posts"],
    staleTime: 5 * 60 * 1000,
  });

  const allPosts = [
    ...generatedPosts.map((p) => ({ ...p, isGenerated: true })),
    ...staticBlogPosts.map((p) => ({ ...p, isGenerated: false })),
  ].sort((a, b) => {
    const da = new Date(a.dateISO || "2025-01-01").getTime();
    const db = new Date(b.dateISO || "2025-01-01").getTime();
    return db - da;
  });

  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: "المدونة", href: "/blog" },
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "الرئيسية", url: `${SITE_ORIGIN}/` },
    { name: "المدونة", url: `${SITE_ORIGIN}/blog` },
  ]);

  const blogListSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      {
        "@type": "CollectionPage",
        name: "مدونة xfontat - نصائح وشروحات عن الخطوط العربية",
        description:
          "اقرأ مقالات مفيدة عن اختيار واستخدام الخطوط العربية في التصميم والمشاريع الرقمية.",
        url: `${SITE_ORIGIN}/blog`,
        inLanguage: "ar",
        isPartOf: {
          "@type": "WebSite",
          name: "xfontat",
          url: SITE_ORIGIN,
        },
      },
      {
        "@type": "ItemList",
        itemListElement: allPosts.map((post, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Article",
            headline: post.title,
            description: post.excerpt,
            url: `${SITE_ORIGIN}/blog/${post.slug}`,
            datePublished: post.dateISO,
            dateModified: post.dateModified || post.dateISO,
          },
        })),
      },
    ],
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
        <Header />

        <Breadcrumb items={breadcrumbItems} />

        <main className="flex-1 w-full px-4 py-6 md:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold mb-3">
                مقالات ونصائح عن الخطوط العربية
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                شروحات ودلائل شاملة لاختيار واستخدام الخطوط العربية في مشاريعك
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {allPosts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                  <Card
                    className="group p-4 md:p-6 hover-elevate cursor-pointer transition-all hover:border-primary"
                    data-testid={`card-blog-post-${post.slug}`}
                  >
                    <div className="flex gap-4">
                      {/* First letter of the title as a typographic mark. */}
                      <div aria-hidden="true" className="hidden sm:grid h-16 w-16 shrink-0 place-items-center rounded-lg bg-primary/10 text-3xl font-bold text-primary">
                        {post.title.trim().charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-3">
                        {post.keywords?.[0] && (
                          <span className="inline-block rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">{post.keywords[0]}</span>
                        )}
                        <h2 className="text-lg md:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-sm md:text-base text-muted-foreground">
                          {post.excerpt}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground pt-3 border-t">
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
