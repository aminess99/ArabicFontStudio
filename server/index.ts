import express, { type Request, Response, NextFunction } from "express";
import path from "path";
import compression from "compression";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();
app.use(compression());
// Thumbnail reference images arrive as base64 data URLs; keep the parser
// limit above the 6MB image limit enforced by the thumbnail endpoint.
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: false }));

// Explicitly allow indexing for all HTML pages
app.use((req, res, next) => {
  if (!req.path.startsWith("/api") && !req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|otf|txt|xml|json)$/i)) {
    res.setHeader("X-Robots-Tag", "index, follow");
  }
  next();
});

// Serve static files from client/public directory (for verification files, etc.)
// Fonts and other static assets rarely change, so cache them aggressively on
// the visitor's browser to cut down on repeat bandwidth costs.
app.use(express.static(path.resolve(import.meta.dirname, "..", "client", "public"), {
  redirect: false,
  maxAge: "30d",
  setHeaders: (res, filePath) => {
    if (/\.(woff2?|ttf|otf)$/i.test(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
    }
  },
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);
  
  // Load fonts into storage on startup - await to ensure fonts are loaded before serving requests
  try {
    const { loadFonts } = await import("./scripts/load-fonts");
    await loadFonts();
  } catch (err) {
    console.error("Failed to load fonts:", err);
  }

  // Start daily AI blog generator (2 posts/day, fully automatic, no UI button)
  try {
    const { startBlogCron } = await import("./blogGenerator");
    startBlogCron();
  } catch (err) {
    console.error("Failed to start blog generator:", err);
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
