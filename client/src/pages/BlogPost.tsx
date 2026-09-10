import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
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

function renderMarkdown(content: string) {
  const paragraphs = content.split("\n\n").filter(Boolean);
  return paragraphs.map((block, index) => {
    const trimmed = block.trim();

    if (/^## .+/.test(trimmed)) {
      return (
        <h2 key={index} className="text-xl md:text-2xl font-bold mt-8 mb-3 text-foreground">
          {trimmed.replace(/^## /, "")}
        </h2>
      );
    }

    if (/^### .+/.test(trimmed)) {
      return (
        <h3 key={index} className="text-lg md:text-xl font-bold mt-6 mb-2 text-foreground">
          {trimmed.replace(/^### /, "")}
        </h3>
      );
    }

    if (trimmed.startsWith("**") && trimmed.endsWith("**:")) {
      return (
        <h2 key={index} className="text-xl font-bold mt-6 mb-2 text-foreground">
          {trimmed.replace(/\*\*/g, "").replace(/:$/, "")}
        </h2>
      );
    }

    if (trimmed.startsWith("**")) {
      const heading = trimmed.match(/^\*\*(.+?)\*\*:?\s*/);
      if (heading) {
        const rest = trimmed.replace(/^\*\*(.+?)\*\*:?\s*/, "");
        return (
          <div key={index}>
            <h3 className="text-lg font-bold mt-4 mb-1 text-foreground">{heading[1]}</h3>
            {rest && (
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {rest.replace(/\*\*/g, "")}
              </p>
            )}
          </div>
        );
      }
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const items = trimmed.split("\n").filter(Boolean);
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

    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      const items = trimmed.split("\n").filter(Boolean);
      return (
        <ul key={index} className="list-disc list-inside space-y-2 text-muted-foreground">
          {items.map((item, i) => (
            <li key={i} className="leading-relaxed">
              {item.replace(/^[-*]\s/, "").replace(/\*\*/g, "")}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <p key={index} className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
        {trimmed.replace(/\*\*/g, "")}
      </p>
    );
  });
}

export default function BlogPost() {
  const [match, params] = useRoute("/blog/:slug");
  const slug = params?.slug || "";

  const staticPost = staticBlogPosts.find((p) => p.slug === slug);
  const isGeneratedSlug = !staticPost && slug.startsWith("gen-");

  const { data: generatedPost, isLoading } = useQuery<GeneratedPost>({
    queryKey: [`/api/blog/posts/${slug}`],
    enabled: !staticPost && !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const post = staticPost || generatedPost;

  if (!match) return null;

  if (!staticPost && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center text-muted-foreground">جاري التحميل...</div>
      </div>
    );
  }

  if (!post) {
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
    { label: post.title, href: `/blog/${post.slug}` },
  ];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "الرئيسية", url: `${SITE_ORIGIN}/` },
    { name: "المدونة", url: `${SITE_ORIGIN}/blog` },
    { name: post.title, url: `${SITE_ORIGIN}/blog/${post.slug}` },
  ]);

  const articleSchema = {
    "@context": "https://schema.org",
    "@graph": [
      breadcrumbSchema,
      {
        "@type": "Article",
        headline: post.title,
        description: post.excerpt,
        author: { "@type": "Person", name: post.author },
        publisher: {
          "@type": "Organization",
          name: "xfontat",
          url: SITE_ORIGIN,
        },
        datePublished: post.dateISO,
        dateModified: post.dateModified || post.dateISO,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${SITE_ORIGIN}/blog/${post.slug}`,
        },
        inLanguage: "ar",
        keywords: (post.keywords || []).join(", "),
      },
    ],
  };

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
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity shrink-0"
                data-testid="link-home"
              >
                <img src="/logo.png" alt="xfontat" className="h-8 md:h-10 w-auto" />
              </Link>
              <nav className="hidden md:flex items-center gap-4 text-sm flex-1">
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-nav-home"
                >
                  الرئيسية
                </Link>
                <Link
                  href="/design-fonts"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  data-testid="link-nav-design"
                >
                  خطوط التصميم
                </Link>
                <Link
                  href="/blog"
                  className="text-foreground font-medium"
                  data-testid="link-nav-blog"
                >
                  المدونة
                </Link>
              </nav>
              <ThemeToggle />
            </div>
          </div>
        </header>

        <Breadcrumb items={breadcrumbItems} />

        <main className="flex-1 w-full px-4 py-6 md:py-12">
          <article className="max-w-2xl mx-auto">
            <header className="mb-8">
              <h1
                className="text-2xl md:text-4xl font-bold mb-4 leading-tight"
                data-testid="text-blog-title"
              >
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
              {renderMarkdown(post.content)}
            </div>

            <div className="mt-10 pt-6 border-t">
              <Link
                href="/blog"
                className="flex items-center gap-2 text-foreground hover:underline"
                data-testid="link-back-blog"
              >
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
