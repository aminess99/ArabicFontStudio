# Arabic Fonts Library Platform

## Overview

An Arabic fonts library platform inspired by Google Fonts and Adobe Fonts, specifically designed for Arabic typography with comprehensive RTL (right-to-left) interface support. The platform aims to be the leading resource for high-quality Arabic fonts, offering a curated collection, real-time font rendering, and customizable preview capabilities. Key features include a wide range of categories like Thuluth, Diwani, Ruqaa, Kufi, Naskh, and Design fonts, alongside advanced SEO optimizations for discoverability and a fully automated AI blog generation system to provide continuous fresh content. The business vision is to provide designers and developers with an accessible, robust, and user-friendly platform for Arabic fonts, catering to various use cases from branding to digital content creation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React and TypeScript, utilizing Vite for bundling and development. Wouter handles lightweight client-side routing. Data fetching and server state management are powered by TanStack Query.

**UI/UX Decisions:**
- **RTL-first design:** The entire interface is built with right-to-left language support as a priority, ensuring a natural experience for Arabic users.
- **Component Library:** Shadcn/ui, built on Radix UI primitives, provides accessible and customizable components.
- **Styling:** Tailwind CSS is used for utility-first styling, with a custom RTL-first design system and CSS variables for theming (dark/light mode).
- **Typography:** Cairo from Google Fonts is the primary Arabic typeface.
- **Layout:** A list-based interface displays fonts, featuring a two-section header with global search, theme toggle, and a toolbar for preview text input and font size adjustment (16-72px).
- **Interactive Elements:** Horizontal category filters, favorite font toggles, and a download button for each font are present.
- **Preview System:** All fonts display the same customizable preview text at an adjustable size, facilitating easy comparison.
- **SEO Elements:** The Express route injects route-specific metadata and crawler-visible fallback content into the SPA shell, while React continues to render normally after load. A database-backed sitemap, clean font URLs, legacy redirects, localized hreflang tags, and true 404 responses support indexing.
- **Blog and Collections:** Dedicated pages for blog articles and curated font collections based on use cases (e.g., "Fonts for Logos," "Fonts for Social Media") enhance content discoverability and SEO.

### Backend Architecture

The backend is an Express.js server built with TypeScript. In development it uses Vite middleware; in production it serves the built static assets. A central HTML route resolves page data and injects crawler-ready metadata and fallback content before the SPA loads.

**Data Management:**
- **Data Storage:** Drizzle ORM uses PostgreSQL through the `pg` driver. Font records and legacy-slug aliases persist in the database.
- **Font Data:** Fonts are defined with a schema including `id`, clean `slug`, `name`, `nameArabic`, `description`, `designer`, `category`, `style`, `fileUrl`, `fileName`, `fileFormat`, `featured` (boolean), and `addedAt` (timestamp).
- **Font Loading:** A server startup script (`load-fonts.ts`) scans `/client/public/fonts`, categorizes files by folder, extracts metadata, and upserts records using file modification times for `addedAt`. Old hashed URLs are retained as aliases and redirect to each font's clean slug. Supported formats are TTF, OTF, WOFF, and WOFF2.
- **API Endpoints:** Standard RESTful endpoints are provided for `GET /api/fonts`, `GET /api/fonts/:id`, `POST /api/fonts`, and `DELETE /api/fonts/:id`.

**Key Architectural Decisions:**
- **Storage Abstraction:** The storage interface keeps API handlers separate from PostgreSQL queries.
- **File-based Font Discovery:** Automates the process of adding new fonts without manual database entries.
- **Automatic AI Blog Generator:** A `node-cron` scheduled task (`server/blogGenerator.ts`) uses the Gemini model via Replit AI Integrations to generate two SEO-targeted blog articles daily. These articles are stored in `server/data/generatedPosts.json` and served via dedicated API endpoints.

## External Dependencies

**Core Libraries:**
- **@tanstack/react-query:** For server state management and data fetching.
- **drizzle-orm & drizzle-zod:** For database ORM and schema validation (configured for PostgreSQL).
- **pg:** PostgreSQL Node.js driver used by Drizzle ORM.
- **zod:** For runtime type validation.
- **node-cron:** For scheduling tasks (e.g., AI blog generation).
- **Replit AI Integrations:** For accessing the Gemini model for content generation.

**UI Components & Styling:**
- **@radix-ui/*:** Headless UI component primitives.
- **tailwindcss:** Utility-first CSS framework.
- **class-variance-authority & clsx:** Utilities for conditional class names.
- **lucide-react:** Icon library.

**Development Tools:**
- **vite:** Build tool and development server.
- **typescript:** For type checking.
- **tsx:** For running TypeScript files directly.
- **@replit/vite-plugin-*:** Replit-specific development enhancements.

**Utilities:**
- **wouter:** Lightweight client-side router.
- **date-fns:** For date formatting.