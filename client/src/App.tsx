import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
// Each page is its own chunk so visitors only download the page they open.
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
const EnglishDirectory = lazy(() => import("@/pages/EnglishDirectory"));
const LocalizedContentPage = lazy(() => import("@/pages/LocalizedContentPage"));
const Zakhrafa = lazy(() => import("@/pages/Zakhrafa"));
const ArabicTextToImage = lazy(() => import("@/pages/ArabicTextToImage"));
const PurpleLogoPreview = lazy(() =>
  import("@/pages/AIStudioPreview").then((m) => ({ default: m.PurpleLogoPreview })),
);
const YouTubeThumbnailPreview = lazy(() =>
  import("@/pages/AIStudioPreview").then((m) => ({ default: m.YouTubeThumbnailPreview })),
);

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
        <Suspense fallback={null}>
          <ScrollToTop />
          <YouTubeThumbnailPreview />
        </Suspense>
      );
    }

    if (previewPath === "/__preview/logo-maker") {
      return (
        <Suspense fallback={null}>
          <ScrollToTop />
          <PurpleLogoPreview />
        </Suspense>
      );
    }
  }

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<div className="min-h-screen bg-background" aria-label="Loading page" />}>
      <Switch>
        <Route path="/en" component={EnglishDirectory} />
        <Route path="/en/fonts/:category" component={EnglishDirectory} />
        <Route path="/fr" component={EnglishDirectory} />
        <Route path="/fr/fonts/:category" component={EnglishDirectory} />
        <Route path="/en/font/:slug" component={LocalizedContentPage} />
        <Route path="/fr/font/:slug" component={LocalizedContentPage} />
        <Route path="/en/collection/:slug" component={LocalizedContentPage} />
        <Route path="/fr/collection/:slug" component={LocalizedContentPage} />
        <Route path="/en/blog/:slug" component={LocalizedContentPage} />
        <Route path="/fr/blog/:slug" component={LocalizedContentPage} />
        <Route path="/en/blog" component={LocalizedContentPage} />
        <Route path="/fr/blog" component={LocalizedContentPage} />
        <Route path="/en/design-fonts" component={LocalizedContentPage} />
        <Route path="/fr/design-fonts" component={LocalizedContentPage} />
        <Route path="/en/about" component={LocalizedContentPage} />
        <Route path="/fr/about" component={LocalizedContentPage} />
        <Route path="/en/contact" component={LocalizedContentPage} />
        <Route path="/fr/contact" component={LocalizedContentPage} />
        <Route path="/en/privacy" component={LocalizedContentPage} />
        <Route path="/fr/privacy" component={LocalizedContentPage} />
        <Route path="/en/terms" component={LocalizedContentPage} />
        <Route path="/fr/terms" component={LocalizedContentPage} />
        <Route path="/en/youtube-thumbnail-maker" component={YouTubeThumbnailPreview} />
        <Route path="/fr/youtube-thumbnail-maker" component={YouTubeThumbnailPreview} />
        <Route path="/" component={Home} />
        <Route path="/youtube-thumbnail-maker" component={YouTubeThumbnailPreview} />
        <Route path="/zakhrafa" component={Zakhrafa} />
        <Route path="/arabic-text-to-image" component={ArabicTextToImage} />
        <Route path="/design-fonts" component={DesignFonts} />
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
