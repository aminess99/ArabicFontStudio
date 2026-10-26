import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Footer } from "@/components/Footer";
import { SEOHead } from "@/components/SEOHead";
import { blogPostPath } from "@/lib/blogSlugs";
import { Header } from "@/components/Header";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { createBreadcrumbSchema, SITE_ORIGIN } from "@/lib/schemas";
import { blogPosts as staticBlogPosts } from "@/lib/blogData";
import { getBlogInternalLinks } from "@/lib/blogInternalLinks";
import { getCanonicalFontSlug } from "@/lib/slugify";
import { renderMarkdownToHtml } from "@shared/markdown";
import type { Font } from "@shared/schema";

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
  const related = post ? getBlogInternalLinks(post) : null;
  const relatedCategories = related?.categories.map(link => encodeURIComponent(link.category)).join(",") || "";
  const { data: relatedFonts = [] } = useQuery<Font[]>({
    queryKey: [`/api/fonts?categories=${relatedCategories}`],
    enabled: !!post && !!relatedCategories,
    staleTime: 5 * 60 * 1000,
  });

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
        alternates={[
          { lang: "en", href: `https://xfontat.com${blogPostPath("en", post.slug)}` },
          { lang: "fr", href: `https://xfontat.com${blogPostPath("fr", post.slug)}` },
        ]}
      />
      <div className="flex flex-col min-h-screen bg-background">
        <Header />

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
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} دقائق قراءة</span>
                </div>
              </div>
            </header>

            <div
              className="prose prose-lg max-w-none space-y-4"
              dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(post.content) }}
            >
            </div>

            {related && (
              <aside className="mt-10 rounded-lg border bg-muted/30 p-5" aria-labelledby="related-fonts-heading">
                <h2 id="related-fonts-heading" className="text-xl font-bold mb-2">
                  خطوط ومجموعات مرتبطة بموضوع المقال
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  استكشف الخطوط العربية المناسبة لتطبيق النصائح الواردة في هذا المقال.
                </p>
                <ul className="space-y-2">
                  {related.categories.map(link => (
                    <li key={link.slug}>
                      <Link href={`/fonts/${link.slug}`} className="font-medium hover:underline">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  {related.collections.map(collection => (
                    <li key={collection.slug}>
                      <Link href={`/collection/${collection.slug}`} className="font-medium hover:underline">
                        {collection.titleArabic}
                      </Link>
                    </li>
                  ))}
                  {relatedFonts.slice(0, 4).map(font => (
                    <li key={font.id}>
                      <Link
                        href={`/font/${getCanonicalFontSlug(font)}`}
                        className="font-medium hover:underline"
                      >
                        تحميل خط {font.nameArabic}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

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
