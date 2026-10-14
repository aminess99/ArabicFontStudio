import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import Home from "@/pages/Home";
import DesignFonts from "@/pages/DesignFonts";
import CategoryFonts from "@/pages/CategoryFonts";
import FontDetails from "@/pages/FontDetails";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import NotFound from "@/pages/not-found";
import FontCollection from "@/pages/FontCollection";
import EnglishDirectory from "@/pages/EnglishDirectory";
import {
  PurpleLogoPreview,
  YouTubeThumbnailPreview,
} from "@/pages/AIStudioPreview";

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
      <Switch>
        <Route path="/en" component={EnglishDirectory} />
        <Route path="/en/fonts/:category" component={EnglishDirectory} />
        <Route path="/" component={Home} />
        <Route path="/youtube-thumbnail-maker" component={YouTubeThumbnailPreview} />
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
