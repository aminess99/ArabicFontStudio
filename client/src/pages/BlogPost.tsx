import { useRoute, Link } from "wouter";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { createBreadcrumbSchema } from "@/lib/schemas";
import { blogPosts } from "@/lib/blogData";

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug;

  const post = blogPosts.find(p => p.slug === slug);

  if (!match || !post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">المقال غير موجود</h1>
          <Link href="/blog" data-testid="link-back-blog-404">
            <span className="text-foreground hover:underline">العودة للمدونة</span>
          </Link>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: "الرئيسية", href: "/" },
    { label: "المدونة", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` }
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "الرئيسية", url: "https://www.xfontat.com/" },
    { name: "المدونة", url: "https://www.xfontat.com/blog" },
    { name: post.title, url: `https://www.xfontat.com/blog/${post.slug}` }
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      {
        "@type": "Article",
        "headline": post.title,
        "description": post.excerpt,
        "author": {
          "@type": "Person",
          "name": post.author
        },
        "publisher": {
          "@type": "Organization",
          "name": "xfontat",
          "url": "https://www.xfontat.com"
        },
        "datePublished": post.dateISO,
        "dateModified": post.dateISO,
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://www.xfontat.com/blog/${post.slug}`
        },
        "inLanguage": "ar",
        "keywords": post.keywords.join(", ")
      }
    ]
  };

  const paragraphs = post.content.split("\n\n");

  return (
    <>
      <SEOHead
        title={`${post.title} | مدونة xfontat`}
        description={post.excerpt}
        path={`/blog/${post.slug}`}
        schema={articleSchema}
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
          <article className="max-w-2xl mx-auto">
            <header className="mb-8">
              <h1 className="text-2xl md:text-4xl font-bold mb-4 leading-tight" data-testid="text-blog-title">
                {post.title}
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-4">{post.excerpt}</p>
              <div className="flex flex-wrap items-center gap-3 md:gap-5 text-xs md:text-sm text-muted-foreground border-t border-b py-3">
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} دقائق قراءة</span>
                </div>
              </div>
            </header>

            <div className="prose prose-lg max-w-none space-y-4">
              {paragraphs.map((paragraph, index) => {
                if (paragraph.startsWith("**") && paragraph.endsWith("**:")) {
                  return (
                    <h2 key={index} className="text-xl font-bold mt-6 mb-2">
                      {paragraph.replace(/\*\*/g, "").replace(/:$/, "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("**")) {
                  const heading = paragraph.match(/^\*\*(.+?)\*\*:?\s*/);
                  if (heading) {
                    const rest = paragraph.replace(/^\*\*(.+?)\*\*:?\s*/, "");
                    return (
                      <div key={index}>
                        <h3 className="text-lg font-bold mt-4 mb-1">{heading[1]}</h3>
                        {rest && <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{rest}</p>}
                      </div>
                    );
                  }
                }
                if (/^\d+\.\s/.test(paragraph)) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ol key={index} className="list-decimal list-inside space-y-2 text-muted-foreground">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item.replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (paragraph.startsWith("- ")) {
                  const items = paragraph.split("\n").filter(Boolean);
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item.replace(/^- /, "").replace(/\*\*/g, "")}
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={index} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {paragraph.replace(/\*\*/g, "")}
                  </p>
                );
              })}
            </div>

            <div className="mt-10 pt-6 border-t">
              <Link href="/blog" className="flex items-center gap-2 text-foreground hover:underline" data-testid="link-back-blog">
                <ArrowLeft className="w-4 h-4" />
                العودة إلى المدونة
              </Link>
            </div>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
