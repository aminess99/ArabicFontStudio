import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
const Home = lazy(() => import("@/pages/Home"));
const DesignFonts = lazy(() => import("@/pages/DesignFonts"));
const CategoryFonts = lazy(() => import("@/pages/CategoryFonts"));
const FontDetails = lazy(() => import("@/pages/FontDetails"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const About = lazy(() => import("@/pages/About"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const NotFound = lazy(() => import("@/pages/not-found"));
const FontCollection = lazy(() => import("@/pages/FontCollection"));
const FontDirectory = lazy(() => import("@/pages/FontDirectory"));
const PurpleLogoPreview = lazy(() =>
  import("@/pages/AIStudioPreview").then(module => ({ default: module.PurpleLogoPreview })),
);
const YouTubeThumbnailPreview = lazy(() =>
  import("@/pages/AIStudioPreview").then(module => ({ default: module.YouTubeThumbnailPreview })),
);

export function preloadRouteForPath(path: string): Promise<unknown> {
  if (path === "/") return import("@/pages/Home");
  if (path === "/fonts") return import("@/pages/FontDirectory");
  if (path === "/design-fonts") return import("@/pages/DesignFonts");
  if (path === "/youtube-thumbnail-maker") return import("@/pages/AIStudioPreview");
  if (path === "/about") return import("@/pages/About");
  if (path === "/contact") return import("@/pages/Contact");
  if (path === "/privacy") return import("@/pages/Privacy");
  if (path === "/terms") return import("@/pages/Terms");
  if (path === "/blog") return import("@/pages/Blog");
  if (path.startsWith("/font/")) return import("@/pages/FontDetails");
  if (path.startsWith("/fonts/")) return import("@/pages/CategoryFonts");
  if (path.startsWith("/blog/")) return import("@/pages/BlogPost");
  if (path.startsWith("/collection/")) return import("@/pages/FontCollection");
  if (path.startsWith("/__preview/")) return import("@/pages/AIStudioPreview");
  return import("@/pages/not-found");
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  useAnalytics();
  const previewPath =
    typeof window !== "undefined" ? window.location.pathname : "";

  if (import.meta.env.DEV) {
    if (previewPath === "/__preview/youtube-thumbnail-maker") {
      return (
        <>
          <ScrollToTop />
          <YouTubeThumbnailPreview />
        </>
      );
    }

    if (previewPath === "/__preview/logo-maker") {
      return (
        <>
          <ScrollToTop />
          <PurpleLogoPreview />
        </>
      );
    }
  }

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="container mx-auto p-8 text-center" role="status">جاري تحميل الصفحة…</div>}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/youtube-thumbnail-maker" component={YouTubeThumbnailPreview} />
        <Route path="/design-fonts" component={DesignFonts} />
        <Route path="/fonts" component={FontDirectory} />
        <Route path="/font/:slug" component={FontDetails} />
        <Route path="/fonts/:category" component={CategoryFonts} />
        <Route path="/collection/:slug" component={FontCollection} />
        <Route path="/blog/:slug" component={BlogPost} />
        <Route path="/blog" component={Blog} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
      </Suspense>
    </>
  );
}

export default function App() {
  useEffect(() => {
    if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
